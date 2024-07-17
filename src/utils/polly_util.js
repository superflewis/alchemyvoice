const AWS = require('aws-sdk');
const Stream = require('stream');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const { logWithTimestamp } = require('./logger');
const { setLights } = require('../controllers/lightController'); // Ensure this path is correct

const polly = new AWS.Polly({
    region: 'us-east-1'
});

async function synthesizeSpeech(text) {
    const params = {
        Text: text,
        OutputFormat: 'pcm',
        VoiceId: 'Joanna'
    };

    try {
        logWithTimestamp('Synthesizing speech with Polly...');
        const data = await polly.synthesizeSpeech(params).promise();
        if (data.AudioStream instanceof Buffer) {
            const bufferStream = new Stream.PassThrough();
            bufferStream.end(data.AudioStream);

            logWithTimestamp('Starting Knight Rider effect...');
            const knightRiderProcess = spawn('python3', ['/home/williew/alchemyvoice/scripts/lights.py', 'knight_rider', '0', '0', '255', '5']); // Ensure this path is correct

            const player = spawn('aplay', ['-f', 'S16_LE', '-r', '16000']);
            bufferStream.pipe(player.stdin);

            player.on('close', async () => {
                logWithTimestamp('Stopping Knight Rider effect...');
                knightRiderProcess.kill();
                await setLights('off');
                logWithTimestamp('Synthesized speech played successfully');
            });

            player.on('error', async (error) => {
                logWithTimestamp(`Error during audio playback: ${error.message}`);
                knightRiderProcess.kill();
                await setLights('off');
            });
        } else {
            logWithTimestamp('No audio stream received from Polly');
        }
    } catch (error) {
        logWithTimestamp(`Error in Polly TTS: ${error.message}`);
    }
}

async function playSound(filePath) {
    try {
        logWithTimestamp(`Playing sound: ${filePath}`);
        await execPromise(`aplay ${filePath}`);
        logWithTimestamp(`Sound played successfully: ${filePath}`);
    } catch (error) {
        logWithTimestamp(`Error playing sound: ${error.message}`);
    }
}

module.exports = { synthesizeSpeech, playSound };
