"use strict";
const express = require("express");
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,getMyOrders
} = require("../controller/OrderController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();

router.route("/").post(isAuth, createOrder).get(isAuth,getMyOrders)
router.route("/:id").get(isAuth, getOrderById).put(isAuth, updateOrderToPaid);
router.route("/:id/pay").put(isAuth, updateOrderToPaid);
// router.get("/:id", getProductDetails);

module.exports = router;
