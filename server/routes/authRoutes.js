const express = require("express");
const { signupUser, verifyUser } = require("../controllers/authController");

const router = express.Router();

// Signup route
router.post("/signup", signupUser);
router.post("/verifyUser", verifyUser);

module.exports = router;
