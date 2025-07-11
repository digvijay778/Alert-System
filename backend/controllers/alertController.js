// backend/controllers/alertController.js

const Alert = require('../models/Alert');
const { sendEmailNotification, sendSmsNotification } = require('../utils/notificationSender');

/**
 * @desc    Create a new emergency alert
 * @route   POST /api/v1/alerts
 * @access  Public
 */
exports.createAlert = async (req, res, next) => {
  try {
    // This is the fix for the 401 error.
    // Since public users are not logged in, `req.user` will be undefined.
    // We will use a placeholder ID for anonymous alerts.
    // NOTE: In a production system, you might create a single "Guest" user in your
    // database and use its ID here. For now, this placeholder is sufficient.
    const guestUserId = '000000000000000000000000'; // A generic, valid MongoDB ObjectId placeholder

    const newAlertData = {
      message: req.body.message,
      location: req.body.location,
      // Use the real user's ID if they happen to be logged in (e.g., an admin testing),
      // otherwise, use the guest ID.
      userId: req.user ? req.user.id : guestUserId,
    };

    // Create the alert in the database
    const alert = await Alert.create(newAlertData);

    // Get the Socket.IO instance to send a real-time update
    const io = req.app.get('io');
    io.to('admin-room').emit('new-alert', alert);

    // Immediately send a success response to the client
    res.status(201).json({
      success: true,
      data: alert
    });

    // Asynchronously trigger notifications after the response has been sent
    sendEmailNotification(alert);
    sendSmsNotification(alert);

  } catch (error) {
    // Pass any database or other errors to our centralized error handler
    next(error);
  }
};

/**
 * @desc    Get all emergency alerts
 * @route   GET /api/v1/alerts
 * @access  Private (Admin only)
 */
exports.getAlerts = async (req, res, next) => {
  try {
    // Fetch all alerts from the database, sorted with the newest first
    const alerts = await Alert.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts: alerts
    });
  } catch (error) {
    // Pass any errors to our centralized error handler
    next(error);
  }
};
exports.updateAlertStatus = async (req, res, next) => {
  try {
    // Find the alert by the ID in the URL parameters and update it
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' }, // The update to apply
      {
        new: true, // Return the modified document instead of the original
        runValidators: true,
      }
    );

    // If no alert was found with that ID
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // --- Optional but Recommended: Notify Admins of the Update ---
    // You can emit another socket event to let all other admins know the status changed.
    const io = req.app.get('io');
    io.to('admin-room').emit('alert-updated', alert);


    res.status(200).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};