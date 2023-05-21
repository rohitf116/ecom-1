"use strict";
const express = require("express");
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
  markasDelivered,
} = require("../controller/OrderController");
const { isAuth, isAdmin } = require("../middleware/isAuth");
const router = express.Router();

router.route("/").post(isAuth, createOrder).get(isAuth, getMyOrders);
router.route("/admin").get(isAuth, isAdmin, getAllOrders);
router.route("/admin/:id").patch(isAuth, isAdmin, markasDelivered);
router.route("/:id").get(isAuth, getOrderById).put(isAuth, updateOrderToPaid);
router.route("/:id/pay").put(isAuth, updateOrderToPaid);

// router.get("/:id", getProductDetails);

module.exports = router;
