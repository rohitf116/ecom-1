"use strict";

const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    brand: { type: String, required: true, dafult: "No Brand" },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = model("Product", ProductSchema);
