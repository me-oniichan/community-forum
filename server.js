const express = require('express');
const mongoose = require("mongoose");
const route = require('./auth/routes');
const session = require('express-session');
const mongoSession = require('connect-mongodb-session')(session);
require('dotenv').config();

const store = new mongoSession({
    uri:"mongodb://localhost/test",
    collection:"sessions"
})


// app configs
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    store:store,
}))

mongoose.connect("mongodb://localhost/test")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/auth",route);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
