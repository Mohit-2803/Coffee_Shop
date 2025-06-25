const express = require("express");
const {
  searchProducts,
  filterClothingProducts,
  filterElectronicsProducts,
} = require("../controllers/productSearchController");

const router = express.Router();

// Route to search products
router.get("/search", searchProducts);

// Route to search products
router.get("/filterClothingProducts", filterClothingProducts);

// Route to search products
router.get("/filterElectronicsProducts", filterElectronicsProducts);

module.exports = router;
