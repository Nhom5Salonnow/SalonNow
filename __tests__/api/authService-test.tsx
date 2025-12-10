import { authService } from '@/api/authService';
import * as asyncStorage from '@/utils/asyncStorage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock asyncStorage utilities
jest.mock('@/utils/asyncStorage', () => ({
  storeData: jest.fn().mockResolvedValue(undefined),
  removeData: jest.fn().mockResolvedValue(undefined),
  getData: jest.fn(),
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
  },
}));

// Mock constants with MOCK_USERS
jest.mock('@/constants', () => ({
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
  },
  MOCK_USERS: [
    {
      id: '1',
      email: 'doejohn@example.com',
      password: '123456',
      name: 'Doe John',
      phone: '+732 8888 111',
      avatar: 'https://example.com/avatar1.jpg',
    },
    {
      id: '2',
      email: 'test@test.com',
      password: 'test',
      name: 'Test User',
      phone: '+732 1111 333',
      avatar: 'https://example.com/avatar2.jpg',
    },
  ],
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginPromise = authService.login({
        email: 'doejohn@example.com',
        password: '123456',
      });

      // Fast-forward timers to skip delay
      jest.advanceTimersByTime(500);

      const result = await loginPromise;

      expect(result.user.email).toBe('doejohn@example.com');
      expect(result.user.name).toBe('Doe John');
      expect(result.token).toBeDefined();
    });

    it('should store auth token on successful login', async () => {
      const loginPromise = authService.login({
        email: 'doejohn@example.com',
        password: '123456',
      });

      jest.advanceTimersByTime(500);
      await loginPromise;

      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        'authToken',
        expect.any(String)
      );
    });

    it('should store user data on successful login', async () => {
      const loginPromise = authService.login({
        email: 'doejohn@example.com',
        password: '123456',
      });

      jest.advanceTimersByTime(500);
      await loginPromise;

      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        'userData',
        expect.stringContaining('doejohn@example.com')
      );
    });

    it('should throw error with invalid email', async () => {
      const loginPromise = authService.login({
        email: 'wrong@example.com',
        password: '123456',
      });

      jest.advanceTimersByTime(500);

      await expect(loginPromise).rejects.toThrow('Invalid email or password');
    });

    it('should throw error with invalid password', async () => {
      const loginPromise = authService.login({
        email: 'doejohn@example.com',
        password: 'wrongpassword',
      });

      jest.advanceTimersByTime(500);

      await expect(loginPromise).rejects.toThrow('Invalid email or password');
    });

    it('should be case insensitive for email', async () => {
      const loginPromise = authService.login({
        email: 'DOEJOHN@EXAMPLE.COM',
        password: '123456',
      });

      jest.advanceTimersByTime(500);
      const result = await loginPromise;

      expect(result.user.email).toBe('doejohn@example.com');
    });

    it('should not store data on failed login', async () => {
      const loginPromise = authService.login({
        email: 'wrong@example.com',
        password: 'wrong',
      });

      jest.advanceTimersByTime(500);

      try {
        await loginPromise;
      } catch (e) {
        // Expected error
      }

      expect(asyncStorage.storeData).not.toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should signup successfully with new email', async () => {
      const signupPromise = authService.signup({
        email: 'newuser@example.com',
        password: 'newpassword',
        name: 'New User',
        phone: '+123456789',
      });

      jest.advanceTimersByTime(500);
      const result = await signupPromise;

      expect(result.user.email).toBe('newuser@example.com');
      expect(result.user.name).toBe('New User');
      expect(result.token).toBeDefined();
    });

    it('should store auth token on successful signup', async () => {
      const signupPromise = authService.signup({
        email: 'newuser2@example.com',
        password: 'password',
        name: 'New User 2',
      });

      jest.advanceTimersByTime(500);
      await signupPromise;

      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        'authToken',
        expect.any(String)
      );
    });

    it('should throw error if email already exists', async () => {
      const signupPromise = authService.signup({
        email: 'doejohn@example.com',
        password: 'password',
        name: 'Duplicate User',
      });

      jest.advanceTimersByTime(500);

      await expect(signupPromise).rejects.toThrow('Email already registered');
    });
  });

  describe('logout', () => {
    it('should remove auth token on logout', async () => {
      const logoutPromise = authService.logout();

      jest.advanceTimersByTime(300);
      await logoutPromise;

      expect(asyncStorage.removeData).toHaveBeenCalledWith('authToken');
    });

    it('should remove user data on logout', async () => {
      const logoutPromise = authService.logout();

      jest.advanceTimersByTime(300);
      await logoutPromise;

      expect(asyncStorage.removeData).toHaveBeenCalledWith('userData');
    });

    it('should not throw on logout', async () => {
      const logoutPromise = authService.logout();

      jest.advanceTimersByTime(300);

      await expect(logoutPromise).resolves.not.toThrow();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', async () => {
      (asyncStorage.getData as jest.Mock).mockResolvedValueOnce('mock_token');

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when token does not exist', async () => {
      (asyncStorage.getData as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data when available', async () => {
      const userData = { id: '1', name: 'Test User', email: 'test@test.com' };
      (asyncStorage.getData as jest.Mock).mockResolvedValueOnce(JSON.stringify(userData));

      const result = await authService.getCurrentUser();

      expect(result).toEqual(userData);
    });

    it('should return null when no user data', async () => {
      (asyncStorage.getData as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
