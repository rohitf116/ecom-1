"use strict";
const express = require("express");
const {
  createProduct,
  getAllProduct,
  getProductDetails,
  deleteProduct,
  updateProduct,
  getTopProducts,
} = require("../controller/ProductController");
const { isAuth, isAdmin } = require("../middleware/isAuth");
const router = express.Router();

router.post("/", isAuth, isAdmin, createProduct).get("/", getAllProduct);
router.route("/top").get(getTopProducts);
router.route("/:id").get(getProductDetails).put(isAuth, isAdmin, updateProduct);

router.route("/admin/:id").delete(isAuth, isAdmin, deleteProduct);

module.exports = router;
