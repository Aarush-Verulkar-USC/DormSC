import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { User } from '../types';

interface AuthContextValue {
  currentUser: User | null;
  isAdmin: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const user = await api.login({ email, password });
    setCurrentUser(user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const user = await api.signup({ name, email, password }) as User;
    setCurrentUser(user);
  };

  const logout = async () => {
    await api.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        authLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
