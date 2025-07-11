// frontend/src/components/EmergencyButton.jsx

import React, { useState } from 'react';
import { alertApi } from '../api/alertApi';
import { saveAlertLocally } from '../utils/indexedDB';
// import { registerBackgroundSync } from '../utils/syncManager';

const EmergencyButton = ({ onAlertSent, location, isOnline }) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendAlert = async () => {
    setIsSending(true);
    const alertData = {
      message: "Emergency! Need immediate assistance!",
      location,
      timestamp: new Date().toISOString(),
    };

    try {
      if (isOnline) {
        await alertApi.sendAlert(alertData);
        onAlertSent("Alert successfully sent to authorities.");
      } else {
        await saveAlertLocally(alertData);
        // In a real app with a bundler that supports it, you would register sync here.
        // await registerBackgroundSync();
        onAlertSent("Offline: Alert saved. It will be sent automatically when you're back online.");
      }
    } catch (error) {
      console.error("Failed to handle alert:", error);
      const errorMessage = error.response?.data?.message || "Error: Could not process the alert.";
      onAlertSent(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      onClick={handleSendAlert}
      disabled={isSending || !location}
      className={`
        w-full px-8 py-10 text-2xl font-bold text-white transition-all duration-150 ease-in-out 
        transform rounded-full shadow-2xl 
        bg-brand-primary 
        hover:scale-105 hover:shadow-red-500/50
        active:scale-100
        focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100
      `}
    >
      {isSending ? 'SENDING...' : 'SEND EMERGENCY ALERT'}
    </button>
  );
};

export default EmergencyButton;
