const mongoose = require("mongoose");

const productViewSchema = new mongoose.Schema({
  userId: {
    type: String, // Store MSSQL userId as a string
    default: null,
  },
  userName: {
    type: String, // Store MSSQL user's name
    default: null,
  },
  productId: {
    type: String, // Store MSSQL productId as a string
    required: true,
  },
  category: {
    type: String, // Save the product's category
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProductView", productViewSchema);
