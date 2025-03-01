const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  getCartItems,
  updateCartQuantity,
} = require("../controllers/cartController");

// Define routes
router.put("/add", addToCart); // Add to cart
router.delete("/remove", removeFromCart); // Remove from cart
router.get("/get-cart/:email", getCartItems); // Get cart items
router.put("/update", updateCartQuantity); // Get cart items

module.exports = router;
