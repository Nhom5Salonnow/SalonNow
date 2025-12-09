import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/api';
import * as asyncStorage from '@/utils/asyncStorage';

// Mock dependencies
jest.mock('@/api', () => ({
  authService: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/utils/asyncStorage', () => ({
  getData: jest.fn(),
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
  },
}));

describe('useAuth Hook', () => {
  const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
  const mockToken = 'mock-jwt-token';
  const mockAuthResponse = { user: mockUser, token: mockToken };

  beforeEach(() => {
    jest.clearAllMocks();
    (asyncStorage.getData as jest.Mock).mockResolvedValue(null);
  });

  describe('Initial State', () => {
    it('should have null user initially', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toBeNull();
    });

    it('should have isAuthenticated false initially', async () => {
      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should have isLoading true initially then false', async () => {
      const { result } = renderHook(() => useAuth());

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // After check completes
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Check Auth Status', () => {
    it('should check auth status on mount', async () => {
      renderHook(() => useAuth());

      await waitFor(() => {
        expect(asyncStorage.getData).toHaveBeenCalledWith('userData');
        expect(asyncStorage.getData).toHaveBeenCalledWith('authToken');
      });
    });

    it('should set user and isAuthenticated when data exists', async () => {
      (asyncStorage.getData as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockUser)) // userData
        .mockResolvedValueOnce(mockToken); // authToken

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should not authenticate when token is missing', async () => {
      (asyncStorage.getData as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockUser)) // userData
        .mockResolvedValueOnce(null); // no authToken

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should not authenticate when user data is missing', async () => {
      (asyncStorage.getData as jest.Mock)
        .mockResolvedValueOnce(null) // no userData
        .mockResolvedValueOnce(mockToken); // authToken

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Login', () => {
    const loginInput = { email: 'john@example.com', password: 'password123' };

    it('should call authService.login with input', async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(authService.login).toHaveBeenCalledWith(loginInput);
    });

    it('should update user state on successful login', async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should set isAuthenticated to true on successful login', async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.login(loginInput);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should return auth response on successful login', async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      let response;
      await act(async () => {
        response = await result.current.login(loginInput);
      });

      expect(response).toEqual(mockAuthResponse);
    });

    it('should throw error on failed login', async () => {
      (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(
        act(async () => {
          await result.current.login(loginInput);
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('Signup', () => {
    const signupInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should call authService.signup with input', async () => {
      (authService.signup as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signup(signupInput);
      });

      expect(authService.signup).toHaveBeenCalledWith(signupInput);
    });

    it('should update user state on successful signup', async () => {
      (authService.signup as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signup(signupInput);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should set isAuthenticated to true on successful signup', async () => {
      (authService.signup as jest.Mock).mockResolvedValueOnce(mockAuthResponse);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.signup(signupInput);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Logout', () => {
    it('should call authService.logout', async () => {
      (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
    });

    it('should set user to null on logout', async () => {
      // First set up authenticated state
      (asyncStorage.getData as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockUser))
        .mockResolvedValueOnce(mockToken);
      (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
    });

    it('should set isAuthenticated to false on logout', async () => {
      (asyncStorage.getData as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockUser))
        .mockResolvedValueOnce(mockToken);
      (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
    });
  });
});
