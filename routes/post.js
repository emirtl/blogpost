const express = require("express");
const routes = express.Router();
const controller = require("../controllers/post");
const multer = require("multer");
const isAuthenticatedUser = require("../middlewares/isAuth");

const MIME_TYPE = {
  "image/jpg": "jpg",
  "image/png": "png",
  "image/jpeg": "jpg",
};

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

routes.get("/getAll", controller.getAll);

routes.post("/insert", multer({ storage }).single("image"), controller.insert);

routes.put(
  "/update/:id",
  isAuthenticatedUser,
  multer({ storage }).single("image"),
  controller.update
);

routes.delete("/delete/:id", controller.delete);

module.exports = routes;
