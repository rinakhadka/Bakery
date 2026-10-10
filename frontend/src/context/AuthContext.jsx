import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USER_STORAGE_KEY = 'sweet_crumbs_user';
const TOKEN_STORAGE_KEY = 'sweet_crumbs_token';

// Sample demo user for beginner ease of testing during Phase 2
const DEMO_USER = {
  id: 'usr-101',
  name: 'Aayush Sharma',
  email: 'customer@sweetcrumbs.com',
  phone: '+977 9841234567',
  address: 'Jhamsikhel, Ward 3',
  city: 'Lalitpur',
  role: 'USER',
  createdAt: '2026-01-15'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  /**
   * Login method
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      // In Phase 2 frontend simulation, validate basic credentials
      // In Phase 5, this calls POST /api/auth/login
      if (email === 'admin@sweetcrumbs.com') {
        const adminUser = {
          id: 'admin-001',
          name: 'Bakery Admin',
          email: 'admin@sweetcrumbs.com',
          phone: '+977 9801122334',
          address: 'Bakery HQ, Lazimpat',
          city: 'Kathmandu',
          role: 'ADMIN'
        };
        setUser(adminUser);
        setToken('demo-jwt-admin-token-12345');
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(adminUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, 'demo-jwt-admin-token-12345');
        return { success: true, user: adminUser };
      }

      // Standard user login
      const loggedInUser = {
        id: 'usr-101',
        name: email.split('@')[0],
        email: email,
        phone: '+977 9841234567',
        address: 'New Baneshwor',
        city: 'Kathmandu',
        role: 'USER'
      };

      setUser(loggedInUser);
      setToken('demo-jwt-user-token-67890');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, 'demo-jwt-user-token-67890');
      return { success: true, user: loggedInUser };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register method
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = {
        id: 'usr-' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '+977 9800000000',
        address: userData.address || '',
        city: userData.city || 'Kathmandu',
        role: 'USER',
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      setToken('demo-jwt-registered-token-' + Date.now());
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, 'demo-jwt-registered-token-' + Date.now());
      return { success: true, user: newUser };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update profile
   */
  const updateProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
    return { success: true, user: updated };
  };

  /**
   * Logout
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  };

  /**
   * Quick demo login helper for college demo
   */
  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setToken('demo-jwt-user-token-67890');
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(DEMO_USER));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'demo-jwt-user-token-67890');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateProfile,
    loginAsDemo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
