const express = require("express");
const {
  getOrdersByEmail,
  cancelOrder,
  getOrderById,
  getOrdersBySeller,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

// POST to fetch orders with email in the request body
router.post("/get-orders", getOrdersByEmail);

// POST to cancel an order
router.post("/cancel-order", cancelOrder);

// POST to get order by ID
router.get("/getOrderById/:orderId", getOrderById);

// Seller order Routes
router.post("/seller", getOrdersBySeller);
router.put("/update-status", updateOrderStatus);

module.exports = router;
