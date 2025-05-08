const User = require('../models/User'); // Adjust path as needed
const jwt = require('jsonwebtoken');

// Generate JWT token function
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register function
exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user (your existing logic)
    const newUser = new User({
      fullName, // Using fullName as in your code
      email,
      password, // Assuming your User model hashes the password
      // other fields...
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);
    console.log('Generated token for new user:', token); // For testing purposes
    
    // Return user info and token
    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    // Log the full error for debugging
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Check if password is correct
    // Assuming your User model has a method to compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    // Generate JWT token
    const token = generateToken(user._id);
    console.log('Generated token on login:', token); // For testing purposes
    
    // Return user info and token
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Login failed',
      error: error.message 
    });
  }
};

// Verify current user (can be used to check if token is valid)
exports.getCurrentUser = async (req, res) => {
  try {
    // The user should be available from the auth middleware
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get user information',
      error: error.message 
    });
  }
};