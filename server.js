const express = require('express');
const mongoose = require("mongoose");
const route = require('./auth/routes');
const session = require('express-session');
require('dotenv').config();


const app = express();
const port = 3000;

app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true
}))

mongoose.connect("mongodb://localhost/test")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/auth",route);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
