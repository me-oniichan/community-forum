const bcrypt = require("bcrypt")

function encryptUser(password){
  const salt = bcrypt.genSaltSync()
  password = bcrypt.hashSync(password, salt)
  return {password, salt}
}

function verifyUser(password, hashedPass){
    const result = bcrypt.compareSync(password, hashedPass)
    return result
}

module.exports = {
    encryptUser,
    verifyUser
}