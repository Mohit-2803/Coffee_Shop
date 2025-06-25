const { sql } = require("../config/db");

// Search Products Controller
const searchProducts = async (req, res) => {
  const { search } = req.query; // Getting search term from query params

  try {
    // Validate the search term
    if (!search || search.trim().length === 0) {
      return res.status(400).json({ message: "Search term is required!" });
    }

    // Use a more efficient query to match products by name or description using LIKE
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
        Rating,                  -- Average product rating (e.g., 4.5)
        TotalReviews,            -- Total number of reviews
        IsFeatured               -- Featured status (0 = No, 1 = Yes)
      FROM Products
      WHERE 
        (Name LIKE @searchTerm OR Description LIKE @searchTerm)
      ORDER BY 
        CASE 
          WHEN Name LIKE @searchTerm THEN 1
          WHEN Description LIKE @searchTerm THEN 2
          ELSE 3
        END
    `;

    // Prepare the SQL request
    const request = new sql.Request();
    request.input("searchTerm", sql.NVarChar, `%${search.trim()}%`); // Using % for partial match

    // Execute the query
    const result = await request.query(query);

    // Return the results (limit to 5 results for efficiency)
    const limitedResults = result.recordset.slice(0, 5);

    if (limitedResults.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    return res.status(200).json(limitedResults);
  } catch (error) {
    console.error("Error searching products:", error);
    res
      .status(500)
      .json({ message: "Error searching products. Please try again later." });
  }
};

const filterClothingProducts = async (req, res) => {
  try {
    const request = new sql.Request();
    let conditions = [`Category = 'clothing'`];

    // Filter by Brands
    if (req.query.brands) {
      const brands = req.query.brands
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b);
      if (brands.length > 0) {
        let brandConditions = [];
        brands.forEach((brand, index) => {
          const paramName = `brand${index}`;
          brandConditions.push(`Brand LIKE @${paramName}`);
          request.input(paramName, sql.NVarChar, `%${brand}%`);
        });
        conditions.push(`(${brandConditions.join(" OR ")})`);
      }
    }

    // Filter by Sleeve Styles
    if (req.query.sleeveStyles) {
      const sleeveStyles = req.query.sleeveStyles
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);
      if (sleeveStyles.length > 0) {
        let sleeveConditions = [];
        sleeveStyles.forEach((style, index) => {
          const paramName = `sleeve${index}`;
          sleeveConditions.push(`SleeveStyle = @${paramName}`);
          request.input(paramName, sql.NVarChar, style);
        });
        conditions.push(`(${sleeveConditions.join(" OR ")})`);
      }
    }

    // Filter by minPrice and maxPrice (in INR)
    if (req.query.minPrice) {
      conditions.push(`Price >= ${parseFloat(req.query.minPrice)}`);
    }
    if (req.query.maxPrice) {
      conditions.push(`Price <= ${parseFloat(req.query.maxPrice)}`);
    }

    // Filter by Materials
    if (req.query.materials) {
      const materials = req.query.materials
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m);
      if (materials.length > 0) {
        let materialConditions = [];
        materials.forEach((material, index) => {
          const paramName = `material${index}`;
          materialConditions.push(`Material = @${paramName}`);
          request.input(paramName, sql.NVarChar, material);
        });
        conditions.push(`(${materialConditions.join(" OR ")})`);
      }
    }

    // Filter by Discounts
    if (req.query.discounts) {
      const discounts = req.query.discounts
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d);
      if (discounts.length > 0) {
        let discountConditions = [];
        discounts.forEach((discount, index) => {
          const paramName = `discount${index}`;
          discountConditions.push(`Discount >= @${paramName}`);
          request.input(paramName, sql.Int, parseInt(discount));
        });
        conditions.push(`(${discountConditions.join(" OR ")})`);
      }
    }

    // Filter by Rating
    if (req.query.rating) {
      conditions.push(`Rating >= ${parseFloat(req.query.rating)}`);
    }

    // Availability: if "includeOutOfStock" is not set to true, only show products with Stock > 0
    if (
      !req.query.includeOutOfStock ||
      req.query.includeOutOfStock === "false"
    ) {
      conditions.push("Stock > 0");
    }

    // Build the final query string
    let query = `
      SELECT 
        ProductID, 
        Name, 
        Description, 
        Price, 
        Category, 
        Brand, 
        SleeveStyle,
        Material,
        Stock, 
        Discount,
        ImageURL, 
        Size,
        Rating,                  
        TotalReviews,
        IsFeatured
      FROM Products
    `;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // Apply Sorting if provided
    if (req.query.sortOrder) {
      if (req.query.sortOrder.toLowerCase() === "asc") {
        query += " ORDER BY Price ASC";
      } else if (req.query.sortOrder.toLowerCase() === "desc") {
        query += " ORDER BY Price DESC";
      }
    }

    const result = await request.query(query);
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error filtering clothing products:", error);
    return res
      .status(500)
      .json({ message: "Error filtering products. Please try again later." });
  }
};

const filterElectronicsProducts = async (req, res) => {
  try {
    const request = new sql.Request();
    let conditions = [`Category = 'electronics'`];

    // Filter by Brands
    if (req.query.brands) {
      const brands = req.query.brands
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b);
      if (brands.length > 0) {
        let brandConditions = [];
        brands.forEach((brand, index) => {
          const paramName = `brand${index}`;
          brandConditions.push(`Brand LIKE @${paramName}`);
          request.input(paramName, sql.NVarChar, `%${brand}%`);
        });
        conditions.push(`(${brandConditions.join(" OR ")})`);
      }
    }

    // Filter by minPrice and maxPrice (in INR)
    if (req.query.minPrice) {
      conditions.push(`Price >= ${parseFloat(req.query.minPrice)}`);
    }
    if (req.query.maxPrice) {
      conditions.push(`Price <= ${parseFloat(req.query.maxPrice)}`);
    }

    // Filter by Discounts
    if (req.query.discounts) {
      const discounts = req.query.discounts
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d);
      if (discounts.length > 0) {
        let discountConditions = [];
        discounts.forEach((discount, index) => {
          const paramName = `discount${index}`;
          discountConditions.push(`Discount >= @${paramName}`);
          request.input(paramName, sql.Int, parseInt(discount));
        });
        conditions.push(`(${discountConditions.join(" OR ")})`);
      }
    }

    // Filter by Rating
    if (req.query.rating) {
      conditions.push(`Rating >= ${parseFloat(req.query.rating)}`);
    }

    // Availability filter
    if (
      !req.query.includeOutOfStock ||
      req.query.includeOutOfStock === "false"
    ) {
      conditions.push("Stock > 0");
    }

    let query = `
      SELECT 
        ProductID, 
        Name, 
        Description, 
        Price, 
        Category, 
        Brand, 
        Stock, 
        Discount,
        ImageURL, 
        Rating,                  
        TotalReviews,
        IsFeatured
      FROM Products
    `;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    if (req.query.sortOrder) {
      if (req.query.sortOrder.toLowerCase() === "asc") {
        query += " ORDER BY Price ASC";
      } else if (req.query.sortOrder.toLowerCase() === "desc") {
        query += " ORDER BY Price DESC";
      }
    }

    const result = await request.query(query);
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error filtering electronics products:", error);
    return res.status(500).json({
      message: "Error filtering electronics products. Please try again later.",
    });
  }
};

module.exports = {
  searchProducts,
  filterClothingProducts,
  filterElectronicsProducts,
};
