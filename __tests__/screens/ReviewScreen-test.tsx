import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ReviewScreen from '@/app/review';

// Mock expo-router
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
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
  REVIEWS: [
    {
      id: '1',
      userName: 'John Doe',
      rating: 5,
      comment: 'Great service!',
      date: '2024-01-15',
      avatar: 'https://example.com/avatar1.jpg',
    },
    {
      id: '2',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Very good experience',
      date: '2024-01-10',
      avatar: 'https://example.com/avatar2.jpg',
    },
  ],
  RATING_DISTRIBUTION: [
    { stars: 5, percentage: 60 },
    { stars: 4, percentage: 25 },
    { stars: 3, percentage: 10 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 2 },
  ],
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  ChevronLeft: () => null,
  Star: () => null,
}));

// Mock components
jest.mock('@/components/ui', () => ({
  ReviewCard: ({ item }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`review-${item.id}`}>
        <Text>{item.userName}</Text>
        <Text>{item.comment}</Text>
      </View>
    );
  },
  StarRating: ({ rating, size }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="star-rating">
        <Text>{rating}</Text>
      </View>
    );
  },
}));

describe('ReviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<ReviewScreen />);
      expect(getByText('Review')).toBeTruthy();
    });

    it('should render header with title', () => {
      const { getByText } = render(<ReviewScreen />);
      expect(getByText('Review')).toBeTruthy();
    });

    it('should render average rating', () => {
      const { getByText } = render(<ReviewScreen />);
      expect(getByText('4.0')).toBeTruthy();
    });

    it('should render total reviews count', () => {
      const { getByText } = render(<ReviewScreen />);
      expect(getByText('52 Reviews')).toBeTruthy();
    });

    it('should render star rating component', () => {
      const { getByTestId } = render(<ReviewScreen />);
      expect(getByTestId('star-rating')).toBeTruthy();
    });

    it('should render rating distribution bars', () => {
      const { getAllByText } = render(<ReviewScreen />);
      // Should render star numbers 1-5 (multiple instances exist)
      expect(getAllByText('5').length).toBeGreaterThan(0);
      expect(getAllByText('4').length).toBeGreaterThan(0);
      expect(getAllByText('3').length).toBeGreaterThan(0);
      expect(getAllByText('2').length).toBeGreaterThan(0);
      expect(getAllByText('1').length).toBeGreaterThan(0);
    });

    it('should render review cards', () => {
      const { getByTestId } = render(<ReviewScreen />);
      expect(getByTestId('review-1')).toBeTruthy();
      expect(getByTestId('review-2')).toBeTruthy();
    });

    it('should render review usernames', () => {
      const { getByText } = render(<ReviewScreen />);
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('Jane Smith')).toBeTruthy();
    });

    it('should render review comments', () => {
      const { getByText } = render(<ReviewScreen />);
      expect(getByText('Great service!')).toBeTruthy();
      expect(getByText('Very good experience')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when menu button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ReviewScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable should be menu/back button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should go back when chevron button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ReviewScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Second touchable should be chevron back button
      if (buttons.length > 1) {
        fireEvent.press(buttons[1]);
        expect(mockBack).toHaveBeenCalled();
      }
    });
  });
});
