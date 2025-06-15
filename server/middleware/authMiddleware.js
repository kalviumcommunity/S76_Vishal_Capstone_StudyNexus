const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as needed
const admin = require('../config/firebase.config'); // Import Firebase admin

exports.protect = async (req, res, next) => {
  try {
    let token;
    let isFirebaseToken = false;
    
    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      // Check if this might be a Firebase token (they are typically longer)
      if (token.length > 500) {
        isFirebaseToken = true;
      }
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    try {
      let userId;
      
      if (isFirebaseToken) {
        // Verify Firebase token
        try {
          const decodedFirebase = await admin.auth().verifyIdToken(token);
          
          // Find or create user based on Google authentication
          let user = await User.findOne({ email: decodedFirebase.email });
          
          if (!user) {
            // Create new user from Google data
            user = new User({
              fullName: decodedFirebase.name || decodedFirebase.email.split('@')[0],
              email: decodedFirebase.email,
              googleId: decodedFirebase.uid,
              profilePicture: decodedFirebase.picture,
              authProvider: 'google'
            });
            await user.save();
          } else if (!user.googleId) {
            // Update existing user with Google ID if needed
            user.googleId = decodedFirebase.uid;
            user.authProvider = 'google';
            if (decodedFirebase.picture && !user.profilePicture) {
              user.profilePicture = decodedFirebase.picture;
            }
            await user.save();
          }
          
          req.user = user;
          return next();
        } catch (firebaseError) {
          console.error('Firebase token verification error:', firebaseError);
          return res.status(401).json({
            success: false,
            message: 'Invalid Firebase token'
          });
        }
      } else {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      }
      
      // Find user from decoded token
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists'
        });
      }
      
      // Set user in request object
      req.user = currentUser;
      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your token has expired'
        });
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong with authentication',
      error: error.message
    });
  }
};