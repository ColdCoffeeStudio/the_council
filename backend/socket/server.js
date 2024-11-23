import { Server } from 'socket.io';

const server_port = 2999;
export const io = new Server(server_port, {
    cors: {
        origin: ['http://localhost:3000'],
    }
});

io.on("connection", (socket) => {
    console.log(">>> INFO: Connection connected!");
    console.log(">>> DEBUG: ID - " + socket.id);
});