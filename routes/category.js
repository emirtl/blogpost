const express = require("express");
const routes = express.Router();
const controller = require("../controllers/category");

routes.get("/getAll", controller.getall);

routes.post("/insert", controller.insert);

routes.put("/update/:id", controller.update);

routes.delete("/delete/:id", controller.delete);

module.exports = routes;
