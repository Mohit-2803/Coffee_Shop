const express = require("express");
const router = express.Router();
const {
  getAddress,
  updateAddress,
} = require("../controllers/addressController");

// GET address for a user
router.get("/users/:email/address", getAddress);

// PUT (update/add) address for a user
router.put("/users/:email/address", updateAddress);

module.exports = router;
