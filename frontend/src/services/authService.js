import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003'; // Change to your chatbot backend URL
// const API_BASE_URL = 'http://localhost:3003'; 

const api = axios.create({
  baseURL: API_BASE_URL
});

// Login function - simple version
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return {
      token: response.data.token // Changed from accessToken to token
    };
  } catch (error) {
    if (error.response?.data?.error) {
      throw { message: error.response.data.error };
    }
    throw { message: 'Login failed. Please try again.' };
  }
};

// Signup function - simple version
export const signup = async (userData) => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data.message || 'Signup failed',
        errors: error.response.data.errors || {}
      };
    }
    throw { message: error.message || 'An error occurred' };
  }
};

// Logout function - just clear local storage
export const logout = () => {
  localStorage.removeItem('token');
  window.dispatchEvent(new CustomEvent('auth:logout'));
  return Promise.resolve({ message: 'Logged out successfully' });
};

// Helper function to get token for authenticated requests
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { api };