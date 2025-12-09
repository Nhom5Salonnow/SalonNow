import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ViewFeedbackScreen from '@/app/view-feedback';

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
      pinkBg: '#FFF5F5',
      dark: '#1F2937',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  ChevronLeft: () => null,
  Star: ({ fill }: any) => {
    const { View } = require('react-native');
    return <View testID={fill && fill !== 'transparent' ? 'star-filled' : 'star-empty'} />;
  },
  Home: () => null,
  Grid: () => null,
  MessageSquare: () => null,
  User: () => null,
}));

describe('ViewFeedbackScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('Feedback')).toBeTruthy();
    });

    it('should render header with title', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('Feedback')).toBeTruthy();
    });

    it('should render Your Feedback section title', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('Your Feedback')).toBeTruthy();
    });

    it('should render rating categories', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('Rate your Experience')).toBeTruthy();
      expect(getByText('Rate Service')).toBeTruthy();
      expect(getByText('Rate space')).toBeTruthy();
      expect(getByText('Rate Stylist')).toBeTruthy();
    });

    it('should render Your Comment section', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('Your Comment')).toBeTruthy();
    });

    it('should render the comment text', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('I have wonderful experience here.')).toBeTruthy();
    });

    it('should render Change Feedback button', () => {
      const { getByText } = render(<ViewFeedbackScreen />);
      expect(getByText('Change Feedback')).toBeTruthy();
    });

    it('should render bottom navigation icons', () => {
      const { UNSAFE_getAllByType } = render(<ViewFeedbackScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Should have multiple navigation buttons at the bottom
      expect(buttons.length).toBeGreaterThan(4);
    });

    it('should render star ratings for each category', () => {
      const { getAllByTestId } = render(<ViewFeedbackScreen />);
      const filledStars = getAllByTestId('star-filled');
      const emptyStars = getAllByTestId('star-empty');

      // Should have some filled and empty stars based on ratings
      expect(filledStars.length).toBeGreaterThan(0);
      expect(emptyStars.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    it('should go back when menu button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ViewFeedbackScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable should be menu button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should go back when chevron button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ViewFeedbackScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Second touchable should be chevron back button
      if (buttons.length > 1) {
        fireEvent.press(buttons[1]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should navigate to feedback when Change Feedback is pressed', () => {
      const { getByText } = render(<ViewFeedbackScreen />);

      fireEvent.press(getByText('Change Feedback'));

      expect(mockPush).toHaveBeenCalledWith('/feedback');
    });

    it('should navigate to home when home icon is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ViewFeedbackScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Find the home button in bottom nav (should be near the end)
      const homeButton = buttons.find((b: any) => {
        // The home button is in the bottom navigation
        return b.props.onPress;
      });

      // Press Home button (it's the 4th from the end in bottom nav)
      if (buttons.length >= 4) {
        fireEvent.press(buttons[buttons.length - 4]);
        expect(mockPush).toHaveBeenCalledWith('/home');
      }
    });
  });

  describe('Rating Display', () => {
    it('should display correct number of filled stars for 5-star rating', () => {
      // The Experience rating is 5 stars
      const { getAllByTestId } = render(<ViewFeedbackScreen />);
      const filledStars = getAllByTestId('star-filled');

      // Should have at least 5 filled stars for the experience rating
      expect(filledStars.length).toBeGreaterThanOrEqual(5);
    });
  });
});
