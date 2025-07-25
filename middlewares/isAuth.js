const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
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

    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log("verifiedToken", verifiedToken);

    if (!verifiedToken) {
      return res
        .status(401)
        .json({ error: "you are noth authorized to make this request" });
    }
    const user = await User.findById(verifiedToken.id);
    console.log("user", user);

    req.user = user;
    return next();
  } catch (e) {
    return res
      .status(401)
      .json({ error: "you are noth authorized to make this request", e });
  }
};
