const express = require("express");
const routes = express.Router();
const controller = require("../controllers/auth");

routes.post("/register", controller.register);

routes.post("/login", controller.login);

module.exports = routes;
