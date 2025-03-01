const { sql } = require("../config/db");

// Get user's address by email
const getAddress = async (req, res) => {
  const { email } = req.params;

  try {
    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    const query = "SELECT address FROM Users WHERE email = @email";
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // If the address column is null, then no address has been set yet
    const addressString = result.recordset[0].address;
    if (!addressString) {
      return res.status(200).json(null);
    }

    const address = JSON.parse(addressString);
    return res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return res.status(500).json({ message: "Error fetching address." });
  }
};

// Update (or add) user's address by email
const updateAddress = async (req, res) => {
  const { email } = req.params;
  const { fullName, street, city, state, zipCode, country, phone } = req.body;

  // Ensure all fields are provided
  if (
    !fullName ||
    !street ||
    !city ||
    !state ||
    !zipCode ||
    !country ||
    !phone
  ) {
    return res
      .status(400)
      .json({ message: "All address fields are required." });
  }

  try {
    // Convert the address object to a JSON string to store it in the database
    const addressData = JSON.stringify({
      fullName,
      street,
      city,
      state,
      zipCode,
      country,
      phone,
    });

    const request = new sql.Request();
    request.input("email", sql.VarChar, email);
    request.input("address", sql.NVarChar(sql.MAX), addressData);
    const query = `
      UPDATE Users
      SET address = @address
      WHERE email = @email
    `;
    await request.query(query);
    return res.status(200).json({ message: "Address updated successfully." });
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(500).json({ message: "Error updating address." });
  }
};

module.exports = { getAddress, updateAddress };
