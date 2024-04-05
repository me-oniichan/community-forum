const bcrypt = require("bcrypt")
const {Community} = require('./set-data/schema')

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

function getCommunityById(communityId){
    return Community.findById(communityId).populate("createdBy")
}

async function getUserCommunities(user){
    let communities= await Promise.all(user.communities.map(async (community) => {
            return await Community.findById(community).exec()
        })
    );
    return communities;
}

module.exports = {
    encryptUser,
    verifyUser,
    getCommunity,
    getUserCommunities
}