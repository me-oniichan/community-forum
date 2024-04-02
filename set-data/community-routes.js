const express = require('express');
const utils = require('../util.js');
const bodyParser = require('body-parser');
const {Community} = require('./schema');
const {authMiddleware} = require('../middleware');


const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// create community

router.get('/create', authMiddleware, (req, res) => {
  if (req.user === undefined) {
    return res.redirect("/auth/login");
  }
  res.render('../templates/create-community.pug', { name: ""});
});

router.post('/create', authMiddleware, async (req, res) => {
  const { name, description } = req.body;

  const community = new Community({
    name,
    description,
    createdBy: req.user,
  });

  try {
    await community.save();
    res.send("Community created");
  } catch (e) {
    if (e.code === 11000) {
      res.render('../templates/create-community.pug', { error: true, name, description})
      return;
    }
    res.status(400).send("Community creation failed\n" + e);
  }
});

module.exports = router;