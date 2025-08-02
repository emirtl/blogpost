const Post = require("../models/post");
const mongoose = require("mongoose");
const Author = require("../models/author");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

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

    // const imagePath = `${req.protocol}://${req.get("host")}/public/uploads/${
    //   req.file.filename
    // }`;

    const imagePath = req.file.location;

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
      // const imagePath = `${req.protocol}://${req.get("host")}/public/uploads/${
      //   req.file.filename
      // }`;
      fileImage = req.file.location;
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
// exports.delete = async (req, res, next, s3) => {
//   try {
//     if (!req.params.id) {
//       return res.status(500).json({ error: "post id missing" });
//     }
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       return res.status(500).json({ error: "post id not valid" });
//     }
//     const deletedPost = await Post.findByIdAndDelete(req.params.id).exec();
//     // const deletedPost = await Post.findById(req.params.id).exec();
//     if (!deletedPost) {
//       return res
//         .status(500)
//         .json({ error: "deleting category failed. please try later" });
//     }

//     const key = deletedPost.image.split("/").pop(); // Extract key from URL

//     const params = {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: key,
//     };

//     try {
//       // Use the S3Client's send method with a DeleteObjectCommand
//       const command = new DeleteObjectCommand(params);
//       await s3.send(command);

//       console.log("S3 object deleted successfully.");
//     } catch (err) {
//       console.error("Error deleting S3 object:", err);
//     }
//     return res.status(200).json({ deletedPost });
//   } catch (e) {
//     return res
//       .status(500)
//       .json({ error: "deleting category failed. please try later", e });
//   }
// };

exports.delete = async (req, res, next, s3) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "Post ID missing" });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Post ID is not valid" });
    }

    // Step 1: Find the post to get the image key
    const postToDelete = await Post.findById(req.params.id).exec();

    if (!postToDelete) {
      return res.status(404).json({ error: "Post not found" });
    }

    const url = new URL(postToDelete.image);
    const key = url.pathname.substring(1); // Removes the leading '

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    // Step 2: Delete the object from S3 with proper error handling
    try {
      const command = new DeleteObjectCommand(params);

      await s3.send(command);

      console.log("S3 object deleted successfully.");
    } catch (err) {
      console.error("Error deleting S3 object:", err);
      // Return an error to the client if S3 deletion fails
      return res.status(500).json({
        error: "Failed to delete image from S3. The post was not deleted.",
        details: err.message,
      });
    }

    // Step 3: Delete the post from the database only after S3 deletion is successful
    const deletedPost = await Post.findByIdAndDelete(req.params.id).exec();

    if (!deletedPost) {
      // This case might happen if the post was deleted between finding it and this line
      return res
        .status(500)
        .json({ error: "Post deletion from the database failed." });
    }

    // Return a success message
    return res.status(200).json({ deletedPost });
  } catch (e) {
    // Catch-all for any other errors (e.g., database connection issues)
    return res.status(500).json({
      error: "An unexpected error occurred during post deletion.",
      details: e.message,
    });
  }
};
