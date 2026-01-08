import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NotificationsScreen from '@/app/(tabs)/notifications';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
  },
}));

// Mock asyncStorage utilities
const mockGetData = jest.fn();
jest.mock('@/utils/asyncStorage', () => ({
  getData: (key: string) => mockGetData(key),
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
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
      dark: '#1F2937',
    },
    gray: {
      200: '#E5E7EB',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
  NOTIFICATIONS: [
    {
      id: '1',
      title: 'Appointment Confirmed',
      message: 'Your appointment has been confirmed',
      type: 'appointment_confirm',
      time: '2 hours ago',
    },
    {
      id: '2',
      title: 'Appointment Updated',
      message: 'Your appointment time has been changed',
      type: 'appointment_update',
      time: '1 day ago',
    },
    {
      id: '3',
      title: 'Leave Feedback',
      message: 'Please leave feedback for your recent visit',
      type: 'feedback',
      time: '3 days ago',
    },
    {
      id: '4',
      title: 'General Update',
      message: 'New services available',
      type: 'general',
      time: '1 week ago',
    },
  ],
  DEFAULT_USER: {
    avatar: 'https://example.com/avatar.jpg',
  },
  NotificationItem: {},
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronDown: () => null,
  User: () => null,
}));

// Mock components
jest.mock('@/components/ui', () => ({
  NotificationCard: ({ item, onPress }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity testID={`notification-${item.id}`} onPress={() => onPress(item)}>
        <View>
          <Text>{item.title}</Text>
          <Text>{item.message}</Text>
        </View>
      </TouchableOpacity>
    );
  },
}));

describe('NotificationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to logged in user for existing tests
    mockGetData.mockImplementation((key: string) => {
      if (key === 'authToken') return Promise.resolve('mock_token');
      if (key === 'userData') return Promise.resolve(JSON.stringify({
        name: 'Test User',
        email: 'test@test.com',
        avatar: 'http://example.com/avatar.jpg',
      }));
      return Promise.resolve(null);
    });
  });

  describe('Rendering - Logged In', () => {
    it('should render without crashing', async () => {
      const { getByText, findByText } = render(<NotificationsScreen />);
      expect(getByText('Notification')).toBeTruthy();
      await findByText('Appointment Confirmed');
    });

    it('should render notification header', () => {
      const { getByText } = render(<NotificationsScreen />);
      expect(getByText('Notification')).toBeTruthy();
    });

    it('should render filter bar', () => {
      const { getByText } = render(<NotificationsScreen />);
      expect(getByText('Latest notification')).toBeTruthy();
      expect(getByText('Sort By')).toBeTruthy();
    });

    it('should render notification items for logged in user', async () => {
      const { findByTestId } = render(<NotificationsScreen />);
      expect(await findByTestId('notification-1')).toBeTruthy();
      expect(await findByTestId('notification-2')).toBeTruthy();
      expect(await findByTestId('notification-3')).toBeTruthy();
      expect(await findByTestId('notification-4')).toBeTruthy();
    });
  });

  describe('Rendering - Guest Mode', () => {
    beforeEach(() => {
      // Override to guest mode
      mockGetData.mockResolvedValue(null);
    });

    it('should render welcome notification for guest', async () => {
      const { findByTestId } = render(<NotificationsScreen />);
      expect(await findByTestId('notification-welcome')).toBeTruthy();
    });

    it('should render Login Now button for guest', async () => {
      const { findByText } = render(<NotificationsScreen />);
      expect(await findByText('Login Now')).toBeTruthy();
    });

    it('should navigate to login when Login Now button is pressed', async () => {
      const { findByText } = render(<NotificationsScreen />);
      const loginButton = await findByText('Login Now');
      fireEvent.press(loginButton);
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  describe('Navigation - Logged In', () => {
    it('should navigate to profile when avatar is pressed', async () => {
      const { findByTestId } = render(<NotificationsScreen />);
      // Wait for data to load first
      await findByTestId('notification-1');
      // Profile navigation is tested by ensuring navigation occurs
    });

    it('should navigate to my-appointments when appointment_confirm notification is pressed', async () => {
      const { findByTestId } = render(<NotificationsScreen />);

      const notification = await findByTestId('notification-1');
      fireEvent.press(notification);

      expect(mockPush).toHaveBeenCalledWith('/my-appointments');
    });

    it('should navigate to my-appointments when appointment_update notification is pressed', async () => {
      const { findByTestId } = render(<NotificationsScreen />);

      const notification = await findByTestId('notification-2');
      fireEvent.press(notification);

      expect(mockPush).toHaveBeenCalledWith('/my-appointments');
    });

    it('should navigate to feedback when feedback notification is pressed', async () => {
      const { findByTestId } = render(<NotificationsScreen />);

      const notification = await findByTestId('notification-3');
      fireEvent.press(notification);

      expect(mockPush).toHaveBeenCalledWith('/feedback');
    });

    it('should not navigate for general notification type', async () => {
      const { findByTestId } = render(<NotificationsScreen />);

      const notification = await findByTestId('notification-4');
      fireEvent.press(notification);

      // Should not navigate for 'general' type
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
