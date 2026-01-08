import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '@/app/settings';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
    push: (path: string) => mockPush(path),
    replace: jest.fn(),
  },
}));

// Mock AuthContext
const mockLogout = jest.fn();
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Test User', email: 'test@test.com', avatar: 'https://example.com/avatar.jpg' },
    isLoggedIn: true,
    isLoading: false,
    logout: mockLogout,
  }),
}));

// Mock GuestPrompt component
jest.mock('@/components', () => ({
  GuestPrompt: ({ message }: { message: string }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="guest-prompt">
        <Text>{message}</Text>
      </View>
    );
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
      200: '#E5E7EB',
      500: '#6B7280',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  User: () => null,
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Settings')).toBeTruthy();
    });

    it('should render settings header', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Settings')).toBeTruthy();
    });

    it('should render Language setting', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Language')).toBeTruthy();
    });

    it('should render Dark Mode setting', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Dark Mode')).toBeTruthy();
    });

    it('should render Help Center option', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Help Center')).toBeTruthy();
    });

    it('should render Privacy Policy option', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Privacy Policy')).toBeTruthy();
    });

    it('should render Recommendations option', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Recommendations')).toBeTruthy();
    });

    it('should render Account Info for logged in user', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Account Info')).toBeTruthy();
    });

    it('should render Change Password for logged in user', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Change Password')).toBeTruthy();
    });

    it('should render Sign Out button for logged in user', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('Sign Out')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<SettingsScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Press the first touchable (back button)
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should navigate to edit-profile when Account Info is pressed', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('Account Info'));
      expect(mockPush).toHaveBeenCalledWith('/edit-profile');
    });

    it('should navigate to change-password when Change Password is pressed', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('Change Password'));
      expect(mockPush).toHaveBeenCalledWith('/change-password');
    });
  });

  describe('Dark Mode Toggle', () => {
    it('should render dark mode switch', () => {
      const { UNSAFE_getAllByType } = render(<SettingsScreen />);
      const Switch = require('react-native').Switch;
      const switches = UNSAFE_getAllByType(Switch);
      expect(switches.length).toBeGreaterThan(0);
    });

    it('should toggle dark mode when switch is pressed', () => {
      const { UNSAFE_getAllByType } = render(<SettingsScreen />);
      const Switch = require('react-native').Switch;
      const switches = UNSAFE_getAllByType(Switch);

      if (switches.length > 0) {
        // Get initial value
        const initialValue = switches[0].props.value;
        expect(initialValue).toBe(false);

        // Toggle the switch
        fireEvent(switches[0], 'valueChange', true);
      }
    });
  });

  describe('Settings Options', () => {
    it('should render multiple setting items', () => {
      const { UNSAFE_getAllByType } = render(<SettingsScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have multiple settings items (back, avatar, settings items, sign out)
      expect(buttons.length).toBeGreaterThan(5);
    });
  });
});

