import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('scholartrack_token');
    const savedUser = localStorage.getItem('scholartrack_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('scholartrack_token');
        localStorage.removeItem('scholartrack_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await api.login(credentials);
    const authUser: User = {
      id: data.userId,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      profileId: data.profileId,
    };
    setUser(authUser);
    setToken(data.token);
    localStorage.setItem('scholartrack_token', data.token);
    localStorage.setItem('scholartrack_user', JSON.stringify(authUser));
  };

  const register = async (payload: any) => {
    const data = await api.register(payload);
    const authUser: User = {
      id: data.userId,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      profileId: data.profileId,
    };
    setUser(authUser);
    setToken(data.token);
    localStorage.setItem('scholartrack_token', data.token);
    localStorage.setItem('scholartrack_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scholartrack_token');
    localStorage.removeItem('scholartrack_user');
    window.location.href = '/login';
  };

  const refreshUser = () => {
    const savedUser = localStorage.getItem('scholartrack_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isStudent: user?.role === 'STUDENT',
        isAdmin: user?.role === 'ADMIN',
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
