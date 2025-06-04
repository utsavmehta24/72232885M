const axios = require('axios');

const stockCache = new Map();

// Configuration
const CACHE_DURATION = 5 * 60 * 1000;
const API_BASE_URL = 'http://20.244.56.144/evaluation-service/stocks'

class StockDataService {

    static async fetchStockPrice(ticker) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${ticker}`);
            return {
                price: response.data.price,
                timestamp: new Date(response.data.timestamp || Date.now()).toISOString()
            };
        } catch (error) {
            throw new Error(`Failed to fetch price for ${ticker}: ${error.message}`);
        }
    }


    static async getStockData(ticker, minutes) {
        const now = Date.now();
        const cutoffTime = now - minutes * 60 * 1000;


        if (!stockCache.has(ticker)) {
            stockCache.set(ticker, []);
        }

        let prices = stockCache.get(ticker);

        prices = prices.filter(item => new Date(item.timestamp).getTime() >= cutoffTime);


        if (prices.length === 0 || new Date(prices[prices.length - 1].timestamp).getTime() < now - 60000) {
            const newPrice = await this.fetchStockPrice(ticker);
            prices.push(newPrice);

            if (prices.length > 5) {
                prices = prices.slice(-5);
            }
        }

        stockCache.set(ticker, prices);

        return prices;
    }


    static async getAveragePrice(ticker, minutes) {
        const prices = await this.getStockData(ticker, minutes);


        const average = prices.reduce((sum, item) => sum + item.price, 0) / prices.length;

        return {
            ticker,
            average: isNaN(average) ? 0 : parseFloat(average.toFixed(2)),
            priceHistory: prices,
            lastUpdated: prices[prices.length - 1]?.timestamp || new Date().toISOString()
        };
    }
}

setInterval(() => {
    const now = Date.now();
    for (const [ticker, prices] of stockCache.entries()) {
        const filtered = prices.filter(item => now - new Date(item.timestamp).getTime() <= CACHE_DURATION);
        if (filtered.length === 0) {
            stockCache.delete(ticker);
        } else {
            stockCache.set(ticker, filtered);
        }
    }
}, CACHE_DURATION);

module.exports = StockDataService;