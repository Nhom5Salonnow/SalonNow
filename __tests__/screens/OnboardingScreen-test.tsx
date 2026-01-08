import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingScreen from '@/app/onboarding';
import * as asyncStorage from '@/utils/asyncStorage';

// ============================================
// MOCKS - Setup
// ============================================

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// Mock AsyncStorage utilities
jest.mock('@/utils/asyncStorage', () => ({
  __esModule: true,
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_DATA: 'userData',
    HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
    FAVORITES: 'favorites',
  },
  storeData: jest.fn().mockResolvedValue(undefined),
  getData: jest.fn(),
  removeData: jest.fn(),
}));

// ============================================
// TEST SUITE
// ============================================

describe('OnboardingScreen', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // TEST 1: Basic Render Test
  // Kiểm tra component render thành công và hiển thị nội dung trang đầu tiên
  // ==========================================
  describe('Render Tests', () => {
    it('should render successfully without crashing', () => {
      const { getByText } = render(<OnboardingScreen />);

      // Verify app title is rendered
      expect(getByText('Salon Now')).toBeTruthy();
    });

    it('should display the title of the first slide', () => {
      const { getByText } = render(<OnboardingScreen />);

      // Check first slide title
      expect(getByText('Welcome to SalonNow')).toBeTruthy();
    });

    it('should display the description (subtitle) of the first slide', () => {
      const { getByText } = render(<OnboardingScreen />);

      // Check first slide subtitle/description
      expect(getByText('Book beauty services anytime, anywhere')).toBeTruthy();
    });

    it('should display "Next" button on first slide', () => {
      const { getByText } = render(<OnboardingScreen />);

      expect(getByText('Next')).toBeTruthy();
    });

    it('should display "Skip!" button on first slide', () => {
      const { getByText } = render(<OnboardingScreen />);

      expect(getByText('Skip!')).toBeTruthy();
    });
  });

  // ==========================================
  // TEST 2: Navigation Logic Tests (useRouter)
  // Kiểm tra khi nhấn "Done" hoặc "Skip", router.replace() được gọi đúng
  // ==========================================
  describe('Navigation Tests (useRouter)', () => {
    it('should call router.replace when "Skip!" button is pressed', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const { router } = require('expo-router');

      const skipButton = getByText('Skip!');
      fireEvent.press(skipButton);

      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/home');
      });
    });

    it('should call router.replace when "Get Started" (Done) button is pressed on last slide', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const { router } = require('expo-router');

      // Navigate to the last slide by pressing Next multiple times
      const totalSlides = require('@/constants').ONBOARDING_SLIDES.length;
      const nextButton = getByText('Next');

      for (let i = 0; i < totalSlides - 1; i++) {
        fireEvent.press(nextButton);
      }

      // Now press "Get Started" button
      const getStartedButton = await waitFor(() => getByText('Get Started'));
      fireEvent.press(getStartedButton);

      await waitFor(() => {
        expect(router.replace).toHaveBeenCalledWith('/home');
      });
    });

    it('should NOT call router.replace when "Next" button is pressed on non-last slides', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const { router } = require('expo-router');

      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      // Wait a moment to ensure navigation is not triggered
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(router.replace).not.toHaveBeenCalled();
    });
  });

  // ==========================================
  // TEST 3: AsyncStorage Interaction Tests
  // Kiểm tra storeData được gọi đúng khi nhấn Done/Skip, và không đổi khi nhấn Next
  // ==========================================
  describe('AsyncStorage Interaction Tests', () => {
    it('should call storeData with correct key and value "true" when "Skip!" is pressed', async () => {
      const { getByText } = render(<OnboardingScreen />);

      const skipButton = getByText('Skip!');
      fireEvent.press(skipButton);

      await waitFor(() => {
        expect(asyncStorage.storeData).toHaveBeenCalledWith(
          'hasCompletedOnboarding',
          'true'
        );
      });
    });

    it('should call storeData with value "true" (not "1") when "Skip!" is pressed', async () => {
      const { getByText } = render(<OnboardingScreen />);

      const skipButton = getByText('Skip!');
      fireEvent.press(skipButton);

      await waitFor(() => {
        // Verify the value is 'true' string, not '1'
        expect(asyncStorage.storeData).toHaveBeenCalledWith(
          expect.any(String),
          'true'
        );
        expect(asyncStorage.storeData).not.toHaveBeenCalledWith(
          expect.any(String),
          '1'
        );
      });
    });

    it('should call storeData when "Get Started" (Done) button is pressed on last slide', async () => {
      const { getByText } = render(<OnboardingScreen />);

      // Navigate to the last slide
      const totalSlides = require('@/constants').ONBOARDING_SLIDES.length;
      const nextButton = getByText('Next');

      for (let i = 0; i < totalSlides - 1; i++) {
        fireEvent.press(nextButton);
      }

      // Press "Get Started" button
      const getStartedButton = await waitFor(() => getByText('Get Started'));
      fireEvent.press(getStartedButton);

      await waitFor(() => {
        expect(asyncStorage.storeData).toHaveBeenCalledWith(
          'hasCompletedOnboarding',
          'true'
        );
      });
    });

    it('should NOT call storeData when "Next" button is pressed on non-last slides', async () => {
      const { getByText } = render(<OnboardingScreen />);

      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      // Wait a moment to ensure storeData is not called
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(asyncStorage.storeData).not.toHaveBeenCalled();
    });

    it('should call storeData BEFORE navigation on skip', async () => {
      const callOrder: string[] = [];
      const { router } = require('expo-router');

      (asyncStorage.storeData as jest.Mock).mockImplementation(async () => {
        callOrder.push('storeData');
      });

      (router.replace as jest.Mock).mockImplementation(() => {
        callOrder.push('replace');
      });

      const { getByText } = render(<OnboardingScreen />);

      const skipButton = getByText('Skip!');
      fireEvent.press(skipButton);

      await waitFor(() => {
        expect(callOrder).toEqual(['storeData', 'replace']);
      });
    });
  });

  // ==========================================
  // TEST 4: Content Change Tests
  // Kiểm tra khi nhấn "Next" nhiều lần, nội dung (title và desc) thay đổi đúng
  // ==========================================
  describe('Content Change Tests', () => {
    it('should advance to next slide when "Next" button is pressed', async () => {
      const { getByText, queryByText } = render(<OnboardingScreen />);

      // Verify first slide is shown
      expect(getByText('Welcome to SalonNow')).toBeTruthy();

      // Press Next
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      // Verify second slide content is shown
      await waitFor(() => {
        expect(getByText('Discover & Book Easily')).toBeTruthy();
      });
    });

    it('should show different title after pressing "Next" button', async () => {
      const { getByText } = render(<OnboardingScreen />);

      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      // Second slide title should be visible
      await waitFor(() => {
        expect(getByText('Discover & Book Easily')).toBeTruthy();
      });
    });

    it('should show different description after pressing "Next" button', async () => {
      const { getByText, queryByText } = render(<OnboardingScreen />);

      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      // Second slide description should be visible (partial match)
      await waitFor(() => {
        expect(queryByText(/Explore the latest styles/)).toBeTruthy();
      });
    });

    it('should navigate through all slides by pressing "Next" multiple times', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const nextButton = getByText('Next');

      // Slide 1 (initial)
      expect(getByText('Welcome to SalonNow')).toBeTruthy();

      // Press Next -> Slide 2
      fireEvent.press(nextButton);
      await waitFor(() => {
        expect(getByText('Discover & Book Easily')).toBeTruthy();
      });

      // Press Next -> Slide 3
      fireEvent.press(nextButton);
      await waitFor(() => {
        expect(getByText('Relax & Enjoy')).toBeTruthy();
      });

      // Press Next -> Slide 4 (last)
      fireEvent.press(nextButton);
      await waitFor(() => {
        expect(getByText('Your Style, One App')).toBeTruthy();
      });
    });

    it('should show "Get Started" button instead of "Next" on last slide', async () => {
      const { getByText, queryByText } = render(<OnboardingScreen />);
      const nextButton = getByText('Next');

      // Navigate to last slide
      const totalSlides = require('@/constants').ONBOARDING_SLIDES.length;
      for (let i = 0; i < totalSlides - 1; i++) {
        fireEvent.press(nextButton);
      }

      await waitFor(() => {
        expect(getByText('Get Started')).toBeTruthy();
      });
    });

    it('should hide "Skip!" button on last slide', async () => {
      const { getByText, queryByText } = render(<OnboardingScreen />);
      const nextButton = getByText('Next');

      // Initially Skip is visible
      expect(queryByText('Skip!')).toBeTruthy();

      // Navigate to last slide
      const totalSlides = require('@/constants').ONBOARDING_SLIDES.length;
      for (let i = 0; i < totalSlides - 1; i++) {
        fireEvent.press(nextButton);
      }

      await waitFor(() => {
        // Skip button should not be visible on last slide
        expect(queryByText('Skip!')).toBeNull();
      });
    });

    it('should show last slide title and description correctly', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const nextButton = getByText('Next');

      // Navigate to last slide
      const totalSlides = require('@/constants').ONBOARDING_SLIDES.length;
      for (let i = 0; i < totalSlides - 1; i++) {
        fireEvent.press(nextButton);
      }

      await waitFor(() => {
        expect(getByText('Your Style, One App')).toBeTruthy();
        expect(getByText('Your beauty journey starts here')).toBeTruthy();
      });
    });
  });

  // ==========================================
  // BONUS: Combined Integration Tests
  // ==========================================
  describe('Integration Tests', () => {
    it('should complete full onboarding flow with Next buttons', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const { router } = require('expo-router');
      const nextButton = getByText('Next');

      // Navigate through all slides
      const totalSlides = require('@/constants').ONBOARDING_SLIDES.length;
      for (let i = 0; i < totalSlides - 1; i++) {
        fireEvent.press(nextButton);
      }

      // Press Get Started
      const getStartedButton = await waitFor(() => getByText('Get Started'));
      fireEvent.press(getStartedButton);

      // Verify both storage and navigation happened
      await waitFor(() => {
        expect(asyncStorage.storeData).toHaveBeenCalledWith(
          'hasCompletedOnboarding',
          'true'
        );
        // Navigate to home for guest mode support
        expect(router.replace).toHaveBeenCalledWith('/home');
      });
    });

    it('should complete onboarding flow with Skip button', async () => {
      const { getByText } = render(<OnboardingScreen />);
      const { router } = require('expo-router');

      // Skip from first slide
      const skipButton = getByText('Skip!');
      fireEvent.press(skipButton);

      // Verify both storage and navigation happened
      await waitFor(() => {
        expect(asyncStorage.storeData).toHaveBeenCalledWith(
          'hasCompletedOnboarding',
          'true'
        );
        // Navigate to home for guest mode support
        expect(router.replace).toHaveBeenCalledWith('/home');
      });
    });
  });
});
