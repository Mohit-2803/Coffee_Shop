const express = require("express");
const {
  updateUserProfileImage,
  getUserDetails,
} = require("../controllers/userController");
const router = express.Router();

// Route to add or update profile image
router.put("/update-profile-image", updateUserProfileImage);

// Route to get full user details by email
router.get("/details", getUserDetails);

module.exports = router;
