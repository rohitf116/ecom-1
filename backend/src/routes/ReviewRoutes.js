"use strict";
const express = require("express");
const {
  createReview,
  getReview,
  getReviewForProduct,
} = require("../controller/ReviewController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();

router.route("/:id").post(isAuth, createReview).get(isAuth, getReview);
router.route("/product/:product").get(isAuth, getReviewForProduct);
module.exports = router;
