const express = require("express");
const routes = express.Router();
const controller = require("../controllers/category");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

routes.get("/getAll", controller.getAll);

routes.post("/insert", isAuth, isAdmin, controller.insert);

routes.put("/update/:id", isAuth, isAdmin, controller.update);

routes.delete("/delete/:id", isAuth, isAdmin, controller.delete);

module.exports = routes;
