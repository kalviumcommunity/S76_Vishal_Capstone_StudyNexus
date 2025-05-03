const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import User model
const User = require("./models/User");

// Import DB connection
const connectDB = require("./db"); // Import the connectDB function

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth.routes");
const studyGroupRoutes = require("./routes/studyGroupRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/studygroups", studyGroupRoutes);

// Updated root route to display users
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
    // Start server after successful connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });

module.exports = app;
