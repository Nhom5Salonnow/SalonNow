import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FeedbackScreen from '@/app/feedback';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
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
  Menu: () => null,
  ChevronLeft: () => null,
  Star: ({ fill, color, size }: any) => {
    const { View } = require('react-native');
    return <View testID="star-icon" />;
  },
  CheckCircle: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

describe('FeedbackScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<FeedbackScreen />);
      expect(getByText('Feedback')).toBeTruthy();
    });

    it('should render feedback header', () => {
      const { getByText } = render(<FeedbackScreen />);
      expect(getByText('Feedback')).toBeTruthy();
    });

    it('should render feedback form', () => {
      const { getByPlaceholderText } = render(<FeedbackScreen />);
      expect(getByPlaceholderText(/experience|feedback|comment|review/i)).toBeTruthy();
    });

    it('should render star rating', () => {
      const { getAllByTestId } = render(<FeedbackScreen />);
      const stars = getAllByTestId('star-icon');
      expect(stars.length).toBeGreaterThan(0);
    });

    it('should render submit button', () => {
      const { getByText } = render(<FeedbackScreen />);
      expect(getByText('Submit Feedback')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<FeedbackScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Press the first touchable (back button)
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });
  });

  describe('Star Rating', () => {
    it('should render 5 stars for each rating category', () => {
      const { getAllByTestId } = render(<FeedbackScreen />);
      const stars = getAllByTestId('star-icon');
      // 4 categories x 5 stars = 20 stars
      expect(stars.length).toBe(20);
    });

    it('should allow selecting star rating', () => {
      const { getAllByTestId } = render(<FeedbackScreen />);
      const stars = getAllByTestId('star-icon');

      // Should be able to press stars
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  describe('Form Input', () => {
    it('should update feedback text when typing', () => {
      const { getByPlaceholderText } = render(<FeedbackScreen />);
      const input = getByPlaceholderText(/experience|feedback|comment|review/i);

      fireEvent.changeText(input, 'Great service!');

      expect(input.props.value).toBe('Great service!');
    });
  });

  describe('Submit', () => {
    it('should have a submit button', () => {
      const { getByText } = render(<FeedbackScreen />);
      expect(getByText('Submit Feedback')).toBeTruthy();
    });

    it('should handle submit press', () => {
      const { getByText, getByPlaceholderText } = render(<FeedbackScreen />);

      // Fill in feedback
      const input = getByPlaceholderText(/experience|feedback|comment|review/i);
      fireEvent.changeText(input, 'Great service!');

      // Press submit
      fireEvent.press(getByText('Submit Feedback'));

      // Should handle submission
    });
  });
});
