const axios = require('axios');
const { synthesizeSpeech } = require('../utils/polly_util');

async function getAffirmation() {
    try {
        const response = await axios.get('https://affirmations.dev');
        const fullAffirmation = response.data.affirmation;
        const words = fullAffirmation.split(' ');
        return words.slice(0, 3).join(' '); // Get first 3 words
    } catch (error) {
        console.error('Error fetching affirmation:', error);
        return ''; // Return empty string if there's an error
    }
}

async function announceTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    let timeString = `It's ${hours}`;
    if (minutes !== 0) {
        timeString += ` ${minutes}`;
    }
    if (minutes === 0) {
        timeString += " o'clock";
    }
    timeString += ` ${ampm}`;

    const affirmation = await getAffirmation();
    let announcement = '';

    // Randomly decide whether to put the affirmation before or after the time
    if (Math.random() < 0.5) {
        announcement = `${affirmation}. ${timeString}`;
    } else {
        announcement = `${timeString}. ${affirmation}`;
    }

    try {
        await synthesizeSpeech(announcement);
        console.log('Time announced successfully');
    } catch (error) {
        console.error('Error announcing time:', error);
    }
}

function scheduleHourlyAnnouncement() {
    const now = new Date();
    const delay = (60 - now.getMinutes()) * 60 * 1000; // ms until next hour

    setTimeout(() => {
        announceTime();
        // Schedule the next announcement
        setInterval(announceTime, 60 * 60 * 1000); // Every hour
    }, delay);
}

module.exports = { announceTime, scheduleHourlyAnnouncement };