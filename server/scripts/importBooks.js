require("dotenv").config({ path: "../.env" }); // Load env from parent if running from scripts folder, or adjust path
const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const Book = require("../models/Book");

// Adjust path to .env if running from 'server' root
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

const csvFilePath = path.join(__dirname, "../../src/assets/books.csv");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  const books = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      // CSV columns: ID,Title,Author,Genre
      // Map to Schema: title, author, genre, externalId

      // Clean keys if needed (sometimes BOM or whitespace)
      const cleanRow = {};
      Object.keys(row).forEach((key) => {
        cleanRow[key.trim()] = row[key];
      });

      books.push({
        title: cleanRow.Title,
        author: cleanRow.Author,
        genre: cleanRow.Genre,
        externalId: cleanRow.ID,
      });
    })
    .on("end", async () => {
      console.log(`Parsed ${books.length} books from CSV.`);

      try {
        let addedCount = 0;
        let updatedCount = 0;

        for (const bookData of books) {
          // Check if book exists by externalId or Title + Author
          // Using externalId is safest if we trust the CSV IDs to be stable
          let existing = null;
          if (bookData.externalId) {
            existing = await Book.findOne({ externalId: bookData.externalId });
          }

          if (existing) {
            // Optional: Update if needed. For now, we skip or update?
            // Let's update to ensure latest data
            existing.title = bookData.title;
            existing.author = bookData.author;
            existing.genre = bookData.genre;
            await existing.save();
            updatedCount++;
          } else {
            await Book.create(bookData);
            addedCount++;
          }
        }

        console.log(
          `Import Complete. Added: ${addedCount}, Updated: ${updatedCount}`
        );
        process.exit(0);
      } catch (err) {
        console.error("Import error:", err);
        process.exit(1);
      }
    });
};

importData();
