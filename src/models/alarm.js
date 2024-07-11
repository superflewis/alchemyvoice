
// alarm.js
const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;
