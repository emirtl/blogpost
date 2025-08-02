const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Check for required environment variables before starting the app.
// This is a crucial step for debugging Heroku crashes.
const requiredEnvVars = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "MONGOOSE_USER",
  "MONGOOSE_PASSWORD",
  "MONGOOSE_DATABSE_NAME",
  "API",
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`ERROR: Environment variable "${envVar}" is not set.`);
    console.error(
      "Please set this variable in your Heroku Dashboard under Settings -> Config Vars."
    );
    process.exit(1); // Exit the process with an error code
  }
});

const { S3Client } = require("@aws-sdk/client-s3");

// Initialize S3 client.
// The code will now crash gracefully with a clear error message if the
// environment variables are not set.
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., 'us-east-1', 'eu-central-1'
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//middlewares
app.use(
  cors({
    origin: ["https://whiterabbit-blog.netlify.app", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);
app.use(express.json());

//routes
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post")(s3);
const authRoutes = require("./routes/auth");
const authorRoutes = require("./routes/author");

app.use((req, res, next) => {
  console.log("Hello App");
  return next();
});

app.use(`${process.env.API}/categories`, categoryRoutes);
app.use(`${process.env.API}/posts`, postRoutes);
app.use(`${process.env.API}/auth`, authRoutes);
app.use(`${process.env.API}/authors`, authorRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Use a try...catch block to catch errors in the Mongoose connection
// and prevent the app from crashing silently.
async function connectToDatabase() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGOOSE_USER}:${process.env.MONGOOSE_PASSWORD}@master.xebze3l.mongodb.net/${process.env.MONGOOSE_DATABSE_NAME}`
    );
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("ERROR: Failed to connect to MongoDB.");
    console.error(error);
    process.exit(1); // Exit with an error code if the database connection fails
  }
}

connectToDatabase();

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = s3;
