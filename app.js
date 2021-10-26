const express = require('express');
const scraper = require('./scraper');

const app = express();
const port = 3663;


app.listen(port, () => {
    console.log("server is live.");
    scraper();
});
