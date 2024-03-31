const express = require('express');
const utils = require("../util")
const User = require("./schema")
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Login route
router.post('/login', async (req, res) => {
  const {username, password} = req.body;
  
  const user = await User.findOne({username})?.select("password").exec()
  if (user && utils.verifyUser(password, user.password)){
    res.send("looged in as "+username)
    return
  }

  res.send("not found")
  
});

// Logout route
router.get('/logout', (req, res) => {
  // Handle logout logic here
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
    res.send("done");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
