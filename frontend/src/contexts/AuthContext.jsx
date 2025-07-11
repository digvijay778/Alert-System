// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  useEffect(() => {
    // Persist the token in localStorage and set it on the API client
    if (token) {
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // In a real app, you would also fetch user profile here
      // setUser({ email: 'admin@example.com' }); // Placeholder
    } else {
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user); // Assuming the API returns user data
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
