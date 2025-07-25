const Author = require("../models/author");
const mongoose = require("mongoose");
exports.getAll = async (req, res) => {
  try {
    const authors = await Author.find().populate("posts");

    if (!authors) {
      return res.status(500).json({ error: "fetching authors failed" });
    }
    return res.status(200).json({ authors });
  } catch (e) {
    return res.status(500).json({ error: "fetching authors failed", e });
  }
};

exports.getOne = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
      .populate("posts")
      .exec();

    if (!author) {
      return res.status(500).json({ error: "fetching author failed" });
    }
    return res.status(200).json({ author });
  } catch (e) {
    return res.status(500).json({ error: "fetching author failed", e });
  }
};

exports.insert = async (req, res) => {
  try {
    if (!req.body.name || !req.body.position || !req.body.description) {
      return res.status(500).json({ error: "author body is needed" });
    }

    let author = new Author({
      name: req.body.name,
      position: req.body.position,
      description: req.body.description,
    });

    author = await author.save();

    if (!author) {
      return res.status(500).json({ error: "author creation failed" });
    }
    return res.status(201).json({ author });
  } catch (e) {
    return res.status(500).json({ error: "author creation failed", e });
  }
};
exports.update = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).json({ error: "author id missing" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).json({ error: "author id not valid" });
    }
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        position: req.body.position,
        description: req.body.description,
      },
      { new: true }
    );

    if (!updatedAuthor) {
      return res
        .status(500)
        .json({ error: "updating author failed. please try later" });
    }
    return res.status(200).json({ updatedAuthor });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "updating author failed. please try later", e });
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(500).json({ error: "author id missing" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(500).json({ error: "author id not valid" });
    }
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res
        .status(500)
        .json({ error: "deleting author failed. please try later" });
    }
    return res.status(200).json({ deletedAuthor });
  } catch (e) {
    return res
      .status(500)
      .json({ error: "deleting author failed. please try later", e });
  }
};
