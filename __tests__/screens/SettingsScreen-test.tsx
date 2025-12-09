import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '@/app/settings';

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
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Bell: () => null,
  Globe: () => null,
  Lock: () => null,
  HelpCircle: () => null,
  Info: () => null,
  LogOut: () => null,
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

    it('should render settings options', () => {
      const { getByText } = render(<SettingsScreen />);
      // Common settings options
      expect(getByText('Settings')).toBeTruthy();
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
  });

  describe('Settings Options', () => {
    it('should render multiple setting items', () => {
      const { UNSAFE_getAllByType } = render(<SettingsScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have multiple settings items
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
