const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");
const User = require("../model/UserModel");
const Order = require("../model/OrderModel");
const { isValid, isValidObjectId } = require("../utils/regex");

exports.createOrder = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
