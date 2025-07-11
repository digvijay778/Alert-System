// frontend/src/pages/HomePage.jsx

import React, { useState } from 'react';
import EmergencyButton from '../components/EmergencyButton';
import AdminAuth from '../components/AdminAuth'; // Import the new admin component
import useGeoLocation from '../hooks/useGeoLocation';
import useOnlineStatus from '../hooks/useOnlineStatus';

const HomePage = () => {
  // State to control which view is shown: public or admin
  const [showAdminPortal, setShowAdminPortal] = useState(false);

  // Existing state for the public view
  const isOnline = useOnlineStatus();
  const { location, error: geoError, loading: geoLoading } = useGeoLocation();
  const [alertStatus, setAlertStatus] = useState('');

  const handleAlertSent = (message) => {
    setAlertStatus(message);
    setTimeout(() => setAlertStatus(''), 5000);
  };

  const renderLocationStatus = () => {
    if (geoLoading) return 'Acquiring location...';
    if (geoError) return <span className="text-yellow-500">{geoError}</span>;
    if (location) return `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`;
    return 'Location not available.';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          {/* The header text changes based on the current view */}
          {showAdminPortal ? 'Admin Portal' : 'Emergency Alert System'}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {/* The description also changes based on the current view */}
          {showAdminPortal ? 'Please log in or register to continue.' : 'Press the button below in case of an emergency.'}
        </p>
      </header>

      <main className="w-full max-w-md my-8">
        {/* --- This is the core conditional rendering logic --- */}
        {showAdminPortal ? (
          // If showAdminPortal is true, render the authentication form
          <AdminAuth />
        ) : (
          // Otherwise, render the public emergency button
          <EmergencyButton
            onAlertSent={handleAlertSent}
            location={location}
            isOnline={isOnline}
          />
        )}
      </main>

      <footer className="absolute bottom-4 text-sm text-gray-500 dark:text-gray-400">
        {/* Conditionally render the location status only for the public view */}
        {!showAdminPortal && (
          <div className="flex flex-col mb-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
            <p>Network: <span className={isOnline ? 'font-semibold text-green-500' : 'font-semibold text-yellow-500'}>{isOnline ? 'Online' : 'Offline'}</span></p>
            <p>Location: <span className="font-semibold">{renderLocationStatus()}</span></p>
          </div>
        )}
        
        {/* A single button to toggle between the public and admin views */}
        <button 
          onClick={() => setShowAdminPortal(!showAdminPortal)}
          className="px-4 py-2 font-medium transition rounded-md text-brand-secondary hover:text-blue-500 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showAdminPortal ? '← Back to Emergency Page' : 'Admin Portal'}
        </button>

        {/* Display alert status messages below everything */}
        {alertStatus && (
          <div className="p-3 mt-4 font-medium text-green-800 bg-green-100 border border-green-200 rounded-md dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            {alertStatus}
          </div>
        )}
      </footer>
    </div>
  );
};

export default HomePage;
