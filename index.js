const express = require('express');
const scraper = require('./scraper.js');

let app = express();

app.get('/latestData', async (req, res) => {
    let data = await scraper.latestData();
    res.json(data);
})

app.get('/symbolData', async(req, res) => {
    let symbol = req.query.symbol;
    let data = await scraper.symbolData(symbol);
    res.json(data);
})

app.listen(8080, () => console.log('Now Listening on port 8080'));