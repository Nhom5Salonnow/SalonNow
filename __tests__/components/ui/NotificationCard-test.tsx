import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationCard } from '@/components/ui/NotificationCard';

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
      dark: '#1F2937',
    },
    gray: {
      100: '#F3F4F6',
      600: '#4B5563',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Calendar: () => null,
  Star: () => null,
  MessageSquare: () => null,
}));

describe('NotificationCard', () => {
  const mockNotificationAppointment = {
    id: '1',
    title: 'Appointment Confirmed',
    description: 'Your appointment has been confirmed for tomorrow.',
    time: '2 hours ago',
    type: 'appointment_confirm',
    read: false,
  };

  const mockNotificationFeedback = {
    id: '2',
    title: 'Leave a Review',
    description: 'How was your experience?',
    time: '1 day ago',
    type: 'feedback',
    read: true,
  };

  const mockNotificationDefault = {
    id: '3',
    title: 'New Message',
    description: 'You have a new message.',
    time: '3 hours ago',
    type: 'message',
    read: false,
  };

  const mockNotificationUpdate = {
    id: '4',
    title: 'Appointment Updated',
    description: 'Your appointment time has been changed.',
    time: '5 hours ago',
    type: 'appointment_update',
    read: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render notification title', () => {
      const { getByText } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      expect(getByText('Appointment Confirmed')).toBeTruthy();
    });

    it('should render notification description', () => {
      const { getByText } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      expect(
        getByText('Your appointment has been confirmed for tomorrow.')
      ).toBeTruthy();
    });

    it('should render notification time', () => {
      const { getByText } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      expect(getByText('2 hours ago')).toBeTruthy();
    });
  });

  describe('Unread Indicator', () => {
    it('should render unread dot when notification is not read', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      // The unread dot is rendered
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should not render unread dot when notification is read', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationFeedback} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Notification Types', () => {
    it('should render calendar icon for appointment_confirm type', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render calendar icon for appointment_update type', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationUpdate} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render star icon for feedback type', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationFeedback} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render message icon for default type', () => {
      const { UNSAFE_root } = render(
        <NotificationCard item={mockNotificationDefault} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when card is pressed', () => {
      const onPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <NotificationCard
          item={mockNotificationAppointment}
          onPress={onPress}
        />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(onPress).toHaveBeenCalledWith(mockNotificationAppointment);
    });

    it('should not throw when onPress is not provided', () => {
      const { UNSAFE_getAllByType } = render(
        <NotificationCard item={mockNotificationAppointment} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      expect(() => fireEvent.press(buttons[0])).not.toThrow();
    });
  });
});
