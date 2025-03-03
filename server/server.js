const express = require("express");
const cors = require("cors");
require("dotenv").config();
const admin = require("firebase-admin");
const { connectDB } = require("./config/db");
const connectMongoDB = require("./config/mongodb");
const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const sellerCentralRoutes = require("./routes/sellerCentralRoutes");
const productSearchRoutes = require("./routes/productSearchRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const addressRoutes = require("./routes/addressRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const productViews = require("./routes/productViews");
const trendingRoutes = require("./routes/trendingRoutes");

const app = express();

// Mount the webhook route first using express.raw()
// This route will receive the raw body for Stripe signature verification.
app.use("/api/payment/webhook", express.raw({ type: "application/json" }));

// Firebase
// Parse JSON string from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MS-sql DB
connectDB();

// Connect to MongoDB
connectMongoDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/seller-central", sellerCentralRoutes);
app.use("/api/search-product", productSearchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/productViews", productViews);
app.use("/api/trending", trendingRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
