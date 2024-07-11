
// quoteController.js
const express = require('express');
const router = express.Router();
const Quote = require('../models/quote');

router.post('/add', async (req, res) => {
    const { text, author } = req.body;
    try {
        const quote = new Quote({ text, author });
        await quote.save();
        res.status(201).send(quote);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const quotes = await Quote.find({});
        res.status(200).send(quotes);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) {
            return res.status(404).send();
        }
        res.status(200).send(quote);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
