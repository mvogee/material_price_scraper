const express = require('express');
const scraper = require('./scraper');

const app = express();
const port = 3000;


app.listen(port, () => {
    console.log("server is live.");
    scraper();
});
