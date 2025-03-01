const { sql } = require("../config/db");

const updateUserProfileImage = async (req, res) => {
  try {
    const { email, profileImage } = req.body;
    if (!email || !profileImage) {
      return res
        .status(400)
        .json({ message: "Email and profile image are required." });
    }

    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);
    request.input("profileImage", sql.NVarChar, profileImage);

    const query = `
      UPDATE Users
      SET profileImage = @profileImage
      WHERE email = @email
    `;
    await request.query(query);
    res.status(200).json({ message: "Profile image updated successfully." });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);

    const query = "SELECT * FROM Users WHERE email = @email";
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the first (and ideally only) matching record
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateUserProfileImage, getUserDetails };
