// frontend/src/components/AlertList.jsx

import React from 'react';
import { alertApi } from '../api/alertApi'; // Make sure to import your API service

// This is the individual row item in the list
const AlertListItem = ({ alert, onAlertUpdated }) => {
  const alertStatusStyles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  // This function handles the button click
  const handleResolveClick = async () => {
    if (window.confirm('Are you sure you want to mark this alert as resolved?')) {
      try {
        // Call the API to update the alert's status
        await alertApi.updateAlert(alert._id, { status: 'resolved' });
        // Call the function passed from the parent to refresh the list
        onAlertUpdated();
      } catch (error) {
        console.error("Failed to update alert status:", error);
        alert("Could not update the alert. Please check your permissions.");
      }
    }
  };

  return (
    <tr className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
      <td className="px-6 py-4">{new Date(alert.timestamp).toLocaleString()}</td>
      <td className="px-6 py-4">{alert.userId || 'N/A'}</td>
      <td className="px-6 py-4">{alert.message}</td>
      <td className="px-6 py-4">{`${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${alertStatusStyles[alert.status] || 'bg-gray-200'}`}>
          {alert.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={handleResolveClick} // Attach the click handler
          className="font-medium text-blue-600 hover:underline dark:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
          disabled={alert.status === 'resolved'}
        >
          {alert.status === 'resolved' ? 'Resolved' : 'Mark as Resolved'}
        </button>
      </td>
    </tr>
  );
};

// This is the main list component that renders the table
const AlertList = ({ alerts, onAlertUpdated }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Timestamp</th>
            <th scope="col" className="px-6 py-3">User ID</th>
            <th scope="col" className="px-6 py-3">Message</th>
            <th scope="col" className="px-6 py-3">Location</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <AlertListItem 
              key={alert._id} 
              alert={alert} 
              onAlertUpdated={onAlertUpdated} // Pass the refresh function down to each item
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertList;
