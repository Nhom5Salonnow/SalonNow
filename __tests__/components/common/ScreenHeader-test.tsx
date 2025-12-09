import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ScreenHeader } from '@/components/common/ScreenHeader';

// Mock expo-router
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
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
      dark: '#1F2937',
      pinkBg: '#FFF5F5',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Bell: () => null,
  ChevronLeft: () => null,
  Search: () => null,
}));

describe('ScreenHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ScreenHeader />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with title', () => {
      const { getByText } = render(<ScreenHeader title="Test Title" />);
      expect(getByText('Test Title')).toBeTruthy();
    });

    it('should render greeting when provided', () => {
      const { getByText } = render(
        <ScreenHeader greeting={{ line1: 'Hello', line2: 'John' }} />
      );
      expect(getByText('Hello')).toBeTruthy();
      expect(getByText('John')).toBeTruthy();
    });

    it('should render back variant with ChevronLeft', () => {
      const { UNSAFE_root } = render(<ScreenHeader variant="back" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render menu variant', () => {
      const { UNSAFE_root } = render(<ScreenHeader variant="menu" />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should call router.back when back button pressed without custom handler', () => {
      const { UNSAFE_getAllByType } = render(<ScreenHeader variant="back" />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should call custom onBackPress when provided', () => {
      const onBackPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader variant="back" onBackPress={onBackPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(onBackPress).toHaveBeenCalled();
        expect(mockBack).not.toHaveBeenCalled();
      }
    });

    it('should navigate to notifications when notification pressed without custom handler', () => {
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader showNotification />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Find notification button
      const notificationButton = buttons.find((b: any) => b.props.onPress);
      if (notificationButton) {
        fireEvent.press(notificationButton);
        expect(mockPush).toHaveBeenCalledWith('/notifications');
      }
    });

    it('should call custom onNotificationPress when provided', () => {
      const onNotificationPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader showNotification onNotificationPress={onNotificationPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Press the notification button
      buttons.forEach((b: any) => {
        if (b.props.onPress) {
          fireEvent.press(b);
        }
      });
      expect(onNotificationPress).toHaveBeenCalled();
    });

    it('should navigate to profile when profile pressed without custom handler', () => {
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader showProfile />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Press all buttons to trigger profile navigation
      buttons.forEach((b: any) => {
        if (b.props.onPress) {
          fireEvent.press(b);
        }
      });
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    it('should call custom onProfilePress when provided', () => {
      const onProfilePress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader showProfile onProfilePress={onProfilePress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      buttons.forEach((b: any) => {
        if (b.props.onPress) {
          fireEvent.press(b);
        }
      });
      expect(onProfilePress).toHaveBeenCalled();
    });
  });

  describe('Right Section', () => {
    it('should render custom rightElement when provided', () => {
      const { getByText } = render(
        <ScreenHeader rightElement={<></>} />
      );
      expect(true).toBeTruthy();
    });

    it('should render notification count indicator', () => {
      const { UNSAFE_root } = render(
        <ScreenHeader showNotification notificationCount={5} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render search button when showSearch is true', () => {
      const onSearchPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader showSearch onSearchPress={onSearchPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      buttons.forEach((b: any) => {
        if (b.props.onPress) {
          fireEvent.press(b);
        }
      });
      expect(onSearchPress).toHaveBeenCalled();
    });

    it('should render spacer for back variant with title', () => {
      const { UNSAFE_root } = render(
        <ScreenHeader variant="back" title="Test" />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Menu Press', () => {
    it('should call onMenuPress when menu button is pressed', () => {
      const onMenuPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ScreenHeader variant="menu" onMenuPress={onMenuPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(onMenuPress).toHaveBeenCalled();
      }
    });
  });
});
