const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 
const User = require("../models/User");
const { registerSchema, loginSchema, updateUserSchema } = require('../Validation/authValidation');
const validateRequest = require('../middleware/validateRequest');
const { protect } = require('../middleware/authMiddleware');

// Import auth controller
const { register, login, getCurrentUser, googleAuth, updateLearningProfile } = require('../controllers/authController');

// ADDED: Import Firebase admin
const admin = require('../config/firebase.config');

// JWT Token Generation utility
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// NEW: Token verification endpoint
router.get("/verify", protect, (req, res) => {
  try {
    res.json({
      success: true,
      message: "Token is valid",
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        learningProfile: req.user.learningProfile || {}
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
});

// NEW: Update learning profile route
router.put("/learning-profile", protect, updateLearningProfile);

// NEW: Google authentication using controller
router.post("/google-signin", googleAuth);

// EXISTING: Google authentication endpoint
router.post("/google-auth", async (req, res) => {
  try {
    const { email, displayName, photoURL } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // Update existing user with Google info if needed
      if (!user.authProvider || user.authProvider !== 'google') {
        user.authProvider = 'google';
        if (photoURL && !user.profilePicture) {
          user.profilePicture = photoURL;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        fullName: displayName || email.split('@')[0],
        email,
        profilePicture: photoURL,
        authProvider: 'google'
      });
      
      await user.save();
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        learningStyle: user.learningProfile?.learningStyle,
        learningProfile: user.learningProfile
      },
      token
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Authentication failed",
      error: error.message
    });
  }
});

// Original registration route - slightly modified to include authProvider
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
      // ADDED: Specify this is a local auth user
      authProvider: 'local'
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);
    console.log('Generated token for new user:', token); // For testing

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      token // Include token in response
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Original login route - modified to check for Google auth users
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

    // ADDED: Check if this is a Google auth user
    if (user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        message: "This account uses Google authentication. Please sign in with Google."
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    console.log('Generated token on login:', token); // For testing

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        // ADDED: Include profile picture if available
        profilePicture: user.profilePicture
      },
      token // Include token in response
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET: Get current user - modified to include new fields
router.get("/me", protect, async (req, res) => {
  try {
    // User is available from the middleware
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        learningStyle: user.learningProfile?.learningStyle,
        learningProfile: user.learningProfile
      }
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// All other routes remain unchanged
router.get("/users", protect, async (req, res) => {
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

router.get("/users/:id", protect, async (req, res) => {
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

router.put("/users/:id", protect, validateRequest(updateUserSchema), async (req, res) => {
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

    // Add authorization check: User can only update their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this user",
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

router.delete("/users/:id", protect, async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate if userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    // Add authorization check: User can only delete their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this user",
      });
    }
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;