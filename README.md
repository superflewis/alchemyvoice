# Voice Assistant Project

This project implements a voice assistant using Node.js with Express on a Raspberry Pi.

## Prerequisites

- Node.js
- Raspberry Pi with a microphone (device: plughw:3,0)
- Google Cloud Speech API credentials
- Porcupine access key from Picovoice

## Installation

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure the `src/config/config.js` file with your access keys and credentials.

## Usage

1. Start the server: `npm start`
2. Say the wake word "Computer" to activate audio recording.
3. The recorded audio will be transcribed using Google Cloud Speech API.
4. The transcription result will be logged in the console.

## License

This project is licensed under the MIT License.