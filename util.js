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

async function getUserComments(user){
    let comments = await Comment.find({user: user}).exec();
    return comments;
}

async function isUserInCommunity(user, community){
    return await user.communities.find(e => e._id.equals(community._id)).exec()? true: false;
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

async function getSortedPosts(){
    let posts = await Post.find().populate({
        path: 'user community',
    }).exec()
    posts.sort((a, b) => {
        return b.createdAt - a.createdAt
    })
    return posts;
}

module.exports = {
    encryptUser,
    verifyUser,
    getCommunity,
    getUserCommunities,
    getCommunityPosts,
    getPost,
    getPostComments,
    getSortedPosts,
    getUserComments
}