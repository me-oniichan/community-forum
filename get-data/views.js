const express = require('express');
const utils = require('../util.js');
const { authMiddleware } = require('../middleware.js');

const router = express.Router();

router.get('/community/:communityName', authMiddleware ,async (req, res) => {
    const communityName = req.params.communityName;
    if (communityName === undefined) {
        return res.status(404).send("Community not found");
    }
    const community = await utils.getCommunity(communityName);
    if (!community) {
        return res.status(404).send("Community not found");
    }
        
    const posts = await utils.getCommunityPosts(community);

    res.render('../templates/community-view.pug', { community, username: req.user?.username, posts });
});

// get post

router.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    if (postId === undefined) {
        return res.status(404).send("Post not found");
    }
    try{
        const post = await utils.getPost(postId);
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const comments = await utils.getPostComments(post);
    
        res.render('../templates/post-view.pug', { post, username: req.user?.username, comments });
    }
    catch(e){
        return res.send(e.toString());
    }
});

module.exports = router;