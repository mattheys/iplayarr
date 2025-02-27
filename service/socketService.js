const sockets = {};
let io = null;

const socketService = {

    registerIo : (server) => {
        io = server;
    },

    registerSocket : (socket) => {
        sockets[socket.id] = socket;
        //createTestDownload();

        socket.on('disconnect', () => {
            delete sockets[socket.id];
        });
    },

    emit : (subject, message) => {
        io.emit(subject, message);
    }
}


// This is a test function
function createTestDownload(){
    const download = {
        id : "testDownload",
        progress: 50,
        size: 1256,
        sizeLeft: 1000,
        speed: 85,
        eta: "0:03:00",
        start: new Date(),
        filename: "DannyDyersCholoclateHomunculus.S01E01.WEB.BBC.mp4"
    };

    socketService.emit('downloads', [download, download]);
}

export default socketService;