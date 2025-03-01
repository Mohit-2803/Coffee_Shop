const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  handleStripeWebhook,
} = require("../controllers/paymentController");

// POST /api/payment/create-payment-intent - Creates a payment intent
router.post("/create-payment-intent", createPaymentIntent);

// POST /api/payment/webhook - Handles Stripe webhooks
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
