const express = require('express');
const utils = require('../util.js');
const { authMiddleware } = require('../middleware.js');

const router = express.Router();

router.get('/:communityName', authMiddleware ,async (req, res) => {
    const communityName = req.params.communityName;
    if (communityName === undefined) {
        return res.status(404).send("Community not found");
    }
    const community = await utils.getCommunity(communityName);
    if (!community) {
        return res.status(404).send("Community not found");
    }
    res.render('../templates/community-view.pug', { community, username: req.user?.username });
});


module.exports = router;