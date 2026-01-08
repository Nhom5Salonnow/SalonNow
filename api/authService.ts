/**
 * @deprecated This service is deprecated and should not be used in new code.
 * Use `authApi` from `@/api` instead which connects to the real backend.
 * This file is kept for backwards compatibility with existing tests.
 */
import { STORAGE_KEYS, MOCK_USERS } from '@/constants';
import { LoginInput, SignupInput, AuthResponse, User } from '@/types';
import { storeData, removeData, getData } from '@/utils/asyncStorage';

// Simulate network delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock token
const generateToken = () => `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const authService = {
  // Mock Login - validates against MOCK_USERS
  async login(input: LoginInput): Promise<AuthResponse> {
    await simulateDelay();

    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken();
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store auth token and user data
    await storeData(STORAGE_KEYS.AUTH_TOKEN, token);
    await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

    return { user: userData, token };
  },

  // Mock Signup - creates new user (stored locally)
  async signup(input: SignupInput): Promise<AuthResponse> {
    await simulateDelay();

    // Check if email already exists
    const existingUser = MOCK_USERS.find(
      u => u.email.toLowerCase() === input.email.toLowerCase()
    );

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const token = generateToken();
    const userData: User = {
      id: `user_${Date.now()}`,
      email: input.email,
      name: input.name,
      phone: input.phone,
      avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store auth token and user data
    await storeData(STORAGE_KEYS.AUTH_TOKEN, token);
    await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

    return { user: userData, token };
  },

  // Logout
  async logout(): Promise<void> {
    await simulateDelay(300);

    // Clear stored data
    await removeData(STORAGE_KEYS.AUTH_TOKEN);
    await removeData(STORAGE_KEYS.USER_DATA);
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  // Get current user data
  async getCurrentUser(): Promise<User | null> {
    const userData = await getData(STORAGE_KEYS.USER_DATA);
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  },
};
