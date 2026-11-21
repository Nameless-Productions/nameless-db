import { Socket } from "dgram";
import { debug } from "./debug.js";
import { server } from "./server.js";
import readline from "readline"

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
                default: {
                    socket.write("ERROR Command not found\n");
                }
            }
        })
        
        socket.on("error", (error) => console.error(error))
    })
}) 