import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState('guest'); // 'guest', 'user', 'admin'

  const checkAuthStatus = useCallback(async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
      setIsAuthenticated(true);
      setRole(userData.role || 'user');
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setRole('guest');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await checkAuthStatus();
      } else {
        setRole('guest');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    const { token, ...userFields } = userData;
    localStorage.setItem('token', token);
    setUser(userFields);
    setIsAuthenticated(true);
    setRole(userFields.role || 'user');
    return userFields;
  };

  const register = async (userDataInput) => {
    const registerResponse = await authService.register(userDataInput);
    const { token, ...userFields } = registerResponse;
    localStorage.setItem('token', token);
    setUser(userFields);
    setIsAuthenticated(true);
    setRole(userFields.role || 'user');
    return userFields;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setRole('guest');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};