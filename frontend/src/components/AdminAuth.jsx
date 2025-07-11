// frontend/src/components/AdminAuth.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/authApi';

const AdminAuth = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login({ email, password });
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.register({ email, password, role: 'admin' });
      alert('Registration successful! Please log in.');
      setIsLoginView(true); // Switch to login view after successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        {isLoginView ? 'Admin Login' : 'Admin Registration'}
      </h2>
      <form onSubmit={isLoginView ? handleLogin : handleRegister} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
          />
        </div>
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 font-semibold text-white transition rounded-md bg-brand-primary hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : (isLoginView ? 'Log In' : 'Register')}
        </button>
      </form>
      <div className="text-center">
        <button
          onClick={() => setIsLoginView(!isLoginView)}
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {isLoginView ? 'Need to register an admin account?' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
};

export default AdminAuth;
