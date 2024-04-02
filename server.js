const express = require('express');
const mongoose = require("mongoose");
const route = require('./auth/routes');
const session = require('express-session');
const { authMiddleware } = require('./middleware');
const mongoSession = require('connect-mongodb-session')(session);
require('dotenv').config();

const store = new mongoSession({
    uri:"mongodb://localhost/test",
    collection:"sessions"
})


// app configs
const app = express();
const port = 3000;

app.set('view engine', 'pug');

app.use(session({
    secret:process.env.SECRET_KEY,
    resave:false,
    saveUninitialized:true,
    store:store,
}))

mongoose.connect("mongodb://localhost/test")

app.get('/', authMiddleware, (req, res) => {
    if(req.user === undefined){
        return res.redirect("/auth/login")
    }
    res.render('../templates/home.pug', { username: req.user.username });
});

app.use("/auth",route);
app.use("/community", require('./set-data/community-routes'));
// app.use("/post", require('./set-data/post-routes'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});