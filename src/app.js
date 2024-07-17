// Path: src/app.js
const express = require('express');
const http = require('http');
const { logWithTimestamp } = require('./utils/logger');
const { initializeWakeWordDetection } = require('./controllers/wakeWordController');
const { scheduleHourlyAnnouncements } = require('./utils/scheduler');
const { synthesizeSpeech } = require('./utils/polly_util');
const socket = require('./socket'); // Import the socket module

const app = express();
const server = http.createServer(app);
const io = socket.init(server); // Initialize socket.io

const PORT = process.env.PORT || 3000;

const { startRecording } = require('./controllers/audioController');

// Initialize microphone stream at startup
startRecording();


app.use(express.static('public'));

io.on('connection', (socket) => {
    logWithTimestamp('New client connected');
    socket.on('disconnect', () => {
        logWithTimestamp('Client disconnected');
    });
});

// Define the playStartupMessage function before using it
async function playStartupMessage() {
    try {
        const message = 'System Started';
        logWithTimestamp('Playing startup message...');
        await synthesizeSpeech(message);
        logWithTimestamp('Startup message played successfully');
    } catch (error) {
        logWithTimestamp(`Error playing startup message: ${error.message}`);
    }
}

// Schedule hourly announcements
scheduleHourlyAnnouncements();

server.listen(PORT, () => {
    logWithTimestamp(`Server is running on port ${PORT}`);
    playStartupMessage();
    initializeWakeWordDetection();
});
