const { sql } = require("../config/db");

// 🛒 **Add Item to Cart** (Using Email and Size)
const addToCart = async (req, res) => {
  const { email, productId, quantity, size } = req.body;

  if (!email || !productId || !quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  try {
    // Check if the product already exists in the cart with the same size
    const checkRequest = new sql.Request();
    checkRequest.input("email", sql.VarChar, email);
    checkRequest.input("productId", sql.Int, productId);
    checkRequest.input("size", sql.VarChar, size || null);
    const checkQuery = `
      SELECT * FROM Cart 
      WHERE email = @email AND ProductID = @productId
        AND ((@size IS NULL AND Size IS NULL) OR Size = @size)
    `;
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length > 0) {
      // If product exists, update quantity
      const updateRequest = new sql.Request();
      updateRequest.input("email", sql.VarChar, email);
      updateRequest.input("productId", sql.Int, productId);
      updateRequest.input("quantity", sql.Int, quantity);
      updateRequest.input("size", sql.VarChar, size || null);
      const updateQuery = `
        UPDATE Cart
        SET Quantity = Quantity + @quantity
        WHERE email = @email AND ProductID = @productId
          AND ((@size IS NULL AND Size IS NULL) OR Size = @size)
      `;
      await updateRequest.query(updateQuery);
      return res.status(200).json({ message: "Cart updated successfully." });
    } else {
      // Insert new item in cart along with size
      const insertRequest = new sql.Request();
      insertRequest.input("email", sql.VarChar, email);
      insertRequest.input("productId", sql.Int, productId);
      insertRequest.input("quantity", sql.Int, quantity);
      insertRequest.input("size", sql.VarChar, size || null);
      const insertQuery = `
        INSERT INTO Cart (email, ProductID, Quantity, Size)
        VALUES (@email, @productId, @quantity, @size)
      `;
      await insertRequest.query(insertQuery);
      return res.status(201).json({ message: "Product added to cart." });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Error adding to cart." });
  }
};

// 🛒 **Remove Item from Cart** (Using Email)
const removeFromCart = async (req, res) => {
  const { email, productId } = req.body;

  if (!email || !productId) {
    return res
      .status(400)
      .json({ message: "Email and ProductID are required." });
  }

  try {
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    request.input("productId", sql.Int, productId);
    const deleteQuery = `DELETE FROM Cart WHERE email = @email AND ProductID = @productId`;
    await request.query(deleteQuery);
    return res.status(200).json({ message: "Product removed from cart." });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "Error removing product." });
  }
};

// 🛒 **Get Cart Items** (Using Email)
const getCartItems = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    const query = `
      SELECT c.CartID, 
             c.Quantity, 
             c.Size,
             p.ProductID, 
             p.Name, 
             p.Price, 
             p.ImageURL,
             p.Discount,
             p.Stock,
             (p.Price * (1 - (p.Discount / 100))) AS DiscountedPrice,
             (p.Price * (1 - (p.Discount / 100))) * c.Quantity AS TotalPrice
      FROM Cart c
      INNER JOIN Products p ON c.ProductID = p.ProductID
      WHERE c.email = @email
    `;
    const result = await request.query(query);
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ message: "Error fetching cart items." });
  }
};

const updateCartQuantity = async (req, res) => {
  const { email, productId, quantity, size } = req.body;

  try {
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    request.input("productId", sql.Int, productId);
    request.input("quantity", sql.Int, quantity);
    request.input("size", sql.VarChar, size || null);
    const query = `
      UPDATE Cart 
      SET Quantity = @quantity 
      WHERE email = @email AND ProductID = @productId
        AND ((@size IS NULL AND Size IS NULL) OR Size = @size)
    `;
    await request.query(query);
    res.status(200).json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Error updating quantity" });
  }
};

// Export Controllers
module.exports = {
  addToCart,
  removeFromCart,
  getCartItems,
  updateCartQuantity,
};
