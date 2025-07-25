const express = require("express");
const router = express.Router();
const controller = require("../controllers/author");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

router.get("/getAll", controller.getAll);

router.get("/getOne/:id", controller.getOne);

router.post("/insert", isAuth, isAdmin, controller.insert);

router.put("/update/:id", isAuth, isAdmin, controller.update);

router.delete("/delete/:id", isAuth, isAdmin, controller.delete);

module.exports = router;
