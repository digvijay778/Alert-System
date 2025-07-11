// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();

// Import the controller functions that will handle the request logic
const { registerUser, loginUser } = require('../controllers/authController');

// Define the route for user registration
// When a POST request is made to /api/v1/auth/register, the registerUser function will be executed.
router.post('/register', registerUser);

// Define the route for user login
// When a POST request is made to /api/v1/auth/login, the loginUser function will be executed.
router.post('/login', loginUser);

module.exports = router;
