"use strict";

const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;
const ReviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: ObjectId,
      ref: "User",
    },
    product: { type: ObjectId, refs: "Product", required: true },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Review", ReviewSchema);
