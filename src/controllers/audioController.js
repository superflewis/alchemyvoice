const Microphone = require('node-microphone');
const config = require('../config/config');
const { logWithTimestamp } = require('../utils/logger');

let micInstance = new Microphone({
    device: config.AUDIO_DEVICE,
    rate: '16000',
    channels: '1',
    debug: false // Set to true only when debugging
});
let audioStream = null;

const startRecording = () => {
    logWithTimestamp('Starting audio recording...');
    if (!audioStream) {
        audioStream = micInstance.startRecording();
        
        if (audioStream) {
            audioStream.dataReceived = false;
            
            audioStream.on('data', () => {
                audioStream.dataReceived = true;
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
    if (audioStream) {
        micInstance.stopRecording();
        audioStream.removeAllListeners('data');
        audioStream.removeAllListeners('error');
        audioStream = null;
        logWithTimestamp('Stopped audio recording');
    }
};

module.exports = {
    startRecording,
    stopRecording,
};
