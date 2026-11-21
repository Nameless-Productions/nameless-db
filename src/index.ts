import { startServer } from "./server.js";

type Entry = {
    data: string
}
export const data = new Map<string, Entry>();

startServer()