import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  updateUser: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, userData?: any) => {
    // ✅ FIX: Clear previous account's expenses when a new user logs in
    localStorage.removeItem('lumeray_expenses');
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      const mockUser = { name: "LUMERAY User", email: "user@lumeray.com" };
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
    setIsAuthenticated(true);
  };

  const updateUser = (userData: any) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // ✅ FIX: Clear cached expenses on logout so next account
    // never sees previous account's expenses
    localStorage.removeItem('lumeray_expenses');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
