const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//midlewares
app.use(cors());
app.use(express.json());

//routes
const categoryRoutes = require("./routes/category");

app.use(`${process.env.API}/categories`, categoryRoutes);

module.exports = app;
