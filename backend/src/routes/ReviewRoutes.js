"use strict";
const express = require("express");
const { createReview } = require("../controller/ReviewController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();

router.route("/:id").post(isAuth, createReview);

module.exports = router;
