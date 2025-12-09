import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotificationsScreen from '@/app/(tabs)/notifications';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
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
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<NotificationsScreen />);
      expect(getByText('Notification')).toBeTruthy();
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

    it('should render notification items', () => {
      const { getByTestId } = render(<NotificationsScreen />);
      expect(getByTestId('notification-1')).toBeTruthy();
      expect(getByTestId('notification-2')).toBeTruthy();
      expect(getByTestId('notification-3')).toBeTruthy();
      expect(getByTestId('notification-4')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to profile when avatar is pressed', () => {
      const { UNSAFE_getAllByType } = render(<NotificationsScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // The first touchable after header should be the profile avatar
      // Find and press the profile button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
      }
    });

    it('should navigate to my-appointments when appointment_confirm notification is pressed', () => {
      const { getByTestId } = render(<NotificationsScreen />);

      fireEvent.press(getByTestId('notification-1'));

      expect(mockPush).toHaveBeenCalledWith('/my-appointments');
    });

    it('should navigate to my-appointments when appointment_update notification is pressed', () => {
      const { getByTestId } = render(<NotificationsScreen />);

      fireEvent.press(getByTestId('notification-2'));

      expect(mockPush).toHaveBeenCalledWith('/my-appointments');
    });

    it('should navigate to feedback when feedback notification is pressed', () => {
      const { getByTestId } = render(<NotificationsScreen />);

      fireEvent.press(getByTestId('notification-3'));

      expect(mockPush).toHaveBeenCalledWith('/feedback');
    });

    it('should not navigate for general notification type', () => {
      const { getByTestId } = render(<NotificationsScreen />);

      fireEvent.press(getByTestId('notification-4'));

      // Should not navigate for 'general' type
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
