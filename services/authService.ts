import { api } from './api';
import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import { LoginInput, SignupInput, AuthResponse } from '@/types';
import { storeData, removeData } from '@/utils/asyncStorage';

export const authService = {
  // Login
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, input);

      // Store auth token and user data
      await storeData(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Signup
  async signup(input: SignupInput): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_CONFIG.ENDPOINTS.SIGNUP, input);

      // Store auth token and user data
      await storeData(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post(API_CONFIG.ENDPOINTS.LOGOUT);

      // Clear stored data
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
    }
  },
};
