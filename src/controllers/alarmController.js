
// alarmController.js
const express = require('express');
const router = express.Router();
const Alarm = require('../models/alarm');

router.post('/set', async (req, res) => {
    const { time, message } = req.body;
    try {
        const alarm = new Alarm({ time, message });
        await alarm.save();
        res.status(201).send(alarm);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const alarms = await Alarm.find({});
        res.status(200).send(alarms);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const alarm = await Alarm.findByIdAndDelete(req.params.id);
        if (!alarm) {
            return res.status(404).send();
        }
        res.status(200).send(alarm);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
