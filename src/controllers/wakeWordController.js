const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
const { PvRecorder } = require('@picovoice/pvrecorder-node');
const path = require('path');
const config = require('../config/config');
const sttController = require('./sttController');
const { logWithTimestamp } = require('../utils/logger');
const socket = require('../socket');
const { setLights } = require('./lightController');
const { playSound } = require('../utils/polly_util');

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

        // Start the Knight Rider effect
        logWithTimestamp('Starting Knight Rider effect...');
        await setLights('knight_rider', 0, 0, 255, 5);

        // Start recording before playing the ding sound
        const transcriptionPromise = sttController.transcribeAudio();
        
        const dingPath = path.join(__dirname, '..', '..', 'sounds', 'ding.wav');
        logWithTimestamp('Playing ding sound...');
        await playSound(dingPath);

        // Pulse green while recording
        logWithTimestamp('Pulsing green lights while recording...');
        await setLights('pulse_green', 5);

        const transcription = await transcriptionPromise;
        logWithTimestamp(`Transcription received: ${transcription || 'No transcription result received.'}`);
        
        socket.io.emit('transcriptionResult', { message: transcription || 'I didn\'t catch that. Could you please repeat?' });

        // Use Polly to stream the TTS of the transcription
        if (transcription) {
            logWithTimestamp('Playing transcription using Polly TTS...');
            const { synthesizeSpeech } = require('../utils/polly_util');
            await synthesizeSpeech(transcription);
        }

        logWithTimestamp('Turning off lights...');
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
