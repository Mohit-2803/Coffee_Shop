// seedRatings.js
const { connectDB, sql } = require("../server/config/db.js");
const { faker } = require("@faker-js/faker");

const seedRatings = async () => {
  await connectDB();
  console.log("Seeding ratings...");

  // Only these product IDs are available for ratings
  const availableProductIds = [2, 4, 5, 6, 7, 8, 9, 10, 11];

  try {
    for (let i = 0; i < 100; i++) {
      // Randomly pick a product ID from the available list
      const productId = faker.helpers.arrayElement(availableProductIds);
      // Generate a fake user email
      const userEmail = faker.internet.email();
      // Generate a random rating between 1 and 5 with one decimal place
      const rating = faker.number.float({ min: 1, max: 5, precision: 0.1 });
      // Generate a comment for the rating
      const comment = faker.lorem.sentence();
      // Generate a random past date for when the rating was created
      const createdAt = faker.date.past();
      // Generate a fake full name for the reviewer
      const name = faker.person.fullName();

      // Insert data into the Ratings table
      await sql.query`
        INSERT INTO Ratings 
          (ProductID, UserEmail, Rating, Comment, CreatedAt, Name)
        VALUES 
          (${productId}, ${userEmail}, ${rating}, ${comment}, ${createdAt}, ${name})
      `;
      console.log(`Inserted rating ${i + 1}`);
    }
    console.log("✅ Ratings seeding complete.");
  } catch (error) {
    console.error("❌ Error seeding ratings:", error);
  } finally {
    await sql.close();
  }
};

seedRatings();
