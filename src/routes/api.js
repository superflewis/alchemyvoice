
// api.js
const express = require('express');
const router = express.Router();

const alarmController = require('./controllers/alarmController');
const quoteController = require('./controllers/quoteController');
const mopidyController = require('./controllers/mopidyController');

// Use controllers
router.use('/alarms', alarmController);
router.use('/quotes', quoteController);
router.use('/mopidy', mopidyController);

module.exports = router;
