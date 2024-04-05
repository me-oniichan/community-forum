const express = require('express');
const bodyParser = require('body-parser');
const { authMiddleware } = require('../middleware');
const { getUserCommunities, getCommunity } = require('../util');
const {Post, Comment} = require("./schema")


const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// create post

router.get('/create', authMiddleware, async (req, res) => {
  if (req.user === undefined){
    return res.redirect("/auth/login");
  }
  let communities = await getUserCommunities(req.user);

  res.render('../templates/create-post.pug', {
    title: "",
    content: "",
    communities,
    username: req.user.username
  });
});


router.post('/create', authMiddleware, async (req, res) => {
    if (req.user === undefined) {
        return res.status(401).send("Unauthorized");
    }

    let { title, content, community } = req.body; 
    community = await getCommunity(community);

    // if no such community exist
    if (!community) {
        return res.status(404).send("Community not found");
    }

    // check if user has joined that community
    let isAvailable = req.user.communities.find(e => e._id.equals(community._id));

    if (!isAvailable) {
      return res.status(404).send();
    }
    
    const post = new Post({
        title,
        content,
        createdBy: req.user,
        community,
        user: req.user
    });
    
    try {
        await post.save();
        return res.redirect('/post/'+post._id);
    } catch (e) {
        res.status(400).send("Post creation failed\n" + e);
    }
});


router.post('/comment', authMiddleware, async (req, res) => {
  if (req.user === undefined) {
    return res.status(401).send("Unauthorized");
  }
  let { postId, comment } = req.body;
  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).send("Post not found");
  }

  try {
    comment = new Comment({
      user: req.user,
      comment,
    });
    await comment.save();

    post.comments.push(comment);
    await post.save();

    return res.redirect('/post/' + postId);
  } catch (e) {
    res.status(400).send("Comment creation failed\n" + e);
  }
});

module.exports = router;