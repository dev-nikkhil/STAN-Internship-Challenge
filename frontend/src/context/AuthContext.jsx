import { createContext, useState, useEffect, useContext } from 'react';
import { login, logout } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = async (email, password) => {
    const { token } = await login(email, password); // Changed from accessToken to token
    setToken(token);
    localStorage.setItem('token', token); // Changed from accessToken to token
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      localStorage.removeItem('token'); // Changed from accessToken to token
      setIsLoggingOut(false);
    }
  };

  // Listen for logout events
  useEffect(() => {
    const handleAutoLogout = () => {
      setToken(null);
      localStorage.removeItem('token'); // Changed from accessToken to token
    };

    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  // Check for existing token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token'); // Changed from accessToken to token
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!token,
      isLoggingOut,
      login: handleLogin,
      logout: handleLogout,
      token // Changed from accessToken to token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};