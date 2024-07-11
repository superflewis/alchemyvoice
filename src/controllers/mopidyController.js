
// mopidyController.js
const express = require('express');
const router = express.Router();
const MopidyClient = require('../services/mopidyService');

const mopidy = new MopidyClient();

router.post('/play', async (req, res) => {
    const { uri } = req.body;
    try {
        await mopidy.play(uri);
        res.status(200).send({ message: 'Playing' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/pause', async (req, res) => {
    try {
        await mopidy.pause();
        res.status(200).send({ message: 'Paused' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/resume', async (req, res) => {
    try {
        await mopidy.resume();
        res.status(200).send({ message: 'Resumed' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/stop', async (req, res) => {
    try {
        await mopidy.stop();
        res.status(200).send({ message: 'Stopped' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/next', async (req, res) => {
    try {
        await mopidy.next();
        res.status(200).send({ message: 'Next track' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/previous', async (req, res) => {
    try {
        await mopidy.previous();
        res.status(200).send({ message: 'Previous track' });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/tracklist', async (req, res) => {
    try {
        const tracklist = await mopidy.getTracklist();
        res.status(200).send(tracklist);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
