const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticatedUser = async (req, res, next) => {
  try {
    if (!req?.headers?.authorization?.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ error: "you are noth authorized to make this request" });
    }

    const authToken = req.headers.authorization.split(" ")[1];
    if (!authToken) {
      return res
        .status(401)
        .json({ error: "you are noth authorized to make this request" });
    }

    const verifiedToken = jwt.verify(authToken, process.env.SECRET);

    if (!verifiedToken) {
      return res
        .status(401)
        .json({ error: "you are noth authorized to make this request" });
    }
    req.user = await User.findById(verifiedToken.id);
    return next();
  } catch (e) {
    return res
      .status(401)
      .json({ error: "you are noth authorized to make this request", e });
  }
};

module.exports = isAuthenticatedUser;
