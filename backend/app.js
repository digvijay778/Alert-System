// backend/app.js

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Import route files
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Import the centralized error handler
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();

// --- Security & Performance Middleware ---

// 1. Set various secure HTTP headers
app.use(helmet());

// 2. Compress all responses to improve performance
app.use(compression());

// 3. Rate Limiter to prevent brute-force attacks and abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter); // Apply the rate limiting middleware to all API routes

// --- Core Middleware ---

// 4. Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

// 5. Body Parser Middleware to handle JSON payloads
app.use(express.json());


// --- API Routes ---

// A simple "health check" route to confirm the server is running
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// Mount the application routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/alerts', alertRoutes);


// --- Centralized Error Handling ---
// This must be the last piece of middleware loaded.
app.use(errorHandler);

module.exports = app;
