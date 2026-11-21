import net from "net"

export const server = net.createServer()
export let isStarted = false;


export function startServer() {
    const port = isNaN(Number(process.env.PORT)) ? 6666 : Number(process.env.PORT);

    server.listen(port, () => console.log(`Running on port ${port}`));
    isStarted = true;
}