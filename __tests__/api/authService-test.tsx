import { authService } from '@/api/authService';
import * as asyncStorage from '@/utils/asyncStorage';

// Mock dependencies
jest.mock('@/api/api', () => ({
  api: {
    post: jest.fn(),
  },
}));

jest.mock('@/utils/asyncStorage', () => ({
  storeData: jest.fn().mockResolvedValue(undefined),
  removeData: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/constants', () => ({
  API_CONFIG: {
    ENDPOINTS: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
      LOGOUT: '/auth/logout',
    },
  },
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
  },
}));

describe('authService', () => {
  const mockApi = require('@/api/api').api;
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
  const mockToken = 'mock-jwt-token';
  const mockAuthResponse = { user: mockUser, token: mockToken };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginInput = { email: 'john@example.com', password: 'password123' };

    it('should call api.post with login endpoint', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      await authService.login(loginInput);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', loginInput);
    });

    it('should store auth token on successful login', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      await authService.login(loginInput);

      expect(asyncStorage.storeData).toHaveBeenCalledWith('authToken', mockToken);
    });

    it('should store user data on successful login', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      await authService.login(loginInput);

      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockUser)
      );
    });

    it('should return auth response on successful login', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      const result = await authService.login(loginInput);

      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error on failed login', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(authService.login(loginInput)).rejects.toThrow('Invalid credentials');
    });

    it('should not store data on failed login', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Invalid credentials'));

      try {
        await authService.login(loginInput);
      } catch (e) {
        // Expected error
      }

      expect(asyncStorage.storeData).not.toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    const signupInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should call api.post with signup endpoint', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      await authService.signup(signupInput);

      expect(mockApi.post).toHaveBeenCalledWith('/auth/signup', signupInput);
    });

    it('should store auth token on successful signup', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      await authService.signup(signupInput);

      expect(asyncStorage.storeData).toHaveBeenCalledWith('authToken', mockToken);
    });

    it('should store user data on successful signup', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      await authService.signup(signupInput);

      expect(asyncStorage.storeData).toHaveBeenCalledWith(
        'userData',
        JSON.stringify(mockUser)
      );
    });

    it('should return auth response on successful signup', async () => {
      mockApi.post.mockResolvedValueOnce(mockAuthResponse);

      const result = await authService.signup(signupInput);

      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw error on failed signup', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Email already exists'));

      await expect(authService.signup(signupInput)).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    it('should call api.post with logout endpoint', async () => {
      mockApi.post.mockResolvedValueOnce({});

      await authService.logout();

      expect(mockApi.post).toHaveBeenCalledWith('/auth/logout');
    });

    it('should remove auth token on logout', async () => {
      mockApi.post.mockResolvedValueOnce({});

      await authService.logout();

      expect(asyncStorage.removeData).toHaveBeenCalledWith('authToken');
    });

    it('should remove user data on logout', async () => {
      mockApi.post.mockResolvedValueOnce({});

      await authService.logout();

      expect(asyncStorage.removeData).toHaveBeenCalledWith('userData');
    });

    it('should still remove local data when API call fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Network error'));

      await authService.logout();

      expect(asyncStorage.removeData).toHaveBeenCalledWith('authToken');
      expect(asyncStorage.removeData).toHaveBeenCalledWith('userData');
    });

    it('should not throw when API call fails', async () => {
      mockApi.post.mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.logout()).resolves.not.toThrow();
    });
  });
});
