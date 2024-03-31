const User = require("./auth/schema");

async function authMiddleware(req, res, next) {
  if (req.session.user) {
    const user = await User.findOne({ _id: req.session.user }).exec();
    if (user) {
      req.user = user;
      next();
      return;
    }
  }
  res.status(401);
  res.send("Unauthorized");
}

module.exports = {
  authMiddleware,
};
