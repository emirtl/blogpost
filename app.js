const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
//middlewares
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public", "uploads"))
);
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://whiterabbit-blog.netlify.app/",
      "http://localhost:4200",
      "https://whiterabbit-07e575316da2.herokuapp.com",
    ], // Add all allowed origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//routes
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");
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

module.exports = app;
