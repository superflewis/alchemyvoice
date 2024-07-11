
// socketHandler.js
const socketIo = require('socket.io');

class SocketHandler {
    constructor(server) {
        this.io = socketIo(server);
        this.io.on('connection', (socket) => {
            console.log('New client connected');

            socket.on('disconnect', () => {
                console.log('Client disconnected');
            });

            // Add more event handlers here
        });
    }

    emit(event, data) {
        this.io.emit(event, data);
    }

    on(event, handler) {
        this.io.on(event, handler);
    }
}

module.exports = SocketHandler;
