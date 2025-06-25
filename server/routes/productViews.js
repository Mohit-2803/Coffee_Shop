const express = require("express");
const router = express.Router();
const { logProductView } = require("../controllers/productViewsController");

// Route to log a product view
router.post("/view", logProductView);

module.exports = router;
