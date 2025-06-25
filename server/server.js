// Load environment variables
require("dotenv").config();
const admin = require("firebase-admin");

try {
  // Get the raw service account string from the environment variable
  let serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
  console.log("Raw service account string:", serviceAccountString);

  // Trim any accidental whitespace
  serviceAccountString = serviceAccountString.trim();

  // Parse the JSON string
  const serviceAccount = JSON.parse(serviceAccountString);
  console.log("Parsed service account object:", serviceAccount);

  // Replace literal "\\n" with actual newline characters in the private key
  if (typeof serviceAccount.private_key === "string") {
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\\n/g,
      "\n"
    );
  } else {
    throw new Error("private_key property is missing or not a string.");
  }

  // Ensure client_email is a string and trim any extra whitespace
  if (typeof serviceAccount.client_email !== "string") {
    throw new Error("client_email property is missing or not a string.");
  }
  serviceAccount.client_email = serviceAccount.client_email.trim();

  // Initialize Firebase Admin with the corrected service account object
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully.");
} catch (err) {
  console.error("Error initializing Firebase Admin:", err);
}

const express = require("express");
const cors = require("cors");
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

// Middleware
app.use(express.json());
app.use(cors());

// Connect to databases
connectDB();
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
