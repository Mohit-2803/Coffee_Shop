const { sql } = require("../config/db");

const getRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const request = new sql.Request();
    request.input("productId", sql.Int, productId);

    const result = await request.query(`
      SELECT RatingID, ProductID, UserEmail, Rating, Comment, Name, CreatedAt 
      FROM Ratings 
      WHERE ProductID = @productId
      ORDER BY CreatedAt DESC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Error fetching ratings" });
  }
};

const checkEligibility = async (req, res) => {
  try {
    const { productId, email } = req.body;

    if (!productId || !email) {
      return res
        .status(400)
        .json({ message: "ProductId and email are required" });
    }

    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);
    request.input("productId", sql.Int, productId);

    const result = await request.query(`
      SELECT COUNT(*) AS IsEligible
      FROM Orders
      WHERE UserEmail = @email
      AND DeliveryStatus = 'delivered'
      AND EXISTS (
          SELECT 1 
          FROM OPENJSON(OrderItems) AS items
          WHERE items.value = @productId
      )
    `);

    const isEligible = result.recordset[0].IsEligible > 0;

    // Check if already reviewed
    const checkReviewRequest = new sql.Request();
    checkReviewRequest.input("email", sql.NVarChar, email);
    checkReviewRequest.input("productId", sql.Int, productId);
    const reviewResult = await checkReviewRequest.query(`
      SELECT COUNT(*) AS HasReviewed
      FROM Ratings
      WHERE UserEmail = @email AND ProductID = @productId
    `);

    res.status(200).json({
      isEligible: isEligible && reviewResult.recordset[0].HasReviewed === 0,
    });
  } catch (error) {
    console.error("Error checking eligibility:", error);
    res.status(500).json({ message: "Error checking eligibility" });
  }
};

const createRating = async (req, res) => {
  try {
    // Use email from the request body, or fallback to req.user.email if needed
    const email = req.body.email || (req.user && req.user.email);
    if (!email) {
      return res.status(401).json({ message: "User must be signed in" });
    }

    const { productId, rating, comment, name } = req.body;

    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);
    request.input("productId", sql.Int, productId);
    request.input("rating", sql.Int, rating);
    request.input("comment", sql.NVarChar, comment || null);
    request.input("name", sql.NVarChar, name || null);

    await request.query(`
      INSERT INTO Ratings (UserEmail, ProductID, Rating, Comment, Name)
      VALUES (@email, @productId, @rating, @comment, @name)
    `);

    // Update product rating
    const updateRequest = new sql.Request();
    updateRequest.input("productId", sql.Int, productId);
    await updateRequest.query(`
      UPDATE Products
      SET 
        TotalReviews = (SELECT COUNT(*) FROM Ratings WHERE ProductID = @productId),
        Rating = (SELECT AVG(Rating) FROM Ratings WHERE ProductID = @productId)
      WHERE ProductID = @productId
    `);

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).json({ message: "Error submitting rating" });
  }
};

module.exports = {
  getRatings,
  checkEligibility,
  createRating,
};
