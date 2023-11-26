const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const path = require("path");

//midlewares
app.use(cors());
app.use(express.json());
app.use("/public/uploads", express.static(path.join("public/uploads")));

//routes
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");

app.use(`${process.env.API}/categories`, categoryRoutes);
app.use(`${process.env.API}/posts`, postRoutes);

module.exports = app;
