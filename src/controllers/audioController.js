const Microphone = require('node-microphone');
const config = require('../config/config');
const { logWithTimestamp } = require('../utils/logger');

let micInstance = null;
let audioStream = null;

const startRecording = () => {
    logWithTimestamp('Starting audio recording...');
    if (!micInstance) {
        micInstance = new Microphone({
            device: config.AUDIO_DEVICE,
            rate: '16000',
            channels: '1',
            debug: false // Set to true only when debugging
        });
        logWithTimestamp('Microphone instance created');
    }

    if (!audioStream) {
        audioStream = micInstance.startRecording();
        
        if (audioStream) {
            audioStream.dataReceived = false;
            
            audioStream.on('data', () => {
                if (audioStream && !audioStream.dataReceived) {
                    logWithTimestamp('First audio data received');
                    audioStream.dataReceived = true;
                }
            });
            
            audioStream.on('error', (error) => {
                logWithTimestamp(`Error in audio stream: ${error}`);
            });
            logWithTimestamp('Audio stream started');
        } else {
            logWithTimestamp('Failed to start audio stream');
        }
    } else {
        logWithTimestamp('Reusing existing audio stream');
    }

    return audioStream;
};

const stopRecording = () => {
    if (micInstance) {
        micInstance.stopRecording();
        if (audioStream) {
            audioStream.removeAllListeners('data');
            audioStream.removeAllListeners('error');
        }
        audioStream = null;
        logWithTimestamp('Stopped audio recording');
    }
};

module.exports = {
    startRecording,
    stopRecording,
};
