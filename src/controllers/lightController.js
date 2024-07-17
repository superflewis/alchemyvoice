const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const { logWithTimestamp } = require('../utils/logger');
const execPromise = util.promisify(exec);

async function setLights(command, ...args) {
    const argString = args.map(arg => Array.isArray(arg) ? arg.join(',') : arg).join(' ');
    const scriptPath = path.join(__dirname, '../../scripts/lights.py'); // Corrected path to script
    logWithTimestamp(`Executing lights command: python3 ${scriptPath} ${command} ${argString}`);
    try {
        await execPromise(`python3 ${scriptPath} ${command} ${argString}`);
        logWithTimestamp(`Lights set to ${command} ${argString}`);
    } catch (error) {
        logWithTimestamp(`Error executing lights.py: ${error.message}`);
    }
}

module.exports = { setLights };
