const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
//middlewares
app.use("/public/uploads", express.static(path.join("public/uploads")));
app.use(express.json());
app.use(cors());

//routes
const categoryRoutes = require("./routes/category");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");

app.use(`${process.env.API}/categories`, categoryRoutes);
app.use(`${process.env.API}/posts`, postRoutes);
app.use(`${process.env.API}/auth`, authRoutes);

module.exports = app;
