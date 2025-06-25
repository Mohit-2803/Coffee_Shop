const { sql } = require("../config/db");

// Get Product by ID Controller
const getProductById = async (req, res) => {
  const { id } = req.params; // ProductID from URL parameters

  try {
    // Validate ProductID
    if (!id) {
      return res.status(400).json({ message: "ProductID is required!" });
    }

    // SQL query to fetch the product by ProductID
    const query = `
      SELECT 
        ProductID, 
        Name, 
        Description, 
        Price, 
        Category, 
        Brand, 
        Weight,
        Stock, 
        Discount,
        ImageURL, 
        SetupService,
        Size,
        Color,
        Material,
        SleeveStyle,
        Rating,                -- Average product rating (e.g., 4.5)
        TotalReviews,          -- Total number of reviews
        IsFeatured             -- Featured status (0 = No, 1 = Yes)
      FROM Products
      WHERE ProductID = @productID
    `;

    // Prepare the SQL request
    const request = new sql.Request();
    request.input("productID", sql.Int, id); // Using the ProductID from the URL params

    // Execute the query
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Send the product data back as response
    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Error fetching product. Please try again later." });
  }
};

// Toggle Wishlist Controller
const toggleWishlist = async (req, res) => {
  const { email, productId } = req.body; // Expect email and productId in the body

  // Validate required fields
  if (!email || !productId) {
    return res
      .status(400)
      .json({ message: "Email and productId are required." });
  }

  try {
    // Create a request to check if the wishlist entry exists
    const checkRequest = new sql.Request();
    checkRequest.input("email", sql.NVarChar, email);
    checkRequest.input("productId", sql.Int, productId);
    const checkQuery = `
      SELECT * FROM Wishlist
      WHERE Email = @email AND ProductID = @productId
    `;
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length > 0) {
      // If the product is already in the wishlist, remove it.
      const deleteRequest = new sql.Request();
      deleteRequest.input("email", sql.NVarChar, email);
      deleteRequest.input("productId", sql.Int, productId);
      const deleteQuery = `
        DELETE FROM Wishlist
        WHERE Email = @email AND ProductID = @productId
      `;
      await deleteRequest.query(deleteQuery);
      return res
        .status(200)
        .json({ message: "Product removed from wishlist." });
    } else {
      // If the product is not in the wishlist, add it.
      const insertRequest = new sql.Request();
      insertRequest.input("email", sql.NVarChar, email);
      insertRequest.input("productId", sql.Int, productId);
      const insertQuery = `
        INSERT INTO Wishlist (Email, ProductID)
        VALUES (@email, @productId)
      `;
      await insertRequest.query(insertQuery);
      return res.status(201).json({ message: "Product added to wishlist." });
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    return res
      .status(500)
      .json({ message: "Error toggling wishlist. Please try again later." });
  }
};

// Get wishlist for a given email
const getWishlist = async (req, res) => {
  // For example, you might pass the email as a URL parameter
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);
    // Optionally join with the Products table to get more product details
    const query = `
      SELECT w.Email, w.ProductID, p.Name, p.Price, p.ImageURL, p.Discount, p.Category, p.size
      FROM Wishlist w
      INNER JOIN Products p ON w.ProductID = p.ProductID
      WHERE w.Email = @email
    `;
    const result = await request.query(query);
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Error fetching wishlist." });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const query = `
      SELECT TOP 10 
        p.ProductID,
        p.Name,
        p.Rating,
        SUM(q.Quantity) AS TotalSales,
        SUM(q.Quantity) * p.Price AS Revenue
      FROM Products p
      JOIN (
        SELECT 
          o.OrderID, 
          CAST(oi.value AS int) AS ProductID, 
          CAST(iq.value AS int) AS Quantity,
          oi.[key] AS idx
        FROM Orders o
        CROSS APPLY OPENJSON(o.OrderItems) oi
        CROSS APPLY OPENJSON(o.ItemQuantity) iq
        WHERE oi.[key] = iq.[key]
      ) q ON p.ProductID = q.ProductID
      GROUP BY p.ProductID, p.Name, p.Rating, p.Price
      ORDER BY TotalSales DESC, Revenue DESC;
    `;
    const request = new sql.Request();
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Error fetching top products" });
  }
};

module.exports = {
  getProductById,
  toggleWishlist,
  getWishlist,
  getTopProducts,
};
