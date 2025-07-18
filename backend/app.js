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

// --- CORS Configuration (Must be first) ---
// Handle CORS before any other middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS Check - Origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: No origin - allowing');
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost')) {
      console.log('✅ CORS: Localhost - allowing');
      return callback(null, true);
    }
    
    // Allow any subdomain of your Vercel project
    if (origin.includes('digvijay778s-projects.vercel.app')) {
      console.log('✅ CORS: Vercel subdomain - allowing');
      return callback(null, true);
    }
    
    // Allow vercel.app domains in general (for any deployment)
    if (origin.includes('vercel.app')) {
      console.log('✅ CORS: Vercel domain - allowing');
      return callback(null, true);
    }
    
    console.log('❌ CORS: Origin blocked:', origin);
    // Block all other origins
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Explicit OPTIONS handler for all routes
app.options('*', (req, res) => {
  console.log('📋 OPTIONS request from:', req.get('Origin'));
  res.header('Access-Control-Allow-Origin', req.get('Origin'));
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Origin,Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

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

// 4. Body Parser Middleware to handle JSON payloads
app.use(express.json());


// --- API Routes ---

// A simple "health check" route to confirm the server is running
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// Test CORS route
app.get('/api/v1/test-cors', (req, res) => {
  res.status(200).json({ 
    status: 'CORS working', 
    origin: req.get('Origin'),
    timestamp: new Date().toISOString()
  });
});

// Mount the application routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/alerts', alertRoutes);


// --- Centralized Error Handling ---
// This must be the last piece of middleware loaded.
app.use(errorHandler);

module.exports = app;
