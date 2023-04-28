const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");
const User = require("../model/UserModel");
const Order = require("../model/OrderModel");
const { isValid, isValidObjectId } = require("../utils/regex");

exports.createOrder = async (req, res) => {
  try {
    const { _id,items, totalPrice, totalItems, totalQuantity, paymentMethod, taxPrice, shippingPrice } = req.body
    const user = req.user.id
    if (!isValid(totalPrice) || isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ status: false, message: "Invalid or empty total price" })
    }
    if (!isValid(totalItems) || isNaN(totalItems) || totalItems <= 0) {
      return res.status(400).json({ status: false, message: "Invalid or empty total total items" })
    }
    if (!isValid(totalQuantity) || isNaN(totalQuantity) || totalQuantity <= 0) {
      return res.status(400).json({ status: false, message: "Invalid or empty total total totalQuantity" })
    }
    //paymentMethod
    if (!isValid(paymentMethod)) {
      return res.status(400).json({ status: false, message: "paymentMethod cannot be empty" })
    }
    if (!isValid(taxPrice) || isNaN(totalQuantity) || totalQuantity < 0) {
      return res.status(400).json({ status: false, message: "Invalid or empty total total taxPrice" })
    }
    console.log(!isValid(shippingPrice),"0",isNaN(shippingPrice) ,"1")
    if ( isNaN(shippingPrice) ) {
      return res.status(400).json({ status: false, message: "Invalid or empty total total shippingPrice" })
    }
    if(totalPrice<500 && shippingPrice !==100){
      return res.status(400).json({ status: false, message: "must have shiiping chargers if totalPrice is less than 500" })
    }
    // const foundCart= await Cart.findOne({_id})
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    console.log(productIds,"productIds")
    let i =0
    while(i<productIds.length){
      console.log(productIds[i],products[i]?._id?.toString())
      if(productIds[i] !==products[i]?._id?.toString()){
        return res.status(404).json({status:false,message:`Product ${productIds[i]} not found`})
      }
      if(items[i].quantity > products[i]?.countInStock){
        return res.status(404).json({status:false,message:`Product ${items[i]._id}  cannot be ordered more than avalable`})
      }
      i++
    }
    res.status(201).json({status:true,message:"Order succefully placed",data:products})
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
