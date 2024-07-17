// Path: src/controllers/sttController.js
const speech = require('@google-cloud/speech');
const config = require('../config/config');
const { logWithTimestamp } = require('../utils/logger');
const { setLights } = require('./lightController');

const client = new speech.SpeechClient();

const transcribeAudio = (audioStream) => {
    return new Promise((resolve, reject) => {
        const request = {
            config: {
                encoding: config.AUDIO_FORMAT.encoding,
                sampleRateHertz: config.AUDIO_FORMAT.sampleRateHertz,
                languageCode: config.AUDIO_FORMAT.languageCode,
                audioChannelCount: 1,
            },
            interimResults: false,
        };

        let streamEnded = false;

        logWithTimestamp('Starting transcription stream...');
        const recognizeStream = client
            .streamingRecognize(request)
            .on('error', (error) => {
                logWithTimestamp(`Error in transcription: ${error}`);
                if (!streamEnded) {
                    streamEnded = true;
                    setLights('off');
                    reject(error);
                }
            })
            .on('data', (data) => {
                if (!streamEnded) {
                    const transcription = data.results
                        .map((result) => result.alternatives[0].transcript)
                        .join('\n');
                    logWithTimestamp(`Transcription received: ${transcription}`);
                    streamEnded = true;
                    recognizeStream.end();
                    setLights('off');
                    resolve(transcription);
                }
            })
            .on('end', () => {
                if (!streamEnded) {
                    logWithTimestamp('Transcription stream ended without data');
                    streamEnded = true;
                    setLights('off');
                    resolve('');
                }
            });

        audioStream.on('data', (chunk) => {
            if (!streamEnded) {
                recognizeStream.write(chunk);
            }
        });

        // Stop recording after 2 seconds
        setTimeout(() => {
            if (!streamEnded) {
                logWithTimestamp('Stopping recording after timeout...');
                audioStream.emit('end');
                recognizeStream.end();
                setLights('off');
            }
        }, 2000);
    });
};

module.exports = {
    transcribeAudio,
};
