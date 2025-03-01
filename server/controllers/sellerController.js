const { sql } = require("../config/db");

// ===================  Seller Controllers ===================

// Check if user is already a seller
const checkSeller = async (req, res) => {
  const { email } = req.body;
  try {
    const pool = await sql.connect();
    const query = `SELECT isSeller FROM Users WHERE email = @email`;
    const request = pool.request();
    request.input("email", sql.NVarChar, email);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { isSeller } = result.recordset[0];
    res.status(200).json({ isSeller: Boolean(isSeller) });
  } catch (error) {
    console.error("❌ Error checking seller status:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Become Seller function (existing logic)
const becomeSeller = async (req, res) => {
  const { email, name } = req.body;

  try {
    const pool = await sql.connect();

    // Check if the user exists
    const checkQuery = `SELECT * FROM Users WHERE email = @email`;
    const checkRequest = pool.request();
    checkRequest.input("email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length === 0) {
      // User does not exist, so create a new record
      const insertQuery = `
        INSERT INTO Users (name, email, password, is_verified, isSeller)
        VALUES (@name, @email, @password, 1, 1)
      `;
      const insertRequest = pool.request();
      insertRequest.input("name", sql.NVarChar, name);
      insertRequest.input("email", sql.NVarChar, email);
      // "google login" indicates the user signed in with Google
      insertRequest.input("password", sql.NVarChar, "google login");
      await insertRequest.query(insertQuery);

      return res
        .status(201)
        .json({ message: "User created and registered as a seller" });
    }

    // If user exists, update isSeller and is_verified to true (1)
    const updateQuery = `
      UPDATE Users
      SET isSeller = 1, is_verified = 1
      WHERE email = @email
    `;
    const updateRequest = pool.request();
    updateRequest.input("email", sql.NVarChar, email);
    await updateRequest.query(updateQuery);

    res.status(200).json({ message: "User is now registered as a seller" });
  } catch (error) {
    console.error("❌ Error updating user to seller:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// ===================  Store Controllers ===================

// Controller to add (or update) store details
const addStoreDetails = async (req, res) => {
  const { email, storeName, address } = req.body;

  try {
    const pool = await sql.connect();

    // Check if store details already exist for the given email
    const checkQuery = `SELECT * FROM StoreDetails WHERE email = @email`;
    const checkRequest = pool.request();
    checkRequest.input("email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length > 0) {
      // Store details already exist, so update them
      const updateQuery = `
        UPDATE StoreDetails
        SET storeName = @storeName, address = @address
        WHERE email = @email
      `;
      const updateRequest = pool.request();
      updateRequest.input("storeName", sql.NVarChar, storeName);
      updateRequest.input("address", sql.NVarChar, address);
      updateRequest.input("email", sql.NVarChar, email);
      await updateRequest.query(updateQuery);

      return res
        .status(200)
        .json({ message: "Store details updated successfully" });
    } else {
      // Insert new store details
      const insertQuery = `
        INSERT INTO StoreDetails (email, storeName, address)
        VALUES (@email, @storeName, @address)
      `;
      const insertRequest = pool.request();
      insertRequest.input("email", sql.NVarChar, email);
      insertRequest.input("storeName", sql.NVarChar, storeName);
      insertRequest.input("address", sql.NVarChar, address);
      await insertRequest.query(insertQuery);

      return res
        .status(201)
        .json({ message: "Store details added successfully" });
    }
  } catch (error) {
    console.error("❌ Error adding/updating store details:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Controller to check if store details have been added for a user
const checkStoreDetails = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await sql.connect();
    const query = `SELECT * FROM StoreDetails WHERE email = @email`;
    const request = pool.request();
    request.input("email", sql.NVarChar, email);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(200).json({ storeDetailsAdded: false });
    }

    // Optionally, return the store details along with the flag
    return res
      .status(200)
      .json({ storeDetailsAdded: true, details: result.recordset[0] });
  } catch (error) {
    console.error("❌ Error checking store details:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// ===================  Bank Controllers ===================

// Controller to add (or update) bank details
const addBankDetails = async (req, res) => {
  const { email, accountNumber, bankName, ifsc } = req.body;

  try {
    const pool = await sql.connect();

    // Check if bank details already exist for the given email
    const checkQuery = `SELECT * FROM BankDetails WHERE email = @email`;
    const checkRequest = pool.request();
    checkRequest.input("email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkQuery);

    if (checkResult.recordset.length > 0) {
      // Bank details exist; update them
      const updateQuery = `
        UPDATE BankDetails
        SET accountNumber = @accountNumber, bankName = @bankName, ifsc = @ifsc, updatedAt = GETDATE()
        WHERE email = @email
      `;
      const updateRequest = pool.request();
      updateRequest.input("accountNumber", sql.NVarChar, accountNumber);
      updateRequest.input("bankName", sql.NVarChar, bankName);
      updateRequest.input("ifsc", sql.NVarChar, ifsc);
      updateRequest.input("email", sql.NVarChar, email);
      await updateRequest.query(updateQuery);

      return res
        .status(200)
        .json({ message: "Bank details updated successfully" });
    } else {
      // Insert new bank details
      const insertQuery = `
        INSERT INTO BankDetails (email, accountNumber, bankName, ifsc)
        VALUES (@email, @accountNumber, @bankName, @ifsc)
      `;
      const insertRequest = pool.request();
      insertRequest.input("email", sql.NVarChar, email);
      insertRequest.input("accountNumber", sql.NVarChar, accountNumber);
      insertRequest.input("bankName", sql.NVarChar, bankName);
      insertRequest.input("ifsc", sql.NVarChar, ifsc);
      await insertRequest.query(insertQuery);

      return res
        .status(201)
        .json({ message: "Bank details added successfully" });
    }
  } catch (error) {
    console.error("❌ Error adding/updating bank details:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Controller to check if bank details have been added for a user
const checkBankDetails = async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await sql.connect();
    const query = `SELECT * FROM BankDetails WHERE email = @email`;
    const request = pool.request();
    request.input("email", sql.NVarChar, email);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return res.status(200).json({ bankDetailsAdded: false });
    }

    // Return a flag along with the bank details (if needed)
    return res.status(200).json({
      bankDetailsAdded: true,
      details: result.recordset[0],
    });
  } catch (error) {
    console.error("❌ Error checking bank details:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// =================== Registration Progress Controllers ===================

// Controller to get registration progress for a user
const getRegistrationProgress = async (req, res) => {
  // Use req.body.email (not req.query.email) because the frontend sends the email in the body
  const { email } = req.body;
  try {
    const pool = await sql.connect();
    const query = `
      SELECT currentStep, completedSteps 
      FROM RegistrationProgress 
      WHERE email = @email
    `;
    const request = pool.request();
    request.input("email", sql.NVarChar, email);
    const result = await request.query(query);
    if (result.recordset.length === 0) {
      // If no record exists, assume default progress values:
      // We assume account creation is already complete, so start at step 2.
      return res.status(200).json({ currentStep: 2, completedSteps: 1 });
    }
    const { currentStep, completedSteps } = result.recordset[0];
    res.status(200).json({ currentStep, completedSteps });
  } catch (error) {
    console.error("❌ Error fetching registration progress:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Controller to update registration progress for a user
const updateRegistrationProgress = async (req, res) => {
  const { email, currentStep, completedSteps } = req.body;
  try {
    const pool = await sql.connect();
    // Check if a record exists for this email
    const checkQuery = `SELECT * FROM RegistrationProgress WHERE email = @email`;
    const checkRequest = pool.request();
    checkRequest.input("email", sql.NVarChar, email);
    const checkResult = await checkRequest.query(checkQuery);
    if (checkResult.recordset.length === 0) {
      // Insert new record if it doesn't exist
      const insertQuery = `
        INSERT INTO RegistrationProgress (email, currentStep, completedSteps)
        VALUES (@email, @currentStep, @completedSteps)
      `;
      const insertRequest = pool.request();
      insertRequest.input("email", sql.NVarChar, email);
      insertRequest.input("currentStep", sql.Int, currentStep);
      insertRequest.input("completedSteps", sql.Int, completedSteps);
      await insertRequest.query(insertQuery);
    } else {
      // Otherwise, update the existing record
      const updateQuery = `
        UPDATE RegistrationProgress
        SET currentStep = @currentStep, completedSteps = @completedSteps, updatedAt = GETDATE()
        WHERE email = @email
      `;
      const updateRequest = pool.request();
      updateRequest.input("email", sql.NVarChar, email);
      updateRequest.input("currentStep", sql.Int, currentStep);
      updateRequest.input("completedSteps", sql.Int, completedSteps);
      await updateRequest.query(updateQuery);
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error updating registration progress:", error);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  checkSeller,
  becomeSeller,
  addStoreDetails,
  checkStoreDetails,
  addBankDetails,
  checkBankDetails,
  getRegistrationProgress,
  updateRegistrationProgress,
};
