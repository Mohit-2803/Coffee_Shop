const { sql } = require("../config/db");
const bcrypt = require("bcrypt");

// Signup function
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const pool = await sql.connect();
    const query = `INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)`;
    const request = pool.request();
    request.input("name", sql.NVarChar, name);
    request.input("email", sql.NVarChar, email);
    request.input("password", sql.NVarChar, hashedPassword);

    await request.query(query);

    res.status(201).json({ message: "User saved to database!" });
  } catch (err) {
    console.error("❌ Error saving user:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Verify user function
const verifyUser = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await sql.connect();

    // Check if the user is already verified
    const checkQuery = `SELECT is_verified FROM Users WHERE email = @email`;
    const checkRequest = pool.request();
    checkRequest.input("email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { is_verified } = checkResult.recordset[0];

    if (is_verified) {
      return res.status(200).json({ message: "User is already verified" });
    }

    // Update is_verified to 1
    const updateQuery = `UPDATE Users SET is_verified = 1 WHERE email = @email`;
    const updateRequest = pool.request();
    updateRequest.input("email", sql.NVarChar, email);
    await updateRequest.query(updateQuery);

    res.status(200).json({ message: "User is now verified" });
  } catch (err) {
    console.error("❌ Error verifying user:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Correct module exports
module.exports = { signupUser, verifyUser };
