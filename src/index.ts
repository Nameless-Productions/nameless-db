import "./handle.js";
import { debug } from "./debug.js";
import { startServer } from "./server.js";

type Entry = {
    data: string
}
export const data = new Map<string, Entry>();

if (debug) console.warn("Debug mode enabled")

startServer()