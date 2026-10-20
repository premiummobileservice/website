import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { crmApi } from '../api/crmApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('pmr_access_token');
      if (token) {
        try {
          const userData = await crmApi.getMe();
          setUser(userData);
        } catch {
          localStorage.removeItem('pmr_access_token');
          localStorage.removeItem('pmr_refresh_token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    const data = await crmApi.login(credentials);
    localStorage.setItem('pmr_access_token', data.access);
    localStorage.setItem('pmr_refresh_token', data.refresh);
    if (data.user) {
      setUser(data.user);
    } else {
      const userData = await crmApi.getMe();
      setUser(userData);
    }
  };

  const logout = async () => {
    await crmApi.logout();
    setUser(null);
  };

  const hasRole = (roles: Role[]) => {
    if (!user) return false;
    if (user.role === 'admin') return true; // admin can access everything
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
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
