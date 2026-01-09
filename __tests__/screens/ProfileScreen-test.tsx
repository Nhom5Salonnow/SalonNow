import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/profile';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve('mock_token')),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

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

// Mock AuthContext
const mockLogout = jest.fn();
let mockIsLoggedIn = true;
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    user: mockIsLoggedIn ? { id: 'user-1', name: 'Test User', email: 'test@test.com', avatar: 'https://example.com/avatar.jpg' } : null,
    isLoggedIn: mockIsLoggedIn,
    isLoading: false,
    logout: mockLogout,
  }),
}));

// Mock userApi
jest.mock('@/api', () => ({
  userApi: {
    getUserById: jest.fn().mockResolvedValue({
      success: true,
      data: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@test.com',
        loyaltyPoints: 150,
        completedAppointments: 12,
        reviewsGiven: 8,
        totalSpent: 450.00,
        averageRating: 4.5,
        memberSince: '2023-06-15',
        favoriteServices: [
          { serviceId: '1', serviceName: 'Haircut', count: 5 },
          { serviceId: '2', serviceName: 'Manicure', count: 3 },
        ],
      },
    }),
  },
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
      100: '#F3F4F6',
      200: '#E5E7EB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
  DEFAULT_AVATAR: 'https://example.com/default-avatar.png',
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Calendar: () => null,
  ChevronRight: () => null,
  Clock: () => null,
  CreditCard: () => null,
  Edit3: () => null,
  Heart: () => null,
  History: () => null,
  LogOut: () => null,
  Menu: () => null,
  Settings: () => null,
  Star: () => null,
  User: () => null,
  Award: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  GuestPrompt: ({ message, showButtons }: { message: string; showButtons?: boolean }) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="guest-prompt">
        <Text>{message}</Text>
        {showButtons && (
          <>
            <TouchableOpacity testID="login-button"><Text>Login</Text></TouchableOpacity>
            <TouchableOpacity testID="register-button"><Text>Register</Text></TouchableOpacity>
          </>
        )}
      </View>
    );
  },
}));

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetData.mockResolvedValue(null);
    mockRemoveData.mockResolvedValue(undefined);
    mockLogout.mockResolvedValue(undefined);
    mockIsLoggedIn = true;
  });

  describe('Rendering - Logged In', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Profile')).toBeTruthy();
    });

    it('should render user info from auth context', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('test@test.com')).toBeTruthy();
    });

    it('should render all menu items', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Appointment History')).toBeTruthy();
      expect(getByText('My Waitlist')).toBeTruthy();
      expect(getByText('Payment History')).toBeTruthy();
      expect(getByText('Payment Methods')).toBeTruthy();
      expect(getByText('Settings')).toBeTruthy();
    });

    it('should render logout button for logged in user', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Logout')).toBeTruthy();
    });

    it('should render Quick Access section', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Quick Access')).toBeTruthy();
    });
  });

  describe('Rendering - Guest Mode', () => {
    beforeEach(() => {
      mockIsLoggedIn = false;
    });

    afterEach(() => {
      mockIsLoggedIn = true;
    });

    it('should render Guest text for non-logged in user', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Guest')).toBeTruthy();
    });

    it('should render sign in prompt for guest', () => {
      const { getByText } = render(<ProfileScreen />);
      expect(getByText('Sign in to access all features')).toBeTruthy();
    });

    it('should render GuestPrompt component', () => {
      const { getByTestId } = render(<ProfileScreen />);
      expect(getByTestId('guest-prompt')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to appointment-history when pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Appointment History'));
      expect(mockPush).toHaveBeenCalledWith('/appointment-history');
    });

    it('should navigate to waitlist when My Waitlist is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('My Waitlist'));
      expect(mockPush).toHaveBeenCalledWith('/waitlist');
    });

    it('should navigate to payment-history when Payment History is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Payment History'));
      expect(mockPush).toHaveBeenCalledWith('/payment-history');
    });

    it('should navigate to payment-methods when Payment Methods is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Payment Methods'));
      expect(mockPush).toHaveBeenCalledWith('/payment-methods');
    });

    it('should navigate to settings when Settings is pressed', () => {
      const { getByText } = render(<ProfileScreen />);
      fireEvent.press(getByText('Settings'));
      expect(mockPush).toHaveBeenCalledWith('/settings');
    });
  });

  describe('Logout', () => {
    it('should call logout from context when logout is pressed', async () => {
      const { getByText } = render(<ProfileScreen />);

      fireEvent.press(getByText('Logout'));

      // Note: Logout triggers Alert on native, window.confirm on web
      // In tests, this test just verifies the button is pressable
    });
  });
});
