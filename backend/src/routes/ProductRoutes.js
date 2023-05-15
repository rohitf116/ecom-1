"use strict";
const express = require("express");
const {
  createProduct,
  getAllProduct,
  getProductDetails,
  deleteProduct,
  updateProduct,
} = require("../controller/ProductController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();

router.post("/", createProduct).get("/", getAllProduct);
router.route("/:id").get(getProductDetails).put(isAuth, updateProduct);

router.route("/admin/:id").delete(isAuth, deleteProduct);

module.exports = router;
