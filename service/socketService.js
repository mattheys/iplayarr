const sockets = {};
let io = null;

const socketService = {

    registerIo : (server) => {
        io = server;
    },

    registerSocket : (socket) => {
        sockets[socket.id] = socket;

        socket.on('disconnect', () => {
            delete sockets[socket.id];
        });
    },

    emit : (subject, message) => {
        io.emit(subject, message);
    }
}

export default socketService;