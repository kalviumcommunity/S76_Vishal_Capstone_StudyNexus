const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { registerSchema, loginSchema, updateUserSchema } = require('../Validation/authValidation');
const validateRequest = require('../middleware/validateRequest');

// POST: User registration - Add Joi validation middleware
router.post("/register", validateRequest(registerSchema), async (req, res) => {
  try {
    // Extract fields and handle both name and fullName for compatibility
    const { name, fullName, email, password } = req.body;

    // Use fullName if provided, otherwise use name
    const userFullName = fullName || name;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user with properly mapped fields
    const newUser = new User({
      fullName: userFullName,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST: User login - Add Joi validation middleware
router.post("/login", validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field explicitly included
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: Get all users
router.get("/users", async (req, res) => {
  try {
    // Find all users but exclude passwords
    const users = await User.find().select("-password");

    res.json({
      success: true,
      count: users.length,
      users: users.map((user) => ({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: Get user by ID
router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Handle invalid ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT: Update user by ID - Add Joi validation middleware
router.put("/users/:id", validateRequest(updateUserSchema), async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullName, email, password, currentPassword } = req.body;

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Find user first to check if exists - include password for verification
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another account",
        });
      }
    }

    // Password change requires current password verification
    if (password) {
      // Verify current password
      const isPasswordCorrect = await user.comparePassword(currentPassword);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
    }

    // Update only allowed fields
    const updatedFields = {};
    if (fullName) updatedFields.fullName = fullName;
    if (email) updatedFields.email = email;

    // Handle password update (with hashing)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.password = await bcrypt.hash(password, salt);
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true } // Return updated document
    );

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id.toString(),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;