const express =require("express")
const { authMiddleware } = require('../middleware.js');
const utils = require('../util.js');
const {Post, Comment} = require("../set-data/schema")
const User = require("../auth/schema")

const router = express.Router();

router.get('/:username', authMiddleware, async (req, res) => {
    const username = req.params.username;
    if (username === undefined) {
        return res.status(404).send("User not found");
    }
    try {
        const user = await User.findOne({
            username
        }).populate("communities").exec();
        if (!user) {
            return res.status(404).send("User not found");
        }

        const posts = await Post.find({
            user
        }).exec();

        posts.sort((a, b) => {
            return b.createdAt - a.createdAt
        })

        res.render('../templates/dashboard.pug', { user, username: req.user?.username, posts});

    } catch (e) {
        throw e;
        return res.status(404).send(" "+e);
    }
});


module.exports = router;