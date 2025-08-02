const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const { S3Client } = require("@aws-sdk/client-s3");

// Configure AWS S3 credentials and region globally
// These environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
// must be set on Heroku and in your local .env file.
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1', 'eu-central-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Initialize S3 client. This instance will be used by multer-s3.

const app = express();
//middlewares
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);
app.use(express.json());
app.use(
  cors({
    origin: ["https://whiterabbit-blog.netlify.app", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post")(s3);
const authRoutes = require("./routes/auth");
const authorRoutes = require("./routes/author");

app.use((req, res, next) => {
  // Handle the error
  console.log("Hello App");
  return next();
});

app.use(`${process.env.API}/categories`, categoryRoutes);
app.use(`${process.env.API}/posts`, postRoutes);
app.use(`${process.env.API}/auth`, authRoutes);
app.use(`${process.env.API}/authors`, authorRoutes);

app.use((err, req, res, next) => {
  // Handle the error
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = {
  app,
  s3,
};
