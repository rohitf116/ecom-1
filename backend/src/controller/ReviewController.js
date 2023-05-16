const ProductModel = require("../model/ProductModel");
const ReviewModel = require("../model/ReviewModel");
const UserModel = require("../model/UserModel");
const { isValid } = require("../utils/regex");
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params;
    if (!isValid(comment)) {
      return res
        .status(400)
        .json({ status: false, message: "comment cannot be empty" });
    }
    if (!isValid(rating)) {
      return res
        .status(400)
        .json({ status: false, message: "rating cannot be empty" });
    }
    if (isNaN(rating)) {
      return res
        .status(400)
        .json({ status: false, message: "rating must be a number" });
    }
    console.log(rating < 1 || rating > 5);
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ status: false, message: "rating must be a 1 to 5" });
    }
    const foundProduct = await ProductModel.findOne({ _id: id });
    if (!foundProduct) {
      return res
        .status(404)
        .json({ status: false, message: "product not found" });
    }
    const user = req.user.id;
    const foundUser = await UserModel.findOne({ _id: user });
    const alreadyReviewed = await ReviewModel.findOne({ user, product: id });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ status: false, message: "review already added " });
    }
    const createdReview = await ReviewModel.create({
      rating,
      name: foundUser.name,
      comment,
      user,
      product: id,
    });

    const newRating = foundProduct.rating * foundProduct.numReviews + rating;
    foundProduct.numReviews += 1;
    foundProduct.rating = Number(
      (newRating / foundProduct.numReviews).toFixed(2)
    );
    await foundProduct.save();
    res.status(201).json({
      status: true,
      message: "Successfully created review",
      data: createdReview,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
