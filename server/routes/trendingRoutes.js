const express = require("express");
const router = express.Router();
const {
  getTrendingProductsByCategory,
} = require("../controllers/getTrendingProductsByCategory");

// Define route for fetching trending products by category
router.get("/products/:category", getTrendingProductsByCategory);

module.exports = router;
