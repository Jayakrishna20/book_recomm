require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/books", bookRoutes);

// Database Connection
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file.");
  // Do not exit process in dev environments if just testing file creation,
  // but in real app we should. For now, letting it run to prevent crash loops if user hasn't set it yet.
  console.warn(
    "Server starting without DB connection... (Add MONGO_URI to connect)"
  );
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB:", err));
}

app.get("/", (req, res) => {
  res.send("Book Recommender API is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
