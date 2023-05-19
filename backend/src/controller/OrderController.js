const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");
const User = require("../model/UserModel");
const Order = require("../model/OrderModel");
const { isValid, isValidObjectId } = require("../utils/regex");
const { getTotalItems } = require("../utils/calculation");
exports.createOrder = async (req, res) => {
  try {
    const { _id, paymentMethod, taxPrice, shippingPrice, shippingAddress } =
      req.body;
    console.log(req.body, "body");
    if (!isValid(shippingAddress)) {
      return res
        .status(400)
        .json({ status: false, message: "shippingAddress cannot be empty" });
    }
    const { street, city, postalCode, country } = shippingAddress;
    if (!street || !isValid(street)) {
      return res
        .status(400)
        .json({ status: false, message: "street cannot be empty" });
    }
    if (!city || !isValid(city)) {
      return res
        .status(400)
        .json({ status: false, message: "city cannot be empty" });
    }
    if (!postalCode || !isValid(postalCode) || isNaN(postalCode)) {
      return res.status(400).json({
        status: false,
        message: "postalCode cannot be empty and must be a number",
      });
    }
    if (!country || !isValid(country)) {
      return res
        .status(400)
        .json({ status: false, message: "country cannot be empty" });
    }
    const metadata = { street, city, postalCode, country };
    const user = req.user.id;
    const foundCart = await Cart.findOne({ _id });
    if (!foundCart) {
      return res.status(404).json({ status: false, message: "Cart not found" });
    }
    console.log(foundCart, "foundCart");
    const { items, totalPrice, totalItems } = foundCart;
    if (!items?.length) {
      return res
        .status(400)
        .json({ status: false, message: "Your cart is empty" });
    }
    console.log(items, "items");
    if (!isValid(totalPrice) || isNaN(totalPrice) || totalPrice <= 0) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or empty total price" });
    }
    if (!isValid(totalItems) || isNaN(totalItems) || totalItems <= 0) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or empty total total items" });
    }
    // if (!isValid(totalQuantity) || isNaN(totalQuantity) || totalQuantity <= 0) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Invalid or empty total total totalQuantity",
    //   });
    // }
    //paymentMethod
    if (!isValid(paymentMethod)) {
      return res
        .status(400)
        .json({ status: false, message: "paymentMethod cannot be empty" });
    }
    if (!isValid(taxPrice) || isNaN(taxPrice) || taxPrice < 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid or empty total total taxPrice",
      });
    }
    console.log(!isValid(shippingPrice), "0", isNaN(shippingPrice), "1");
    if (isNaN(shippingPrice)) {
      return res.status(400).json({
        status: false,
        message: "Invalid or empty total total shippingPrice",
      });
    }
    if (totalPrice < 500 && shippingPrice !== 100) {
      return res.status(400).json({
        status: false,
        message: "must have shiiping chargers if totalPrice is less than 500",
      });
    }
    // const foundCart= await Cart.findOne({_id})
    const productIds = items.map((item) => item.productId);
    const totalQuantity = getTotalItems(items);
    const products = await Product.find({ _id: { $in: productIds } });

    console.log(productIds, "productIds");
    let i = 0;
    while (i < productIds.length) {
      console.log(productIds[i], products[i]?._id?.toString());
      if (productIds[i]?.toString() !== products[i]?._id?.toString()) {
        console.log(productIds, "productIds");
        return res.status(404).json({
          status: false,
          message: `Product ${productIds[i]} not found`,
        });
      }
      if (items[i].quantity > products[i]?.countInStock) {
        return res.status(404).json({
          status: false,
          message: `Product ${items[i]._id}  cannot be ordered more than avalable`,
        });
      }
      i++;
    }
    const updateProducts = items.map((item) => {
      return Product.updateOne(
        { _id: item.productId },
        { $inc: { countInStock: -item.quantity } }
      );
    });

    await Promise.all(updateProducts);
    const orderCreated = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      totalItems,
      paymentMethod,
      taxPrice,
      shippingPrice,
      metadata,
      totalQuantity,
    });
    foundCart.totalPrice = 0;
    foundCart.totalItems = 0;
    foundCart.items = [];
    await foundCart.save();
    res.status(201).json({
      status: true,
      message: "Order succefully placed",
      data: orderCreated,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: `Invalid object id`,
      });
    }
    const foundOrder = await Order.findOne({ _id: id });
    if (!foundOrder) {
      return res
        .status(404)
        .json({ status: false, message: "order not found" });
    }
    res.status(200).json({
      status: true,
      message: "Order found successfully",
      data: foundOrder,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(200).json({
        status: false,
        message: `Invalid object id`,
      });
    }
    const foundOrder = await Order.findOne({ _id: id });
    if (!foundOrder) {
      return res
        .status(404)
        .json({ status: false, message: "order not found" });
    }
    foundOrder.isPaid = true;
    foundOrder.paidAt = Date.now();
    foundOrder.paymntResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    await foundOrder.save();
    res.status(200).json("Ok");
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const user = req.user.id;
    const foundOrders = await Order.find({ user });
    res.status(200).json({
      status: true,
      message: "Users orders successfully fetched",
      data: foundOrders,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const foundOrders = await Order.find();
    res.status(200).json({
      status: true,
      message: "Users orders successfully fetched by admin",
      data: foundOrders,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.markasDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: false,
        message: `Invalid object id`,
      });
    }
    const foundOrder = await Order.findOne({ _id: id });
    if (!foundOrder) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    }

    if (foundOrder.isDelevered) {
      return res
        .status(400)
        .json({ status: false, message: "Already delivered" });
    }
    foundOrder.isDelevered = true;
    foundOrder.deleveredAt = Date.now();
    await foundOrder.save();
    res.status(200).json({
      status: true,
      message: "This orders is marked as delivered by admin",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
