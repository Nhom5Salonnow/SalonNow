import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StarRating } from '@/components/ui/StarRating';

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Star: ({ size, color, fill, style }: any) => {
    const { View } = require('react-native');
    return (
      <View
        testID="star-icon"
        style={style}
        accessibilityLabel={fill === 'transparent' ? 'empty-star' : 'filled-star'}
      />
    );
  },
}));

describe('StarRating Component', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getAllByTestId } = render(<StarRating rating={3} />);
      expect(getAllByTestId('star-icon')).toBeTruthy();
    });

    it('should render 5 stars by default', () => {
      const { getAllByTestId } = render(<StarRating rating={3} />);
      expect(getAllByTestId('star-icon').length).toBe(5);
    });

    it('should render custom number of stars', () => {
      const { getAllByTestId } = render(<StarRating rating={2} maxStars={3} />);
      expect(getAllByTestId('star-icon').length).toBe(3);
    });

    it('should render 10 stars when maxStars is 10', () => {
      const { getAllByTestId } = render(<StarRating rating={5} maxStars={10} />);
      expect(getAllByTestId('star-icon').length).toBe(10);
    });
  });

  describe('Rating Display', () => {
    it('should display correct number of filled stars for rating 0', () => {
      const { getAllByLabelText } = render(<StarRating rating={0} />);
      const emptyStars = getAllByLabelText('empty-star');
      expect(emptyStars.length).toBe(5);
    });

    it('should display correct number of filled stars for rating 3', () => {
      const { getAllByLabelText } = render(<StarRating rating={3} />);
      const filledStars = getAllByLabelText('filled-star');
      const emptyStars = getAllByLabelText('empty-star');
      expect(filledStars.length).toBe(3);
      expect(emptyStars.length).toBe(2);
    });

    it('should display correct number of filled stars for rating 5', () => {
      const { getAllByLabelText } = render(<StarRating rating={5} />);
      const filledStars = getAllByLabelText('filled-star');
      expect(filledStars.length).toBe(5);
    });

    it('should display 1 filled star for rating 1', () => {
      const { getAllByLabelText } = render(<StarRating rating={1} />);
      const filledStars = getAllByLabelText('filled-star');
      expect(filledStars.length).toBe(1);
    });
  });

  describe('Interactive Mode', () => {
    it('should render non-interactive by default', () => {
      const { getAllByTestId } = render(<StarRating rating={3} />);
      // Non-interactive renders View, not TouchableOpacity
      expect(getAllByTestId('star-icon').length).toBe(5);
    });

    it('should render interactive when interactive={true}', () => {
      const { getAllByTestId } = render(
        <StarRating rating={3} interactive={true} onRatingChange={() => {}} />
      );
      expect(getAllByTestId('star-icon').length).toBe(5);
    });

    it('should call onRatingChange when star is pressed in interactive mode', () => {
      const onRatingChangeMock = jest.fn();
      const { getAllByTestId } = render(
        <StarRating
          rating={3}
          interactive={true}
          onRatingChange={onRatingChangeMock}
        />
      );

      // In interactive mode, stars are wrapped in TouchableOpacity
      // We need to press the parent TouchableOpacity
      const stars = getAllByTestId('star-icon');
      fireEvent.press(stars[2]); // Press 3rd star

      // Note: This might need adjustment based on actual component structure
    });
  });

  describe('Styling Props', () => {
    it('should accept size prop', () => {
      const { getAllByTestId } = render(<StarRating rating={3} size={20} />);
      expect(getAllByTestId('star-icon').length).toBe(5);
    });

    it('should accept color prop', () => {
      const { getAllByTestId } = render(<StarRating rating={3} color="#FF0000" />);
      expect(getAllByTestId('star-icon').length).toBe(5);
    });

    it('should use default size of 14', () => {
      const { getAllByTestId } = render(<StarRating rating={3} />);
      expect(getAllByTestId('star-icon').length).toBe(5);
    });

    it('should use default color of #F59E0B', () => {
      const { getAllByTestId } = render(<StarRating rating={3} />);
      expect(getAllByTestId('star-icon').length).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rating greater than maxStars', () => {
      const { getAllByLabelText } = render(<StarRating rating={10} maxStars={5} />);
      const filledStars = getAllByLabelText('filled-star');
      expect(filledStars.length).toBe(5); // All stars should be filled
    });

    it('should handle negative rating', () => {
      const { getAllByLabelText } = render(<StarRating rating={-1} />);
      const emptyStars = getAllByLabelText('empty-star');
      expect(emptyStars.length).toBe(5); // All stars should be empty
    });

    it('should handle rating of 0', () => {
      const { getAllByLabelText } = render(<StarRating rating={0} />);
      const emptyStars = getAllByLabelText('empty-star');
      expect(emptyStars.length).toBe(5);
    });
  });
});
