// backend/routes/alertRoutes.js

const express = require('express');
const router = express.Router();

// Import controller functions
const { createAlert, getAlerts,updateAlertStatus  } = require('../controllers/alertController');

// Import authentication middleware
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// Define the routes
// A POST request to /api/v1/alerts will call the createAlert function.
// Temporarily removing protection for testing
router.route('/').post(createAlert);

// A GET request to /api/v1/alerts will call the getAlerts function.
// It is protected and restricted to admins only.
router.route('/').get(protect, isAdmin, getAlerts);
router.route('/:id').put(protect, isAdmin, updateAlertStatus);

module.exports = router;
