const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Create Express app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// Verify JWT environment variables
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables!');
  process.exit(1); // Exit with error
}

// THEN add middleware
app.use(cors());
app.use(express.json());

// Add logging middleware AFTER app is defined
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Import DB connection and models
const connectDB = require("./db");
const User = require("./models/User");

// Import routes
const authRoutes = require("./routes/auth.routes");
const studyGroupRoutes = require("./routes/studyGroupRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/studygroups", studyGroupRoutes);

// Root route
app.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      name: "StudyNexus API",
      status: "online",
      usersCount: users.length,
      users: users.map((user) => ({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      name: "StudyNexus API",
      status: "error",
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Connect to MongoDB before starting server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

module.exports = app;