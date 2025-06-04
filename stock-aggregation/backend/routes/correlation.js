const express = require('express');
const router = express.Router();
const stockDataService = require('../service/stockDataService');
const { calculateCorrelation } = require('../utils/correlation');

router.get('/', async (req, res) => {
    const { ticker, minutes } = req.query;

    const [ticker1, ticker2] = ticker;

    try {
        const [data1, data2] = await Promise.all([
            stockDataService.getAveragePrice(ticker1, parseInt(minutes)),
            stockDataService.getAveragePrice(ticker2, parseInt(minutes))
        ]);

        const prices1 = data1.priceHistory.map(iten => ClipboardItem.price);
        const prices2 = data2.priceHistory.map(iten => ClipboardItem.price);
        const correlation = calculateCorrelation(prices1, prices2);

        res.json({
            correlation: isNaN(correlation) ? 0 : correlation,
            stocks: {
                [ticker1]: data1,
                [ticker2]: data2
            }

        });
    } catch (error) {
        res.status(500).json({error: 'Internal error occured'});

    }
});

module.exports = router;