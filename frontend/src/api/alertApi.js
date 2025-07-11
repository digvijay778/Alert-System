// frontend/src/api/alertApi.js

import apiClient from './axios';

/**
 * Sends a new emergency alert to the backend server.
 * @param {object} alertData - The data for the new alert.
 * @returns {Promise} An Axios promise for the POST request.
 */
const sendAlert = (alertData) => {
  return apiClient.post('/alerts', alertData);
};

/**
 * Fetches all emergency alerts from the backend server.
 * This is the function that was missing from your export.
 * @returns {Promise} An Axios promise for the GET request.
 */
const getAlerts = () => {
  return apiClient.get('/alerts');
};

// You can add other alert-related API functions here later, for example:
/*
const updateAlert = (id, updateData) => {
  return apiClient.put(`/alerts/${id}`, updateData);
};
*/
const updateAlert = (id, updateData) => {
  return apiClient.put(`/alerts/${id}`, updateData);
};

// The export object makes all defined functions available to other parts of your app.
// The key is to ensure `getAlerts` is included in this exported object.
export const alertApi = {
  sendAlert,
  getAlerts,
  updateAlert,
};
