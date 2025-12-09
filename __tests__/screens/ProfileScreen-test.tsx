import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

// Mock expo-router
const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
    push: (path: string) => mockPush(path),
    replace: (path: string) => mockReplace(path),
  },
}));

// Mock asyncStorage
const mockGetData = jest.fn();
const mockRemoveData = jest.fn();
jest.mock('@/utils/asyncStorage', () => ({
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
  },
  getData: (key: string) => mockGetData(key),
  removeData: (key: string) => mockRemoveData(key),
}));

// Mock responsive utilities
jest.mock('@/utils/responsive', () => ({
  wp: (value: number) => value * 4,
  hp: (value: number) => value * 8,
  rf: (value: number) => value,
}));

// Mock constants
jest.mock('@/constants', () => ({
  Colors: {
    primary: '#FE697D',
    salon: {
      pinkLight: '#FFCCD3',
      pinkBg: '#FFF5F5',
      dark: '#1F2937',
    },
    gray: {
      400: '#9CA3AF',
      500: '#6B7280',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Calendar: () => null,
  ChevronRight: () => null,
  CreditCard: () => null,
  LogOut: () => null,
  Menu: () => null,
  Settings: () => null,
  User: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetData.mockResolvedValue(null);
    mockRemoveData.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<ProfileScreen />);
      // Should render default name when no user data
      expect(getByText('Doe John')).toBeTruthy();
    });

    it('should render default user info when no data in storage', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Doe John')).toBeTruthy();
      expect(getByText('doejohn@example.com')).toBeTruthy();
    });

    it('should render user data from storage', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', phone: '1234567890' };
      mockGetData.mockResolvedValueOnce(JSON.stringify(userData));

      const { getByText } = render(<ProfileScreen />);

      await waitFor(() => {
        expect(getByText('Test User')).toBeTruthy();
        expect(getByText('test@example.com')).toBeTruthy();
      });
    });

    it('should render all menu items', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Account Info')).toBeTruthy();
      expect(getByText('My Appointments')).toBeTruthy();
      expect(getByText('Payment')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });

    it('should render logout button', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Logout')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to settings when Account Info is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Account Info'));
      expect(mockPush).toHaveBeenCalledWith('/settings');
    });

    it('should navigate to my-appointments when My Appointments is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('My Appointments'));
      expect(mockPush).toHaveBeenCalledWith('/my-appointments');
    });

    it('should navigate to payment when Payment is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Payment'));
      expect(mockPush).toHaveBeenCalledWith('/payment');
    });

    it('should navigate to settings when Settings is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Settings'));
      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });

  describe('Logout', () => {
    it('should call removeData for auth token and user data on logout', async () => {
      const { getByText } = render(<ProfileScreen />);

      fireEvent.press(getByText('Logout'));

      await waitFor(() => {
        expect(mockRemoveData).toHaveBeenCalledWith('authToken');
        expect(mockRemoveData).toHaveBeenCalledWith('userData');
      });
    });

    it('should navigate to login screen after logout', async () => {
      const { getByText } = render(<ProfileScreen />);

      fireEvent.press(getByText('Logout'));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/auth/login');
      });
    });
  });

  describe('Data Loading', () => {
    it('should call getData on mount', async () => {
      render(<ProfileScreen />);

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledWith('userData');
      });
    });

    it('should handle error when loading user data', async () => {
      mockGetData.mockRejectedValueOnce(new Error('Load error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<ProfileScreen />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });
});
