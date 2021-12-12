const express = require('express');
const scraper = require('./scraper');

const app = express();
const port = 3000;


let itterStart = 117435;
const itterEnd = 200000;

app.listen(port, async () => {
    console.log("server is live.");
    for(i = 0; i < 3; i++) {
        try {
            let status = await scraper(itterStart, itterEnd);
            if (await status === true) {
                console.log("scraper finished successfully");
                break;
            }
            else if (await status === false) {
                console.log("the browswer failed to open");
                continue;
            }
            else {
                console.log(status);
                itterStart = await status;
            }
        }
        catch {
            console.log("scraper had an error, trying again");
        }
    }
    console.log("end of functions");
});
