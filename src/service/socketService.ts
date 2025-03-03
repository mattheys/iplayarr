import { Server, Socket } from "socket.io";

const sockets : {
    [key : string] : Socket
} = {};
let io : Server | undefined = undefined;

const socketService = {

    registerIo : (server : Server) => {
        io = server;
        io.on("connection", (socket) => {
            socketService.registerSocket(socket);
        });
    },

    registerSocket : (socket : Socket) => {
        sockets[socket.id] = socket;

        socket.on('disconnect', () => {
            delete sockets[socket.id];
        });
    },

    emit : (subject : string, message : any) => {
        (io as Server).emit(subject, message);
    }
}

export default socketService;