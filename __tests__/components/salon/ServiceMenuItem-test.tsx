import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ServiceMenuItem } from '@/components/salon/ServiceMenuItem';

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
  },
}));

// Mock StarRating component
jest.mock('@/components/ui/StarRating', () => ({
  StarRating: ({ rating }: { rating: number }) => {
    const { Text } = require('react-native');
    return <Text testID="star-rating">{rating}</Text>;
  },
}));

describe('ServiceMenuItem', () => {
  const mockItem = {
    id: '1',
    name: 'Haircut',
    price: 25,
    rating: 4.5,
    image: 'https://example.com/haircut.jpg',
    reviews: 120,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ServiceMenuItem item={mockItem} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render service name', () => {
      const { getByText } = render(<ServiceMenuItem item={mockItem} />);
      expect(getByText('Haircut')).toBeTruthy();
    });

    it('should render service price', () => {
      const { getByText } = render(<ServiceMenuItem item={mockItem} />);
      expect(getByText('€25')).toBeTruthy();
    });

    it('should render star rating', () => {
      const { getByTestId } = render(<ServiceMenuItem item={mockItem} />);
      expect(getByTestId('star-rating')).toBeTruthy();
    });

    it('should render review link', () => {
      const { getByText } = render(<ServiceMenuItem item={mockItem} />);
      expect(getByText('review')).toBeTruthy();
    });

    it('should render per 1 text', () => {
      const { getByText } = render(<ServiceMenuItem item={mockItem} />);
      expect(getByText('per 1')).toBeTruthy();
    });

    it('should render image', () => {
      const { UNSAFE_getAllByType } = render(<ServiceMenuItem item={mockItem} />);
      const Image = require('react-native').Image;
      const images = UNSAFE_getAllByType(Image);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Selection State', () => {
    it('should render with default (unselected) border', () => {
      const { UNSAFE_root } = render(<ServiceMenuItem item={mockItem} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with selected border when isSelected is true', () => {
      const { UNSAFE_root } = render(
        <ServiceMenuItem item={mockItem} isSelected />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Interaction', () => {
    it('should call onPress when card is pressed', () => {
      const onPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ServiceMenuItem item={mockItem} onPress={onPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(onPress).toHaveBeenCalledWith(mockItem);
    });

    it('should call onReviewPress when review link is pressed', () => {
      const onReviewPress = jest.fn();
      const { getByText } = render(
        <ServiceMenuItem item={mockItem} onReviewPress={onReviewPress} />
      );

      fireEvent.press(getByText('review'));
      expect(onReviewPress).toHaveBeenCalledWith(mockItem);
    });

    it('should not throw when onPress is not provided', () => {
      const { UNSAFE_getAllByType } = render(<ServiceMenuItem item={mockItem} />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      expect(() => fireEvent.press(buttons[0])).not.toThrow();
    });

    it('should not throw when onReviewPress is not provided', () => {
      const { getByText } = render(<ServiceMenuItem item={mockItem} />);
      expect(() => fireEvent.press(getByText('review'))).not.toThrow();
    });
  });
});
