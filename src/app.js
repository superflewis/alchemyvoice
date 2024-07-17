const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { logWithTimestamp } = require('./utils/logger');
const { initializeWakeWordDetection } = require('./controllers/wakeWordController');
const { scheduleHourlyAnnouncements } = require('./utils/scheduler');
const { playSound } = require('./utils/polly_util');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    logWithTimestamp('New client connected');
    socket.on('disconnect', () => {
        logWithTimestamp('Client disconnected');
    });
});

// Schedule hourly announcements
scheduleHourlyAnnouncements();

server.listen(PORT, () => {
    logWithTimestamp(`Server is running on port ${PORT}`);
    playStartupMessage();
    initializeWakeWordDetection();
});

async function playStartupMessage() {
    try {
        const message = 'System Started';
        const { synthesizeSpeech } = require('./utils/polly_util');
        logWithTimestamp('Playing startup message...');
        await synthesizeSpeech(message);
        logWithTimestamp('Startup message played successfully');
    } catch (error) {
        logWithTimestamp(`Error playing startup message: ${error.message}`);
    }
}
