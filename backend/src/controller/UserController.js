const User = require("../model/UserModel");
const dotenv = require("dotenv");
const { isValid, isValidEmail, isValidObjectId } = require("../utils/regex");
const { sendMail } = require("../utils/communications");
const { generateExpiry, generateOTP } = require("../utils/calculation");
const {
  hashPassword,
  verifyHashedPassword,
  generateAndHashOTP,
  generateJWT,
} = require("../utils/securityAndEncryption");
const { showRespnse } = require("../utils/showResponse");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");
dotenv.config();
const secret = process.env.SECRET;
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isValid(name)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }
    if (!isValid(email)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }
    if (!isValid(password)) {
      return res
        .status(400)
        .json({ status: false, message: "Name cannot be empty" });
    }
    const hashedPassword = await hashPassword(password);
    const emailData = {
      value: email,
      isVerified: false,
    };
    const simpleOtp = generateOTP();
    const otp = await generateAndHashOTP(simpleOtp);

    const foundEmail = await User.findOne({
      isDeleted: false,
      "email.value": email,
    });
    if (foundEmail) {
      return res
        .status(400)
        .json({ success: false, message: "This email is already exist" });
    }
    console.log(emailData, otp);
    const createdUser = await User.create({
      name,
      email: emailData,
      otp,
      password: hashedPassword,
    });
    sendMail(
      email,
      "Verify Email",
      "Please click the link below to verify your email address:",
      `<p>You OTP is :${Number(simpleOtp)} </p>  `
    );
    const response = showRespnse(createdUser, "register");

    res.status(201).json({
      status: true,
      message: "Succesfully created user",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const foundUser = await UserModel.findOne({ isDeleted: false, _id: id });
    console.log(foundUser);
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const response = showRespnse(foundUser, "user");
    res.status(200).json({
      status: true,
      message: "User fetched successfully",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isValid(email) || !isValid(password)) {
      return res
        .status(400)
        .json({ status: false, message: "email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ isDeleted: false, status: false, message: "Invalid email" });
    }
    const foundUser = await User.findOne({
      isDeleted: false,
      "email.value": email,
    });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    if (!foundUser.email.isVerified) {
      return res
        .status(400)
        .json({ status: false, message: "Please verify your email" });
    }

    const isMatch = await verifyHashedPassword(password, foundUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });
    }
    const token = generateJWT(foundUser);
    const response = showRespnse(foundUser, "login");
    response.token = token;
    res
      .status(200)
      .cookie("LOGIN_HASH", token, {
        httpOnly: false,
      })
      .json({ status: true, message: "Login success", data: response });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!isValid(email)) {
      return res
        .status(400)
        .json({ status: false, message: "email cannot be empty" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }
    if (!isValid(otp)) {
      return res
        .status(400)
        .json({ status: false, message: "otp cannot be empty" });
    }
    if (isNaN(otp)) {
      return res
        .status(400)
        .json({ status: false, message: "otp must be a number" });
    }
    const foundEmail = await User.findOne({
      isDeleted: false,
      "email.value": email,
    });
    console.log(foundEmail, "emmmm");
    if (!foundEmail) {
      return res
        .status(404)
        .json({ status: false, message: "Email not found" });
    }
    if (foundEmail.email.isVerified) {
      return res
        .status(404)
        .json({ status: false, message: "Email is already verified" });
    }

    if (foundEmail.otp.email.expiry < Date.now()) {
      return res.status(404).json({ status: false, message: "OTP is expired" });
    }
    console.log(foundEmail.otp.email.value, "------------");

    const isMatch = await verifyHashedPassword(
      String(otp),
      foundEmail.otp.email.value
    );
    console.log(201, "------------");
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });
    }
    foundEmail.email.isVerified = true;
    foundEmail.otp.email.value = null;
    foundEmail.otp.email.expiry = null;
    await foundEmail.save();
    res.status(200).json({ status: true, message: "Email is verified" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.regenerateEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!isValid(email)) {
      return res
        .status(400)
        .json({ status: false, message: "email cannot be empty" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }
    const foundEmail = await User.findOne({
      isDeleted: false,
      "email.value": email,
    });
    if (!foundEmail) {
      return res
        .status(404)
        .json({ status: false, message: "Email not found" });
    }
    if (foundEmail.email.isVerified) {
      return res
        .status(404)
        .json({ status: false, message: "Email is already verified" });
    }
    const simpleOtp = generateOTP();
    const otp = await generateAndHashOTP(simpleOtp);
    foundEmail.otp = otp;
    await foundEmail.save();
    sendMail(
      email,
      "Resent OTP",
      "Please click the link below to verify your email address:",
      `<p>You OTP is :${Number(simpleOtp)} </p>  `
    );
    res.status(200).json({ status: true, message: "Otp Resent" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { name } = req.body;
    const foundUser = await User.findOne({ isDeleted: false, _id: id });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    if (name && isValid(name)) {
      foundUser.name = name;
    }
    await foundUser.save();
    const response = showRespnse(foundUser, "user");
    res
      .status(200)
      .json({ status: true, message: "User details updated", data: response });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const id = req.user.id;
    const foundUser = await User.findOne({ isDeleted: false, _id: id });

    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    if (foundUser.isDeleted) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    foundUser.isDeleted = true;
    await foundUser.save();
    res.status(203).json({ status: true, message: "User is deleted" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id = req.user.id;
    const { password } = req.body;

    if (!password || !isValid(password)) {
      return res
        .status(400)
        .json({ status: false, message: "password cannot be empty" });
    }
    const foundUser = await UserModel.findOne({ isDeleted: false, _id: id });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const isMatch = await verifyHashedPassword(password, foundUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Incorrect password" });
    }
    const hashedPassword = await hashPassword(password);
    foundUser.password = hashedPassword;
    await foundUser.save();
    const response = showRespnse(foundUser, "user");
    res.status(200).json({
      status: true,
      message: "Password successfully changed",
      data: response,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
exports.addAddress = async (req, res) => {
  try {
    const id = req.user.id;
    const { street, city, postalCode, country = "India" } = req.body;
    if (!isValid(street)) {
      return res
        .status(400)
        .json({ status: false, message: "street cannot be empty" });
    }
    if (!isValid(city)) {
      return res
        .status(400)
        .json({ status: false, message: "city cannot be empty" });
    }
    if (!isValid(postalCode)) {
      return res
        .status(400)
        .json({ status: false, message: "postalCode cannot be empty" });
    }
    if (isNaN(postalCode)) {
      return res
        .status(400)
        .json({ status: false, message: "postalCode must be a number" });
    }
    if (!isValid(street)) {
      return res
        .status(400)
        .json({ status: false, message: "street cannot be empty" });
    }
    const foundUser = await UserModel.findOne({ _id: id });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    foundUser.address.push({ street, city, postalCode, country });
    const lastAddress = foundUser.address;
    await foundUser.save();
    res.status(200).json({
      status: true,
      message: "Address added succesfully",
      data: lastAddress,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const id = req.user.id;
    const foundUser = await UserModel.findOne({ _id: id });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const address = foundUser?.address || [];
    res.status(200).json({
      status: true,
      message: "Address fetched succesfully",
      data: address,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const id = req.user.id;
    const { street, city, postalCode, country, index = 0 } = req.body;

    if (!isValid(street)) {
      return res
        .status(400)
        .json({ status: false, message: "street cannot be empty" });
    }
    if (!isValid(city)) {
      return res
        .status(400)
        .json({ status: false, message: "city cannot be empty" });
    }
    if (!isValid(postalCode) && isNaN(postalCode)) {
      return res
        .status(400)
        .json({ status: false, message: "postalcode cannot be empty" });
    }
    if (isNaN(postalCode)) {
      return res
        .status(400)
        .json({ status: false, message: "postalCode must be number" });
    }
    if (!isValid(country)) {
      return res
        .status(400)
        .json({ status: false, message: "country cannot be empty" });
    }

    if (index ?? !isValid(index)) {
      return res
        .status(400)
        .json({ status: false, message: "index cannot be empty" });
    }
    if (index ?? isNaN(index)) {
      return res
        .status(400)
        .json({ status: false, message: "index must be number" });
    }
    const foundUser = await UserModel.findOne({ _id: id });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    const deepArray = [...foundUser.address];
    if (index >= deepArray.length) {
      return res.status(400).json({ status: false, message: "Invalid index" });
    }
    deepArray[index] = { street, city, postalCode, country };
    foundUser.address = deepArray;
    await foundUser.save();
    res.status(200).json({
      status: true,
      message: "Address updated succesfully",
      data: foundUser.address[index],
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const foundUser = await UserModel.find({ isDeleted: false }).select(
      "-password -otp"
    );
    res.status(200).json({
      status: true,
      message: "All users fetched successfully",
      data: foundUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
exports.deleteuserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Object id" });
    }
    const foundUser = await UserModel.findOne({ _id: id, isDeleted: false });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    foundUser.isDeleted = true;
    await foundUser.save();
    res
      .status(200)
      .json({ status: true, message: "User is succesfully deleted by admin" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};

exports.updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Object id" });
    }
    const { name, email } = req.body;
    const foundUser = await UserModel.findOne({ _id: id, isDeleted: false });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    name && isValid(name)
      ? (foundUser.name = name)
      : (foundUser.name = foundUser.name);
    email && isValid(email) && isValidEmail(email)
      ? (foundUser.email.value = email)
      : (foundUser.email.value = foundUser.email.value);
    await foundUser.save();
    res
      .status(200)
      .json({ status: true, message: "User is succesfully update by admin" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
exports.getUserByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Object id" });
    }
    const foundUser = await UserModel.findOne({ _id: id, isDeleted: false });
    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res
      .status(200)
      .json({
        status: true,
        message: "User is succesfully fetched by admin",
        data: foundUser,
      });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Server Error", error: error.message });
  }
};
