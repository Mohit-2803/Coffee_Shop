// Add simple caching to reduce database load
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
const { sql } = require("../config/db");
const ProductView = require("../models/ProductView"); // Import MongoDB model

const getTrendingProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const cacheKey = `trending-${category}`;

  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  try {
    const request = new sql.Request();
    request.input("category", sql.NVarChar, category);

    const query = `
  SELECT TOP 20 
    p.ProductID, 
    p.Name, 
    p.Price,
    p.Discount,
    p.Rating,
    p.ImageURL,
    p.Stock,
    p.Brand,
    p.TotalReviews,
    (SELECT COUNT(*) FROM Wishlist w WHERE w.ProductID = p.ProductID) AS WishlistCount,
    (
      SELECT SUM(CAST(q.value AS int))
      FROM Orders o
      CROSS APPLY OPENJSON(o.OrderItems) AS oi
      CROSS APPLY OPENJSON(o.ItemQuantity) AS q
      WHERE oi.[key] = q.[key]
        AND oi.value = CAST(p.ProductID AS nvarchar(50))
    ) AS PurchaseCount
  FROM Products p
  WHERE p.Category = @category
  ORDER BY PurchaseCount DESC, WishlistCount DESC
`;

    const sqlResult = await request.query(query);
    const products = sqlResult.recordset;

    // Get view counts from MongoDB
    const productIds = products.map((p) => p.ProductID.toString());
    const viewCounts = await ProductView.aggregate([
      {
        $match: {
          productId: { $in: productIds },
          category: category,
        },
      },
      {
        $group: {
          _id: "$productId",
          views: { $sum: 1 },
        },
      },
    ]);

    // Create view count map
    const viewMap = new Map(viewCounts.map((vc) => [vc._id, vc.views]));

    // Enhance products with view counts and calculate trending score
    const enhancedProducts = products.map((product) => {
      const views = viewMap.get(product.ProductID.toString()) || 0;
      return {
        ...product,
        ViewCount: views,
        TrendingScore:
          product.PurchaseCount * 0.5 +
          product.WishlistCount * 0.3 +
          views * 0.2,
      };
    });

    // Sort by trending score and take top 8
    const sortedProducts = enhancedProducts
      .sort((a, b) => b.TrendingScore - a.TrendingScore)
      .slice(0, 8);

    cache.set(cacheKey, sortedProducts);
    res.json(sortedProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500).json({ message: "Error fetching trending products" });
  }
};

module.exports = {
  getTrendingProductsByCategory,
};
