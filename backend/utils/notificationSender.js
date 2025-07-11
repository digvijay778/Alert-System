// backend/utils/notificationSender.js

const nodemailer = require('nodemailer');
const twilio = require('twilio');

// --- Email Configuration (Nodemailer) ---
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // --- FIX FOR EMAIL ERROR ---
  // This tells Nodemailer to accept self-signed certificates from services like Ethereal.
  // IMPORTANT: Only use this for development/testing. Do not use in production with real email providers.
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Sends an email notification.
 */
const sendEmailNotification = async (alert) => {
  try {
    const message = {
      from: '"Emergency Alert System" <noreply@emergency.com>',
      to: 'digvijayrana369@gmail.com', // Replace with the admin's real email
      subject: 'New Emergency Alert Received!',
      html: `
        <h1>New Emergency Alert</h1>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Location:</strong> <a href="https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}">View on Map</a></p>
        <p><strong>Timestamp:</strong> ${new Date(alert.timestamp).toLocaleString()}</p>
      `,
    };

    const info = await transporter.sendMail(message);
    console.log('Email sent successfully. Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

// --- SMS Configuration (Twilio) ---
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Sends an SMS notification.
 */
const sendSmsNotification = async (alert) => {
  try {
    // --- FIX FOR SMS ERROR ---
    // Replace the placeholder with a real, E.164 formatted phone number
    // that you have verified in your Twilio account.
    const adminPhoneNumber = '+919813824250'; // e.g., your actual mobile number

    await twilioClient.messages.create({
      body: `Emergency Alert: ${alert.message}. Location: ${alert.location.latitude},${alert.location.longitude}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: adminPhoneNumber,
    });
    console.log('SMS notification sent successfully.');
  } catch (error) {
    console.error('Error sending SMS notification:', error);
  }
};

module.exports = { sendEmailNotification, sendSmsNotification };
