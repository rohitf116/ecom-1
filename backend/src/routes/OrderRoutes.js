"use strict";
const express = require("express");
const { createOrder } = require("../controller/OrderController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();

router.route("/").post(isAuth, createOrder);
// router.get("/:id", getProductDetails);

module.exports = router;
