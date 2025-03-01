const express = require("express");
const ratingController = require("../controllers/ratingController");

const router = express.Router();

router.get("/getRatings/:productId", ratingController.getRatings);
router.post("/check-eligibility", ratingController.checkEligibility);
router.post("/createRating", ratingController.createRating);

module.exports = router;
