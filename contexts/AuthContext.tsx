import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { router } from 'expo-router';
import { STORAGE_KEYS, getData, storeData, removeData } from '@/utils/asyncStorage';
import { authApi } from '@/api/authApi';
import { userApi } from '@/api/userApi';
import { setOnAuthInvalidated } from '@/api';

interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (userData: User, token?: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    try {
      const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const response = await authApi.getMe();
        if (response.success && response.data && response.data.id) {
          const apiUser = response.data;
          const fullName = apiUser.name ||
            (apiUser.firstName && apiUser.lastName
              ? `${apiUser.firstName} ${apiUser.lastName}`
              : apiUser.firstName || apiUser.lastName || '');

          const userData: User = {
            id: apiUser.id,
            name: fullName,
            email: apiUser.email,
            phone: apiUser.phone || apiUser.phoneNumber,
            avatar: apiUser.avatar || apiUser.avatarUrl,
            role: apiUser.role,
          };
          await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
          setUser(userData);
          return;
        }

        const storedUserData = await getData(STORAGE_KEYS.USER_DATA);
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
          return;
        }
      }
      setUser(null);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      try {
        const storedUserData = await getData(STORAGE_KEYS.USER_DATA);
        if (storedUserData) {
          setUser(JSON.parse(storedUserData));
          return;
        }
      } catch {
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    const handleSessionInvalidated = () => {
      setUser(null);
    };

    setOnAuthInvalidated(handleSessionInvalidated);

    return () => {
      setOnAuthInvalidated(null);
    };
  }, []);

  const loginWithCredentials = useCallback(async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        const { access_token, user: apiUser } = response.data;

        if (access_token) {
          await storeData(STORAGE_KEYS.AUTH_TOKEN, access_token);
        }

        const fullName = apiUser?.name ||
          (apiUser?.firstName && apiUser?.lastName
            ? `${apiUser.firstName} ${apiUser.lastName}`
            : apiUser?.firstName || apiUser?.lastName || email.split('@')[0]);

        const userData: User = {
          id: apiUser?.id || '',
          name: fullName,
          email: apiUser?.email || email,
          phone: apiUser?.phone || apiUser?.phoneNumber,
          avatar: apiUser?.avatar || apiUser?.avatarUrl,
          role: apiUser?.role,
        };

        await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      return { success: false, message: response.message || 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, message: error.message || 'Login failed' };
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      console.log('Register request:', { email, firstName, lastName, phoneNumber: phone });

      const response = await authApi.register({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phone,
      });

      console.log('Register response:', response);

      if (response.success && response.data) {
        const { access_token, user: apiUser } = response.data;

        console.log('Register success, token:', access_token ? 'received' : 'missing', 'user:', apiUser);

        if (access_token) {
          await storeData(STORAGE_KEYS.AUTH_TOKEN, access_token);
        } else {
          console.warn('Registration succeeded but no access_token received');
        }

        const fullName = apiUser?.name ||
          (apiUser?.firstName && apiUser?.lastName
            ? `${apiUser.firstName} ${apiUser.lastName}`
            : apiUser?.firstName || apiUser?.lastName || name);

        const userData: User = {
          id: apiUser?.id || '',
          name: fullName,
          email: apiUser?.email || email,
          phone: apiUser?.phone || apiUser?.phoneNumber || phone,
          avatar: apiUser?.avatar || apiUser?.avatarUrl,
          role: apiUser?.role,
        };

        await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        setUser(userData);

        return { success: true };
      }

      return { success: false, message: response.message || 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { success: false, message: error.message || 'Registration failed' };
    }
  }, []);

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
      await authApi.logout();

      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
      setUser(null);
      router.replace('/home' as any);
    } catch (error) {
      console.error('Error logging out:', error);
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
      setUser(null);
      router.replace('/home' as any);
    }
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    if (!user) return;
    try {
      if (user.id) {
        const response = await userApi.updateUser(user.id, {
          name: userData.name,
          phone: userData.phone,
          avatar: userData.avatar,
        });

        if (response.success && response.data && response.data.id) {
          const updatedUser: User = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            avatar: response.data.avatar,
            role: response.data.role,
          };
          await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
          setUser(updatedUser);
          return;
        }
      }

      const updatedUser = { ...user, ...userData };
      await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      const updatedUser = { ...user, ...userData };
      await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await authApi.changePassword({ currentPassword, newPassword });

      if (response.success) {
        return { success: true, message: 'Password changed successfully' };
      }

      return { success: false, message: response.message || 'Failed to change password' };
    } catch (error: any) {
      console.error('Change password error:', error);
      return { success: false, message: error.message || 'Failed to change password' };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        loginWithCredentials,
        register,
        logout,
        updateUser,
        refreshAuth,
        changePassword,
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
