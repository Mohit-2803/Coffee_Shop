const express = require("express");
const router = express.Router();
const {
  addProductElectronics,
  addProductClothes,
  getProducts,
} = require("../controllers/sellerCentralController");

// Route to add a new product electronics
router.post("/add-product-electronics", addProductElectronics);

// Route to add a new product clothes
router.post("/add-product-clothes", addProductClothes);

// Route to get products
router.get("/getProducts/:sellerEmail", getProducts);

module.exports = router;
