import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SplashScreen from '@/app/index';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    replace: (path: string) => mockReplace(path),
  },
}));

// Mock asyncStorage
const mockGetData = jest.fn();
jest.mock('@/utils/asyncStorage', () => ({
  getData: (key: string) => mockGetData(key),
  STORAGE_KEYS: {
    HAS_COMPLETED_ONBOARDING: 'has_completed_onboarding',
    AUTH_TOKEN: 'auth_token',
  },
}));

// Mock responsive utilities
jest.mock('@/utils/responsive', () => ({
  wp: (value: number) => value * 4,
  hp: (value: number) => value * 8,
  rf: (value: number) => value,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to default behavior (null = not completed onboarding)
    mockGetData.mockResolvedValue(null);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<SplashScreen />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render Salon text', () => {
      const { getByText } = render(<SplashScreen />);
      expect(getByText('Salon')).toBeTruthy();
    });

    it('should render Now text', () => {
      const { getByText } = render(<SplashScreen />);
      expect(getByText('Now')).toBeTruthy();
    });

    it('should render tagline text', () => {
      const { getByText } = render(<SplashScreen />);
      expect(getByText(/Step into a world of personalized/)).toBeTruthy();
    });

    it('should render Let\'s Start button', () => {
      const { getByText } = render(<SplashScreen />);
      expect(getByText("Let's Start")).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to onboarding when onboarding not completed', async () => {
      mockGetData.mockResolvedValue(null); // HAS_COMPLETED_ONBOARDING = null

      const { getByText } = render(<SplashScreen />);
      fireEvent.press(getByText("Let's Start"));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/onboarding');
      });
    });

    it('should navigate to home when onboarding completed (no login required)', async () => {
      mockGetData.mockResolvedValue('true'); // HAS_COMPLETED_ONBOARDING = true

      const { getByText } = render(<SplashScreen />);
      fireEvent.press(getByText("Let's Start"));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/home');
      });
    });

    it('should navigate to onboarding when error occurs', async () => {
      mockGetData.mockRejectedValue(new Error('Storage error'));

      const { getByText } = render(<SplashScreen />);

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      fireEvent.press(getByText("Let's Start"));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/onboarding');
      });

      consoleSpy.mockRestore();
    });

    it('should navigate to onboarding when onboarding value is not "true"', async () => {
      mockGetData.mockResolvedValue('false'); // HAS_COMPLETED_ONBOARDING = false

      const { getByText } = render(<SplashScreen />);
      fireEvent.press(getByText("Let's Start"));

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/onboarding');
      });
    });
  });
});
