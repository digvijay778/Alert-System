const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Simple CORS for localhost
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Simple health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple server is running' });
});

// Simple test endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Simple alert endpoint
app.post('/api/v1/alerts', (req, res) => {
  console.log('Alert received:', req.body);
  res.json({ 
    success: true, 
    message: 'Alert received', 
    data: req.body 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
