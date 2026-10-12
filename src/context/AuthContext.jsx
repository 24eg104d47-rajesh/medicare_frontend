import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medicare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('medicare_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('medicare_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('medicare_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentialsOrEmail, maybePassword) => {
    let email, password;
    if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
      email = credentialsOrEmail.email;
      password = credentialsOrEmail.password;
    } else {
      email = credentialsOrEmail;
      password = maybePassword;
    }
    const res = await authService.login({ email, password });
    const authData = res.data;
    setToken(authData.token);
    localStorage.setItem('medicare_token', authData.token);

    const userProfile = {
      id: authData.userId,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
    };
    setUser(userProfile);
    localStorage.setItem('medicare_user', JSON.stringify(userProfile));

    // Fetch full profile in background
    try {
      const fullRes = await authService.getMe();
      setUser(fullRes.data);
      localStorage.setItem('medicare_user', JSON.stringify(fullRes.data));
    } catch (e) {
      // Ignore background refresh error
    }

    return authData;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const authData = res.data;
    setToken(authData.token);
    localStorage.setItem('medicare_token', authData.token);

    const userProfile = {
      id: authData.userId,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role,
    };
    setUser(userProfile);
    localStorage.setItem('medicare_user', JSON.stringify(userProfile));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');
  };

  const refreshProfile = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.data);
      localStorage.setItem('medicare_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Profile refresh failed:', err);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isCustomer = user?.role === 'CUSTOMER';
  const isPharmacyAdmin = user?.role === 'PHARMACY_ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isCustomer,
        isPharmacyAdmin,
        isAdmin,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
