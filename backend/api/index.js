// backend/api/index.js - Vercel serverless entry point

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables before anything else
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = require('../app');
const connectDB = require('../config/db');

// Connect to the MongoDB database
connectDB();

// For serverless, we don't need Socket.IO in the main API
// Socket.IO requires a persistent connection which serverless doesn't support well
// We'll handle real-time features differently or use a separate service

// Export the Express app for Vercel
module.exports = app;
