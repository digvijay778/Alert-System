import apiClient from './axios';

/**
 * Logs a user in by sending their credentials to the backend.
 * @param {object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<object>} The response data from the server, typically including a JWT.
 */
const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

/**
 * Registers a new user by sending their details to the backend.
 * This is now active and matches the backend controller.
 * @param {object} userData - The user's registration data.
 * @param {string} userData.email - The user's email.
 * @param {string} userData.password - The user's password.
 * @param {string} userData.role - The user's role (e.g., 'admin' or 'user').
 * @returns {Promise<object>} The response data from the server, typically including a JWT.
 */
const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// You can add other auth-related functions here later, like:
/*
const getProfile = () => {
    return apiClient.get('/auth/profile');
}
*/

// The authApi object now exports both login and register functions.
export const authApi = {
  login,
  register,
  // getProfile,
};
