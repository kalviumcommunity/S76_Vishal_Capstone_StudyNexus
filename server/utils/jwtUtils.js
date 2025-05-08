const jwt = require('jsonwebtoken');

// Generate token
exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Verify token
exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};