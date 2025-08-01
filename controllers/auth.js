const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // try {
  //   if (!req.body.username || !req.body.email || !req.body.password) {
  //     return res.status(500).json({ error: "auth body is needed" });
  //   }
  //   const existedUser = await User.findOne({ email: req.body.email });
  //   if (existedUser) {
  //     return res
  //       .status(401)
  //       .json({ error: "user with thease credentials already exists" });
  //   }
  //   const hashedPass = await bcrypt.hash(req.body.password, 10);
  //   if (!hashedPass) {
  //     return res
  //       .status(500)
  //       .json({ error: "something went wrong. please try later" });
  //   }
  //   const model = await User.create({
  //     username: req.body.username,
  //     email: req.body.email,
  //     password: hashedPass,
  //   });
  //   if (!model) {
  //     return res.status(500).json({ error: "user creation failed" });
  //   }
  //   const user = {
  //     email: model.email,
  //     username: model.username,
  //   };
  //   return res.status(201).json({ user });
  // } catch (e) {
  //   console.log(e);
  //   return res.status(500).json({ error: "user creation failed", e });
  // }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(500).json({ error: "auth body is needed" });
    }

    const existedUser = await User.findOne({ email: req.body.email });

    if (!existedUser) {
      return res
        .status(401)
        .json({ error: "user with thease credentials does not exist" });
    }

    const isHashed = await bcrypt.compare(
      req.body.password,
      existedUser.password
    );

    if (!isHashed) {
      return res
        .status(401)
        .json({ error: "user with thease credentials does not exist" });
    }

    const payload = {
      id: existedUser._id,
      email: existedUser.email,
      admin: existedUser.admin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      algorithm: "HS256",
    });

    if (!token) {
      return res
        .status(401)
        .json({ error: "something went wrong. please try again" });
    }

    const user = {
      id: existedUser._id,
      email: existedUser.email,
      admin: existedUser.admin,
      username: existedUser.username,
      token,
    };

    return res.status(201).json({ user });
  } catch (e) {
    return res.status(500).json({ error: "user creation failed", e });
  }
};
