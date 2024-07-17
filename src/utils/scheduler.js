const { announceTime } = require('../controllers/timeAnnouncerController');

function scheduleHourlyAnnouncements() {
    const now = new Date();
    const delay = (60 - now.getMinutes()) * 60 * 1000; // ms until next hour

    setTimeout(() => {
        announceTime();
        // Schedule the next announcement
        setInterval(announceTime, 60 * 60 * 1000); // Every hour
    }, delay);
}

module.exports = { scheduleHourlyAnnouncements };
