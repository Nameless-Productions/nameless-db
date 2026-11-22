import { debug } from "./debug.js";
import { server } from "./server.js";
import readline from "readline"
import { deleteValue, getValue, setValue } from "./utils.js";

server.once("listening", () => {
    if (debug) console.log("Server listening");
    if  (!process.env.PASSWORD) throw new Error("Missing password")
    server.on("connection", async (socket) => {
        let isAuthed = false;

        if (debug) {
            console.log(`New connection: ${socket.remoteAddress}`)
            socket.on("close", () => console.log(`Connection closed with ${socket.remoteAddress}`))
        }

        const rl = readline.createInterface({input: socket});

        rl.on("line", async (line) => {
            const [command, ...args] = line.split(" ");
            if (command !== "AUTH" && !isAuthed) {
                socket.write("ERROR not authed\n");
                return;
            }

            switch (command) {
                case "PING": {
                    socket.write("PONG\n");
                    break;
                }
                case "GET": {
                    if (!args[0]) {
                        socket.write("ERROR No name provided\n");
                        break;
                    }
                    const value = getValue(args[0]);
                    socket.write(`VALUE ${args[0]} ${value}\n`);
                    break;
                }
                case "SET": {
                    if (!args[0] || !args[1]) {
                        socket.write("ERROR missing arg(s)\n");
                        break;
                    }

                    setValue(args[0], args.slice(1).join(" "));
                    socket.write(`VALUE ${args[0]} ${args.slice(1).join(" ")}\n`);
                    break;
                }
                case "DELETE": {
                    if (!args[0]) {
                        socket.write("ERROR missing arg\n");
                        break;
                    }

                    deleteValue(args[0]);
                    break;
                }
                case "AUTH": {
                    if (!args[0]) {
                        socket.write("ERROR Missing password\n");
                        break;
                    }

                    const password = process.env.PASSWORD!;
                    if (args[0] !== password) {
                        socket.write("ERROR Incorrect password");
                        break;
                    }
                    socket.write("HELLO\n");
                    isAuthed = true;
                    break;
                    
                }
                default: {
                    socket.write("ERROR Command not found\n");
                }
            }
        })
        
        socket.on("error", (error) => console.error(error))
    })
}) 