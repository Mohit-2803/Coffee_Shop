const express = require("express");
const {
  becomeSeller,
  checkSeller,
  addStoreDetails,
  checkStoreDetails,
  addBankDetails,
  checkBankDetails,
  getRegistrationProgress,
  updateRegistrationProgress,
} = require("../controllers/sellerController.js");

const router = express.Router();

// Signup route
router.post("/becomeSeller", becomeSeller);

// Route to check if user is a seller
router.post("/isSeller", checkSeller);

// Route to add or update store details
router.post("/addStoreDetails", addStoreDetails);

// Route to check if store details have been added for a user
router.post("/checkStoreDetails", checkStoreDetails);

// Route to add or update bank details
router.post("/addBankDetails", addBankDetails);

// Route to check if bank details have been added for a user
router.post("/checkBankDetails", checkBankDetails);

// Route to get seller registration progress
router.post("/progress", getRegistrationProgress);

// Route to update seller registration progress
router.post("/update-progress", updateRegistrationProgress);

module.exports = router;
