const { Porcupine, BuiltinKeyword } = require('@picovoice/porcupine-node');
const { PvRecorder } = require('@picovoice/pvrecorder-node');
const config = require('../config/config');
const sttController = require('./sttController');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const { playSound } = require('../utils/polly_util');
const { logWithTimestamp } = require('../utils/logger');
const execPromise = util.promisify(exec);
const socket = require('../socket');

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

async function setLights(command, ...args) {
    const argString = args.map(arg => Array.isArray(arg) ? arg.join(',') : arg).join(' ');
    const scriptPath = path.join(__dirname, '..', '..', 'scripts', 'lights.py');
    try {
        await execPromise(`python3 ${scriptPath} ${command} ${argString}`);
    } catch (error) {
        logWithTimestamp(`Error executing lights.py: ${error.message}`);
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

        const dingPath = path.join(__dirname, '..', '..', 'sounds', 'ding.wav');
        playSound(dingPath).catch(error => logWithTimestamp(`Error playing ding: ${error}`));
        
        await setLights('knight_rider', 0, 0, 255, 5);  // Knight Rider effect in blue
        
        const transcription = await sttController.transcribeAudio();
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
                    logWithTimestamp('Wake word detected!');
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
