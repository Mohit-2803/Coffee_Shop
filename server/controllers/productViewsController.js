const ProductView = require("../models/ProductView");

const logProductView = async (req, res) => {
  try {
    // Now also extracting 'category' from the request body
    const { productId, userId, userName, category } = req.body;

    const newView = new ProductView({
      productId,
      userId: userId || null,
      userName: userName || null,
      category, // Save the category here
    });

    await newView.save();
    res.status(200).json({ message: "View logged successfully" });
  } catch (error) {
    console.error("Error logging product view:", error);
    res.status(500).json({ error: "Failed to log view" });
  }
};

module.exports = {
  logProductView,
};
