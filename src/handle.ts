import { debug } from "./debug.js";
import { server } from "./server.js";
import readline from "readline"
import { deleteValue, getValue, setValue } from "./utils.js";

server.once("listening", () => {
    if (debug) console.log("Server listening")
    server.on("connection", async (socket) => {
        socket.write("HELLO\n");
        if (debug) {
            console.log(`New connection: ${socket.remoteAddress}`)
            socket.on("close", () => console.log(`Connection closed with ${socket.remoteAddress}`))
        }

        const rl = readline.createInterface({input: socket});

        rl.on("line", async (line) => {
            const [command, ...args] = line.split(" ");

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
                        socket.write("ERROR missing arg(s)");
                        break;
                    }

                    setValue(args[0], args[1]);
                    socket.write(`VALUE ${args[0]} ${args[1]}\n`);
                    return;
                }
                case "DELETE": {
                    if (!args[0]) {
                        socket.write("ERROR missing arg");
                        return;
                    }

                    deleteValue(args[0]);
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