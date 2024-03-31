const express = require('express');
const mongoose = require("mongoose");
const route = require('./auth/routes');

const app = express();
const port = 3000;

mongoose.connect("mongodb://localhost/test")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/auth",route);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
