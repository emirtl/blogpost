module.exports = (req, res, next) => {
  if (req.user && req.user.admin === true) {
    return next();
  } else {
    return res
      .status(401)
      .json({ error: "not Authorized. user is not ad admin" });
  }
};
