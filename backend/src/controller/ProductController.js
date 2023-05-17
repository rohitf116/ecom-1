"use strict";
const Product = require("../model/ProductModel");

const { isValid, isValidObjectId } = require("../utils/regex");
const { uploadFile } = require("../utils/aws");

exports.createProduct = async (req, res) => {
  try {
    const { name, image, description, brand, category, price, countInStock } =
      req.body;
    console.log(req.body);
    if (!isValid(name)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }

    if (!isValid(description)) {
      return res
        .status(400)
        .json({ status: false, message: "description cannot be empty" });
    }
    if (!isValid(brand)) {
      return res
        .status(400)
        .json({ status: false, message: "brand cannot be empty" });
    }
    if (!isValid(category)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }
    if (!isValid(price)) {
      return res
        .status(400)
        .json({ status: false, message: "price cannot be empty" });
    }
    if (isNaN(price)) {
      return res
        .status(400)
        .json({ status: false, message: "price must be a number" });
    }

    //count

    if (countInStock && isNaN(countInStock)) {
      return res
        .status(400)
        .json({ status: false, message: "countInStock must be a number" });
    }
    const file = req?.files[0] || null;
    // console.log(file, "file");
    if (!file) {
      return res
        .status(400)
        .json({ status: false, message: "Image is required" });
    }
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return res
        .status(406)
        .json({ status: false, message: "Only images are allowed" });
    }
    const imageUrl = await uploadFile(file);
    console.log(file);
    const producrCreated = await Product.create({
      name,
      image: imageUrl,
      description,
      brand,
      category,
      price,
      countInStock,
    });
    res.status(201).json({
      status: true,
      message: "Product is successfully created",
      data: producrCreated,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 3;
    const skip = (page - 1) * limit;
    const keyword = req.query?.keyword
      ? {
          name: {
            $regex: req.query?.keyword,
            $options: "i",
          },
        }
      : {};
    const pages = await Product.countDocuments({ isDeleted: false });
    const foundData = await Product.find({ isDeleted: false, ...keyword })
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      status: true,
      message: "Succesfully fetched",
      numOfItems: foundData.length,
      data: foundData,
      pages: Number(Math.ceil(pages / limit)),
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid object id" });
    }
    const foundProduct = await Product.findOne({ isDeleted: false, _id: id });
    if (!foundProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    res.status(200).json({
      status: true,
      message: "Productdetails fetched",
      data: foundProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid object id" });
    }
    const foundProduct = await Product.findOne({ isDeleted: false, _id: id });
    if (!foundProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    console.log(req.body);
    const { name, image, description, brand, category, price, countInStock } =
      req.body;
    if (!isValid(name)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }

    if (!isValid(description)) {
      return res
        .status(400)
        .json({ status: false, message: "description cannot be empty" });
    }
    if (!isValid(brand)) {
      return res
        .status(400)
        .json({ status: false, message: "brand cannot be empty" });
    }
    if (!isValid(category)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }
    if (!isValid(price)) {
      return res
        .status(400)
        .json({ status: false, message: "price cannot be empty" });
    }
    if (isNaN(price)) {
      return res
        .status(400)
        .json({ status: false, message: "price must be a number" });
    }

    //count

    if (countInStock && isNaN(countInStock)) {
      return res
        .status(400)
        .json({ status: false, message: "countInStock must be a number" });
    }
    const file = req?.files[0] || null;
    // console.log(file, "file");
    if (!file) {
      return res
        .status(400)
        .json({ status: false, message: "Image is required" });
    }
    if (file.mimetype !== "image/png" && file.mimetype !== "image/jpeg") {
      return res
        .status(406)
        .json({ status: false, message: "Only images are allowed" });
    }
    const imageUrl = await uploadFile(file);
    console.log(imageUrl, "imageUrl");
    foundProduct.name = name;

    foundProduct.description = description;
    foundProduct.category = category;
    foundProduct.price = price;
    foundProduct.countInStock = countInStock;
    foundProduct.brand = brand;
    foundProduct.image = imageUrl;

    await foundProduct.save();
    res.status(200).json({
      status: true,
      message: "Product is successfully updated",
      data: foundProduct,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid object id" });
    }
    const foundProduct = await Product.findOne({ isDeleted: false, _id: id });
    if (!foundProduct) {
      return res
        .status(404)
        .json({ status: false, message: "Product not found" });
    }
    foundProduct.isDeleted = true;
    await foundProduct.save();
    res.status(200).json({
      status: true,
      message: "Productdetails successfully deleted",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error });
  }
};
