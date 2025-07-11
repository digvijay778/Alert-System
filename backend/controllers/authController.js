// backend/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Utility function to sign a JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // Check if a user with the given email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create a new user instance
    const user = await User.create({
      email,
      password,
      role,
    });

    // Respond with a token
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Authenticate a user & get token (Login)
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate that email and password were provided
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide an email and password' });
  }

  try {
    // Find the user by email, explicitly including the password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and if the passwords match
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Respond with a token
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
