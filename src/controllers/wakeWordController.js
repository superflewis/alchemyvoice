const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
const { PvRecorder } = require('@picovoice/pvrecorder-node');
const path = require('path');  // Add this line
const config = require('../config/config');
const sttController = require('./sttController');
const { logWithTimestamp } = require('../utils/logger');
const socket = require('../socket');
const { setLights } = require('./lightController');
const { playSound } = require('../utils/polly_util');  // Add this line

let recorder;
let isProcessing = false;

async function startRecorder(frameLength) {
    if (!recorder) {
        logWithTimestamp(`Initializing recorder with frame length: ${frameLength}`);
        logWithTimestamp('Using default audio device');
        
        try {
            recorder = new PvRecorder(frameLength, -1);
            await recorder.start();
            logWithTimestamp('Recorder initialized successfully');
        } catch (error) {
            logWithTimestamp(`Error creating PvRecorder: ${error.message}`);
            throw error;
        }
    }
}

const handleWakeWord = async () => {
    if (isProcessing) {
        logWithTimestamp('Already processing a command, ignoring this wake word.');
        return;
    }

    isProcessing = true;

    try {
        logWithTimestamp('Wake word detected!');
        
        socket.io.emit('wakeWordDetected', { message: 'Wake word detected!' });

        // Start recording before playing the ding sound
        const transcriptionPromise = sttController.transcribeAudio();
        
        const dingPath = path.join(__dirname, '..', '..', 'sounds', 'ding.wav');
        await playSound(dingPath);

        const transcription = await transcriptionPromise;
        logWithTimestamp(`Transcription: ${transcription || 'No transcription result received.'}`);
        
        socket.io.emit('transcriptionResult', { message: transcription || 'I didn\'t catch that. Could you please repeat?' });

        await setLights('off');
    } catch (error) {
        logWithTimestamp(`Error in transcription: ${error}`);
        socket.io.emit('error', { message: 'An error occurred while processing your request.' });
    } finally {
        isProcessing = false;
        logWithTimestamp('Listening for wake word...');
    }
};

const initializeWakeWordDetection = async () => {
    try {
        logWithTimestamp('Starting wake word detection initialization...');

        logWithTimestamp('Initializing Porcupine...');
        const handle = new Porcupine(
            config.PORCUPINE_ACCESS_KEY,
            [BuiltinKeyword.COMPUTER],
            [0.5]
        );
        logWithTimestamp('Porcupine initialized successfully.');

        logWithTimestamp('Initializing recorder...');
        await startRecorder(handle.frameLength);

        logWithTimestamp('Entering detection loop...');
        while (true) {
            try {
                const pcm = await recorder.read();
                const detectionResult = handle.process(pcm);
                if (detectionResult >= 0) {
                    await handleWakeWord();
                }
            } catch (loopError) {
                logWithTimestamp(`Error in detection loop: ${loopError.message}`);
            }
        }
    } catch (error) {
        logWithTimestamp(`Error in wake word detection: ${error.message}`);
        if (error.stack) {
            logWithTimestamp(`Stack trace: ${error.stack}`);
        }
    }
}; 

module.exports = {
    initializeWakeWordDetection,
};