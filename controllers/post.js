const Post = require("../models/post");
const mongoose = require("mongoose");
exports.getAll = async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(500).json({ error: "fetching posts failed" });
    }
    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ error: "fetching posts failed", e });
  }
};

exports.insert = async (req, res) => {
  console.log('insert controller hitted');
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.richDescription ||
      !req.body.category
    ) {
      return res.status(500).json({ error: "post body is needed" });
    }
    if (!req.file) {
      return res.status(500).json({ error: "image is needed" });
    }

    const imagePath = `${req.protocol}://${req.get("host")}/public/uploads/${
      req.file.filename
    }`;

    const post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      richDescription: req.body.richDescription,
      category: req.body.category,
      image: imagePath,
    });

    if (!post) {
      return res.status(500).json({ error: "post creation failed" });
    }
    return res.status(201).json({ post });
  } catch (e) {
    return res.status(500).json({ error: "post creation failed", e });
  }
};
exports.update = async (req, res) => {
  console.log(req.params.id);
  try {
    if (!req.params.id) {
      return res.status(500).json({ error: "post id missing" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).json({ error: "post id not valid" });
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        richDescription: req.body.richDescription,
        category: req.body.category,
        image: req.body.image,
      },
      { new: true }
    ).exec();
    if (!updatedPost) {
      return res
        .status(500)
        .json({ error: "updating post failed. please try later" });
    }

    return res.status(200).json({ updatedPost });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "updating post failed. please try later", e });
  }
};
exports.delete = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).json({ error: "post id missing" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).json({ error: "post id not valid" });
    }
    const deletedPost = await Post.findByIdAndDelete(req.params.id).exec();
    if (!deletedPost) {
      return res
        .status(500)
        .json({ error: "deleting category failed. please try later" });
    }
    return res.status(200).json({ message: "category deleted" });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "deleting category failed. please try later", e });
  }
};
