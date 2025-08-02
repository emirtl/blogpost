const express = require("express");
const routes = express.Router();
const controller = require("../controllers/post");
const multer = require("multer");
const isAuthenticatedUser = require("../middlewares/isAuth");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const multerS3 = require("multer-s3");
module.exports = (s3) => {
  const MIME_TYPE = {
    "image/jpg": "jpg",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
    "video/webm": "webm",
    "video/x-flv": "flv",
  };

  //! before s3 update
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE[file.mimetype];
      let error = new Error("file format is not an image");
      if (isValid) {
        error = null;
      }
      cb(error, "public/uploads");
    },
    filename: (req, file, cb) => {
      const name = `${file.originalname.toLocaleLowerCase().split(".")[0]}`;
      const uniqueSuffix = `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`;
      const ext = MIME_TYPE[file.mimetype];
      cb(null, `${uniqueSuffix}-${name}.${ext}`);
    },
  });

  const upload = multer({
    storage: multerS3({
      s3: s3, // The S3 instance passed from app.js
      bucket: process.env.S3_BUCKET_NAME, // Your S3 bucket name from environment variables
      // acl: "public-read", // Makes the uploaded file publicly accessible
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        // Define the filename and path within your S3 bucket
        // Example: uploads/image-1753780256426-originalfilename.gif
        const ext = MIME_TYPE[file.mimetype];
        const uniqueSuffix = `${file.fieldname}-${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}`;
        const originalName = file.originalname
          .toLocaleLowerCase()
          .split(".")[0];
        cb(null, `uploads/${uniqueSuffix}-${originalName}.${ext}`);
      },
      // --- Set Storage Class to Standard-IA for cost optimization ---
      StorageClass: "STANDARD_IA",
    }),
    // File filter for allowed file types (same as your original logic)
    fileFilter: (req, file, cb) => {
      const isValid = MIME_TYPE[file.mimetype];
      let error = new Error(
        "Invalid file format. Only images (JPG, PNG, GIF) are allowed."
      );
      if (isValid) {
        error = null;
      }
      cb(error, isValid); // Pass true/false based on isValid
    },
    // Optional: Limit file size (e.g., 5MB)
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  routes.get("/getAll", controller.getAll);

  routes.get("/getOne/:id", controller.getOne);

  routes.post(
    "/insert",
    isAuth,
    isAdmin,
    upload.single("image"),
    // isAuthenticatedUser,
    controller.insert
  );

  routes.put(
    "/update/:id",
    isAuth,
    isAdmin,
    // isAuthenticatedUser,
    upload.single("image"),
    controller.update
  );

  routes.delete("/delete/:id", isAuth, isAdmin, (req, res, next) => {
    controller.delete(req, res, next, s3);
  });

  return routes;
};
