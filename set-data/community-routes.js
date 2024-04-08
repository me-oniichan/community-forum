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
  res.render('../templates/create-community.pug', {
    name: "",
    username: req.user.username,
  });
});

router.post('/create', authMiddleware, async (req, res) => {
  if(req.user === undefined){
    return res.status(401).send("Unauthorized")
  }

  const { name, description } = req.body;

  const community = new Community({
    name,
    description,
    createdBy: req.user,
  });

  try {
    await community.save();
    req.user.communities.push(community);
    await req.user.save();

    return res.redirect('/community/'+name);
  } catch (e) {
    if (e.code === 11000) {
      res.render('../templates/create-community.pug', { error: true, name, description})
      return;
    }
    res.status(400).send("Community creation failed\n" + e);
  }
});

// join community
router.get('/join/:communityName', authMiddleware, async (req, res) => {
  if(req.user === undefined){
    return res.status(401).send("Unauthorized")
  }

  const name = req.params.communityName;
  const community = await utils.getCommunity(name);

  if (!community) {
    return res.status(404).send("Community not found");
  }

  req.user.communities.push(community);
  req.user.save();
  return res.redirect('/community/'+name);
});

// leave community
router.get('/leave/:communityName', authMiddleware, async (req, res) => {
  if(req.user === undefined){
    return res.status(401).send("Unauthorized")
  }

  const name = req.params.communityName;
  const community = await utils.getCommunity(name);
  if (!community) {
    return res.status(404).send("Community not found");
  }
  req.user.communities = req.user.communities.filter(e => !e._id.equals(community._id));
  req.user.save();
  return res.redirect('/community/'+name);
});

module.exports = router;
