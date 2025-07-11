// frontend/src/pages/AdminDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { alertApi } from '../api/alertApi';
import AlertList from '../components/AlertList';
import LiveMap from '../components/LiveMap'; // 1. Import the new map component
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';

const AdminDashboardPage = () => {
  const { logout } = useAuth();
  const socket = useSocket();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // This function fetches the list of alerts and can be reused to refresh the data
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertApi.getAlerts();
      setAlerts(response.data.alerts || []);
    } catch (err) {
      setError('Failed to fetch alerts. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch the initial list of alerts when the component loads
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Effect to listen for real-time updates via WebSockets
  useEffect(() => {
    if (!socket) return;

    const handleNewAlert = (newAlert) => {
      setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
    };

    const handleAlertUpdated = (updatedAlert) => {
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert._id === updatedAlert._id ? updatedAlert : alert
        )
      );
    };

    socket.on('new-alert', handleNewAlert);
    socket.on('alert-updated', handleAlertUpdated);

    return () => {
      socket.off('new-alert', handleNewAlert);
      socket.off('alert-updated', handleAlertUpdated);
    };
  }, [socket]);

  // Renders the list portion of the dashboard
  const renderAlertList = () => {
    if (loading && alerts.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400">Loading alerts...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }
    if (alerts.length === 0) {
      return <p className="text-center text-gray-500 dark:text-gray-400">No active alerts at the moment.</p>;
    }
    return <AlertList alerts={alerts} onAlertUpdated={fetchAlerts} />;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="p-4 bg-white shadow-md dark:bg-gray-800">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out rounded-md bg-brand-primary hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </header>

      {/* 2. Update the main content area to a multi-section layout */}
      <main className="container p-4 mx-auto mt-8 space-y-8 sm:p-6">
        {/* Section for the Live Map */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Live Alert Map
          </h2>
          {/* 3. Render the LiveMap component, passing the alerts data to it */}
          <LiveMap alerts={alerts} />
        </div>

        {/* Section for the Alert List */}
        <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Live Emergency Alerts
          </h2>
          {renderAlertList()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
