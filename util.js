const bcrypt = require("bcrypt")
const {Community, Post, Comment} = require('./set-data/schema')

function encryptUser(password){
  const salt = bcrypt.genSaltSync()
  password = bcrypt.hashSync(password, salt)
  return {password, salt}
}

function verifyUser(password, hashedPass){
    const result = bcrypt.compareSync(password, hashedPass)
    return result
}

function getCommunity(communityName){
    return Community.findOne({name:communityName}).populate("createdBy")
}

async function getCommunityPosts(community){
    let posts = await Post.find().populate({
        path: 'user',
    })
    .where('community').equals(community).exec()
    return posts;
}

async function getUserCommunities(user){
    let communities= await Promise.all(user.communities.map(async (community) => {
            return await Community.findById(community).exec()
        })
    );
    return communities;
}

async function getPost(postId){
    return await Post.findById(postId).populate({
        path: 'user',
    }).exec().catch(e => {})
}

async function getPostComments(post){
    return await Promise.all(post.comments.map(async (comment) => {
        return await Comment.findById(comment).populate({
            path: 'user',
        }).exec()
}))}

module.exports = {
    encryptUser,
    verifyUser,
    getCommunity,
    getUserCommunities,
    getCommunityPosts,
    getPost,
    getPostComments
}