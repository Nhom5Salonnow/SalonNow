import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { router } from 'expo-router';
import { STORAGE_KEYS, getData, storeData, removeData } from '@/utils/asyncStorage';

interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User, token?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const userData = await getData(STORAGE_KEYS.USER_DATA);
        if (userData) {
          setUser(JSON.parse(userData));
          return;
        }
      }
      setUser(null);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = useCallback(async (userData: User, token: string = 'mock_token_123') => {
    try {
      await storeData(STORAGE_KEYS.AUTH_TOKEN, token);
      await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
      setUser(null);
      router.replace('/home' as any);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) return;
    try {
      const updatedUser = { ...user, ...userData };
      await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
