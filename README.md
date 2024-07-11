# AlchemyVoice

AlchemyVoice 2is a voice assistant project designed to transform spoken commands into actionable tasks, allowing users to interact with their environment as modern-day alchemists. By leveraging cutting-edge AI technologies, AlchemyVoice enables seamless voice interaction and control over built-in features on the Adafruit Voice Bonnet.

## Main Features
- **Wake Word Detection:** Utilizes Picovoice's Porcupine for detecting the wake word, enabling hands-free activation.
- **Speech-to-Text:** Uses Google Cloud Speech API for transcribing spoken commands into text, facilitating natural language interactions.
- **Built-in Light Controls:** Includes scripts and controllers for managing the built-in lights on the Adafruit Voice Bonnet.
- **Web Interface:** Provides a web interface for user interactions and status display, offering a centralized hub for managing tasks.

## Installation and Usage
1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/alchemyvoice.git
    cd alchemyvoice
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure the `src/config/config.js` file with your access keys and credentials.
4. Start the server:
    ```bash
    npm start
    ```
5. Access the web interface at `http://localhost:3000`.

## Directory Structure
- **src/**: Contains the main application logic.
- **config/**: Configuration files for various services and APIs.
- **controllers/**: Handles the logic for different features like alarms, audio, and wake word detection.
- **public/**: Contains front-end assets like HTML, CSS, and JavaScript files.
- **scripts/**: Includes Python scripts for additional functionalities like controlling lights.

## Dependencies
- `@google-cloud/speech`
- `@picovoice/porcupine-node`
- `aws-sdk`
- `axios`
- `express`
- `node-microphone`

## Platform
AlchemyVoice is built to run on a Raspberry Pi, utilizing the Adafruit Voice Bonnet for audio input and output, as well as controlling built-in lights. The project harnesses the power of AI to provide intuitive voice-based interactions.

## License
This project is licensed under the MIT License.
