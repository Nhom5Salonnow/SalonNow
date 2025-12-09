import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AdminBottomNav } from '@/components/common/AdminBottomNav';

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
      pinkBg: '#FFF5F5',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Home: () => null,
  Grid: () => null,
  MessageSquare: () => null,
  User: () => null,
}));

describe('AdminBottomNav', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<AdminBottomNav />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render all navigation items', () => {
      const { UNSAFE_getAllByType } = render(<AdminBottomNav />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have 4 navigation buttons
      expect(buttons.length).toBe(4);
    });

    it('should render with active tab highlighted', () => {
      const { UNSAFE_root } = render(<AdminBottomNav activeTab="home" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with dashboard active', () => {
      const { UNSAFE_root } = render(<AdminBottomNav activeTab="dashboard" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with messages active', () => {
      const { UNSAFE_root } = render(<AdminBottomNav activeTab="messages" />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with profile active', () => {
      const { UNSAFE_root } = render(<AdminBottomNav activeTab="profile" />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to admin home when home button pressed', () => {
      const { UNSAFE_getAllByType } = render(<AdminBottomNav />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(mockPush).toHaveBeenCalledWith('/admin/home');
    });

    it('should navigate to admin dashboard when dashboard button pressed', () => {
      const { UNSAFE_getAllByType } = render(<AdminBottomNav />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[1]);
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('should navigate to admin messages when messages button pressed', () => {
      const { UNSAFE_getAllByType } = render(<AdminBottomNav />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[2]);
      expect(mockPush).toHaveBeenCalledWith('/admin/messages');
    });

    it('should navigate to admin profile when profile button pressed', () => {
      const { UNSAFE_getAllByType } = render(<AdminBottomNav />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[3]);
      expect(mockPush).toHaveBeenCalledWith('/admin/profile');
    });
  });
});
