import { debug } from "./debug.js";
import { server } from "./server.js";

server.once("listening", () => {
    if (debug) console.log("Server listening")
    server.on("connection", async (socket) => {
        if (debug) console.log(`New connection: ${socket.remoteAddress}`);
        
        socket.on("error", (error) => console.error(error))
    })
}) 