require('dotenv').config();
const express = require("express");
const plattItm = require("./db.js").plattItm;

const app = express();
const port = 3095;

app.listen(port, () => {
    console.log("server is live");
});