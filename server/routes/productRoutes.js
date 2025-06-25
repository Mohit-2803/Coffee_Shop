const express = require("express");
const {
  getProductById,
  toggleWishlist,
  getWishlist,
  getTopProducts,
} = require("../controllers/productController");
const router = express.Router();

// Route to get a product by ProductID
router.get("/get-product/:id", getProductById);

// Route to get a wishlist by email
router.get("/get-wishlist/:email", getWishlist);

// Toggle wishlist route (POST method)
router.post("/wishlist/toggle", toggleWishlist);

//get top products
router.get("/top-products", getTopProducts);

module.exports = router;
