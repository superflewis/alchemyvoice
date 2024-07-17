// Path: src/socket.js
const socketIo = require('socket.io');

let io;

module.exports = {
    init: (server) => {
        io = socketIo(server);
        return io;
    },
    get io() {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
