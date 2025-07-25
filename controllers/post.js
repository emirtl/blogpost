const Post = require("../models/post");
const mongoose = require("mongoose");
const Author = require("../models/author");
exports.getAll = async (req, res) => {
  let limit;
  if (req.query.limit && req.query.limit > 0) {
    limit = req.query.limit;
  } else {
    limit = 0;
  }

  let filter = {};
  if (req.query.isFeatured) {
    filter = {
      isFeatured: true,
    };
  }

  try {
    const posts = await Post.find(filter)
      .populate("category")
      .populate({ path: "author", populate: { path: "posts" } })
      .sort({ _id: -1 })
      .limit(limit);
    if (!posts) {
      return res.status(500).json({ error: "fetching posts failed" });
    }
    return res.status(200).json({ posts });
  } catch (e) {
    return res.status(500).json({ error: "fetching posts failed", e });
  }
};

exports.getOne = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).json({ error: "post id missing" });
    }
    const id = req.params.id;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).json({ error: "post id not valid" });
    }
    const post = await Post.findById(id)
      .populate("category")
      .populate({ path: "author", populate: { path: "posts" } })
      .exec();
    if (!post) {
      return res.status(500).json({ error: "fetching post failed" });
    }
    return res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json({ error: "fetching post failed", e });
  }
};

exports.insert = async (req, res) => {
  try {
    if (
      !req.body.title ||
      !req.body.description ||
      !req.body.richDescription ||
      !req.body.category ||
      !req.body.author
    ) {
      return res.status(500).json({ error: "post body is needed" });
    }
    if (!req.file) {
      return res.status(500).json({ error: "image is needed" });
    }

    const imagePath = `${req.protocol}://${req.get("host")}/public/uploads/${
      req.file.filename
    }`;

    let post = await Post.create({
      title: req.body.title,
      description: req.body.description,
      richDescription: req.body.richDescription,
      category: req.body.category,
      author: req.body.author,
      image: imagePath,
      isFeatured: req.body.isFeatured,
    });

    if (!post) {
      return res.status(500).json({ error: "post creation failed" });
    }

    const existedAuthor = await Author.findOne({ _id: post.author._id }).exec();
    if (!existedAuthor) {
      return res.status(500).json({ error: "author does not exist" });
    }

    existedAuthor.posts.push(post);
    await existedAuthor.save();

    existedPost = await Post.findById(post._id)
      .populate("category")
      .populate({ path: "author", populate: { path: "posts" } });

    if (!existedPost) {
      return res.status(500).json({ error: "post creation failed" });
    }

    return res.status(201).json({ existedPost });
  } catch (e) {
    return res.status(500).json({ error: "post creation failed", e });
  }
};
exports.update = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).json({ error: "post id missing" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).json({ error: "post id not valid" });
    }
    const existedPost = await Post.findById(req.params.id).exec();
    let fileImage;
    if (req.file) {
      const imagePath = `${req.protocol}://${req.get("host")}/public/uploads/${
        req.file.filename
      }`;
      fileImage = imagePath;
    } else {
      fileImage = existedPost.image;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        richDescription: req.body.richDescription,
        category: req.body.category,
        author: req.body.author,
        image: fileImage,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    )
      .populate("category")
      .populate("author")
      .exec();
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
    return res.status(200).json({ deletedPost });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "deleting category failed. please try later", e });
  }
};
