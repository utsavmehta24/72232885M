const express = require('express');
const router = express.Router();
const stockDataService = require('../service/stockDataService');

router.get('/:ticker', async (req, res) => {
    const ticker = req.params.ticker;
    const minutes = parseInt(req.query.minutes);
    const aggregation = req.query.aggregation;

    try {
        const data = await stockDataService.getAveragePrice(ticker, minutes);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });

    }
});

module.exports = router;