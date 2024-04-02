const express = require('express');
const utils = require("../util")
const User = require("./schema")
const bodyParser = require('body-parser');
const {authMiddleware} = require('../middleware');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// send login page
router.get('/login', authMiddleware, (req, res) => {
  if(req.user !== undefined){
    return res.redirect("/")
  }
  res.render('../templates/login.pug');
});

// Login route
router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  
  const user = await User.findOne({username})?.select("_id password").exec()
  if (user && utils.verifyUser(password, user.password)){
    req.session.user = user._id;
    req.session.save();
    return res.redirect("/");
  }

  res.status(401).send("Invalid username or password")
});

// Logout route
router.get('/logout', authMiddleware, (req, res) => {
  req.session.destroy();
  res.send("logged out");
});

// sed signup page
router.get('/signup', authMiddleware, (req, res) => {
  if(req.user !== undefined){
    return res.redirect("/")
  }
  res.render('../templates/signup.pug');
});

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, rawPassword } = req.body;
  const { password} = utils.encryptUser(rawPassword);

  const user = new User({
    username,
    password,
    email,
  });

  try {
    await user.save();
    req.session.user = user._id;
    req.session.save();
    return res.redirect("/");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
