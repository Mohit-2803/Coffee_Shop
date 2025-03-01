const { sql } = require("../config/db");

// Electronics Product Controller (renamed to addProductElectronics)
const addProductElectronics = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    stock,
    images, // Array of images
    sellerEmail,
    weight,
    shippingCost,
    returnPolicy,
    warranty,
    tags,
    discount, // Discount field
    setupService, // New SetupService field
  } = req.body;

  try {
    // Validate the required fields
    if (!name || !price || !category || !brand || !stock || !sellerEmail) {
      console.log("Validation failed: Missing fields");
      return res
        .status(400)
        .json({ message: "All required fields must be provided!" });
    }

    // Extract first image URL
    const imageUrl = images && images.length > 0 ? images[0] : null;

    // SQL Query to insert an electronics product.
    // Clothing-specific columns are set to NULL.
    const query = `
      INSERT INTO Products 
        (Name, Description, Price, Category, Brand, Stock, ImageURL, SellerEmail, Weight, ShippingCost, ReturnPolicy, Warranty, Tags, Discount, SetupService, Size, Color, Material, SleeveStyle)
      VALUES 
        (@name, @description, @price, @category, @brand, @stock, @imageUrl, @sellerEmail, @weight, @shippingCost, @returnPolicy, @warranty, @tags, @discount, @setupService, NULL, NULL, NULL, NULL);
    `;

    const request = new sql.Request();
    request.input("name", sql.NVarChar, name);
    request.input("description", sql.NVarChar, description || null);
    request.input("price", sql.Decimal, price);
    request.input("category", sql.NVarChar, category);
    request.input("brand", sql.NVarChar, brand);
    request.input("stock", sql.Int, stock);
    request.input("imageUrl", sql.NVarChar, imageUrl);
    request.input("sellerEmail", sql.NVarChar, sellerEmail);
    request.input("weight", sql.Decimal, weight || null);
    request.input("shippingCost", sql.Decimal, shippingCost || 0.0);
    request.input("returnPolicy", sql.NVarChar, returnPolicy || null);
    request.input("warranty", sql.NVarChar, warranty || null);
    request.input("tags", sql.NVarChar, tags || null);
    request.input("discount", sql.Decimal, discount || 0.0);
    request.input("setupService", sql.NVarChar, setupService || null);

    await request.query(query);

    res
      .status(200)
      .json({ message: "Electronics product added successfully!" });
  } catch (error) {
    console.error("Error adding electronics product:", error);
    res.status(500).json({
      message: "Error adding electronics product. Please try again later.",
    });
  }
};

// Clothing Product Controller (addProductClothes)
const addProductClothes = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    stock,
    images, // Array of images
    sellerEmail,
    weight,
    shippingCost,
    returnPolicy,
    warranty,
    tags,
    discount, // Discount field
    size,
    color,
    material,
    sleeveStyle,
  } = req.body;

  try {
    // Validate the required fields, including clothing-specific fields
    if (
      !name ||
      !price ||
      !category ||
      !brand ||
      !stock ||
      !sellerEmail ||
      !size ||
      !color ||
      !sleeveStyle
    ) {
      console.log("Validation failed: Missing fields for clothing product");
      return res.status(400).json({
        message: "All required fields for clothing must be provided!",
      });
    }

    // Extract first image URL
    const imageUrl = images && images.length > 0 ? images[0] : null;

    // SQL Query to insert a clothing product including clothing-specific columns.
    const query = `
      INSERT INTO Products 
        (Name, Description, Price, Category, Brand, Stock, ImageURL, SellerEmail, Weight, ShippingCost, ReturnPolicy, Warranty, Tags, Discount, Size, Color, Material, SleeveStyle)
      VALUES 
        (@name, @description, @price, @category, @brand, @stock, @imageUrl, @sellerEmail, @weight, @shippingCost, @returnPolicy, @warranty, @tags, @discount, @size, @color, @material, @sleeveStyle);
    `;

    const request = new sql.Request();
    request.input("name", sql.NVarChar, name);
    request.input("description", sql.NVarChar, description || null);
    request.input("price", sql.Decimal, price);
    request.input("category", sql.NVarChar, category);
    request.input("brand", sql.NVarChar, brand);
    request.input("stock", sql.Int, stock);
    request.input("imageUrl", sql.NVarChar, imageUrl);
    request.input("sellerEmail", sql.NVarChar, sellerEmail);
    request.input("weight", sql.Decimal, weight || null);
    request.input("shippingCost", sql.Decimal, shippingCost || 0.0);
    request.input("returnPolicy", sql.NVarChar, returnPolicy || null);
    request.input("warranty", sql.NVarChar, warranty || null);
    request.input("tags", sql.NVarChar, tags || null);
    request.input("discount", sql.Decimal, discount || 0.0);
    request.input("size", sql.NVarChar, size);
    request.input("color", sql.NVarChar, color);
    request.input("material", sql.NVarChar, material || null);
    request.input("sleeveStyle", sql.NVarChar, sleeveStyle);

    await request.query(query);

    res.status(200).json({ message: "Clothing product added successfully!" });
  } catch (error) {
    console.error("Error adding clothing product:", error);
    res.status(500).json({
      message: "Error adding clothing product. Please try again later.",
    });
  }
};

// Get Products by Seller Email Controller (unchanged except for including new columns)
const getProducts = async (req, res) => {
  const { sellerEmail } = req.params; // Get seller email from request parameters

  try {
    if (!sellerEmail) {
      return res.status(400).json({ message: "Seller email is required!" });
    }

    const query = `
      SELECT 
        ProductID, 
        Name, 
        Description, 
        Price, 
        Category, 
        Brand, 
        Stock, 
        ImageURL, 
        SellerEmail, 
        Weight, 
        ShippingCost, 
        ReturnPolicy, 
        Warranty, 
        Tags, 
        Discount, 
        SetupService,
        Size,
        Color,
        Material,
        SleeveStyle,
        Rating,       
        TotalReviews,  
        IsFeatured,    
        CreatedAt, 
        UpdatedAt
      FROM Products
      WHERE SellerEmail = @sellerEmail;
    `;

    const request = new sql.Request();
    request.input("sellerEmail", sql.NVarChar, sellerEmail);

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this seller." });
    }

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products. Please try again later." });
  }
};

module.exports = { addProductElectronics, addProductClothes, getProducts };
