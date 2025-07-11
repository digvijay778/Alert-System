// backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes by verifying JWT
exports.protect = async (req, res, next) => {
  let token;

  // Check if the token is sent in the 'Authorization' header and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID from the token payload and attach it to the request object
      // We exclude the password from being attached to the request object for security
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Proceed to the next middleware or controller
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Middleware to authorize based on user role
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};
