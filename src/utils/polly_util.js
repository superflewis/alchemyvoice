const AWS = require('aws-sdk');
const Stream = require('stream');
const { exec, spawn } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const Polly = new AWS.Polly({
    region: 'us-east-1'
});

async function synthesizeSpeech(text) {
    return new Promise((resolve, reject) => {
        const params = {
            Text: text,
            OutputFormat: 'pcm',
            VoiceId: 'Joanna'
        };

        Polly.synthesizeSpeech(params, async (err, data) => {
            if (err) {
                reject(err);
            } else if (data && data.AudioStream instanceof Buffer) {
                try {
                    const audioBuffer = data.AudioStream;
                    const audioDuration = audioBuffer.length / 32000; // assuming 16-bit PCM at 16kHz

                    console.log(`Starting strobe effect for ${audioDuration} seconds...`);

                    const strobeProcess = spawn('python3', ['scripts/lights.py', 'strobe', audioDuration.toString()]);
                    
                    const bufferStream = new Stream.PassThrough();
                    bufferStream.end(audioBuffer);

                    const player = exec('aplay -f S16_LE -r 16000');
                    bufferStream.pipe(player.stdin);

                    player.on('close', async () => {
                        console.log('Stopping strobe effect...');
                        strobeProcess.kill(); // Ensure strobe process is stopped
                        await execPromise('python3 scripts/lights.py off');
                        resolve();
                    });

                    player.on('error', async (error) => {
                        console.log('Error during audio playback. Stopping strobe effect...');
                        strobeProcess.kill(); // Ensure strobe process is stopped
                        await execPromise('python3 scripts/lights.py off');
                        reject(error);
                    });
                } catch (error) {
                    console.log('Error during TTS. Stopping strobe effect...');
                    await execPromise('python3 scripts/lights.py off');
                    reject(error);
                }
            }
        });
    });
}

async function playSound(filePath) {
    return new Promise((resolve, reject) => {
        const player = exec(`aplay ${filePath}`);

        player.on('close', () => resolve());
        player.on('error', (error) => reject(error));
        player.stdout.on('data', (data) => console.log(`stdout: ${data}`));
        player.stderr.on('data', (data) => console.error(`stderr: ${data}`));
    });
}

// New helper function to play ding sound followed by TTS
async function playTTSWithDing(text) {
    try {
        // Play the ding sound
        const dingPath = path.join(__dirname, '..', 'sounds', 'ding.wav');
        await playSound(dingPath);

        // Synthesize and play the TTS
        await synthesizeSpeech(text);
    } catch (error) {
        console.error('Error in playTTSWithDing:', error);
    }
}

module.exports = { synthesizeSpeech, playSound, playTTSWithDing };
