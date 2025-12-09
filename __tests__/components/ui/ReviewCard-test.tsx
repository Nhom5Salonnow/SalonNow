import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ReviewCard } from '@/components/ui/ReviewCard';

// Mock responsive utilities
jest.mock('@/utils/responsive', () => ({
  wp: (value: number) => value * 4,
  hp: (value: number) => value * 8,
  rf: (value: number) => value,
}));

// Mock StarRating component
jest.mock('@/components/ui/StarRating', () => ({
  StarRating: ({ rating }: { rating: number }) => {
    const { Text } = require('react-native');
    return <Text testID="star-rating">{rating}</Text>;
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  MoreVertical: () => null,
}));

describe('ReviewCard', () => {
  const mockReview = {
    id: '1',
    userName: 'Jane Doe',
    userImage: 'https://example.com/jane.jpg',
    rating: 4,
    comment: 'Great service! I loved my new haircut.',
    timeAgo: '2 days ago',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<ReviewCard item={mockReview} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render user name', () => {
      const { getByText } = render(<ReviewCard item={mockReview} />);
      expect(getByText('Jane Doe')).toBeTruthy();
    });

    it('should render review comment', () => {
      const { getByText } = render(<ReviewCard item={mockReview} />);
      expect(getByText('Great service! I loved my new haircut.')).toBeTruthy();
    });

    it('should render time ago text', () => {
      const { getByText } = render(<ReviewCard item={mockReview} />);
      expect(getByText('2 days ago')).toBeTruthy();
    });

    it('should render star rating', () => {
      const { getByTestId } = render(<ReviewCard item={mockReview} />);
      expect(getByTestId('star-rating')).toBeTruthy();
    });

    it('should render user image', () => {
      const { UNSAFE_getAllByType } = render(<ReviewCard item={mockReview} />);
      const Image = require('react-native').Image;
      const images = UNSAFE_getAllByType(Image);
      expect(images.length).toBeGreaterThan(0);
    });

    it('should render options button', () => {
      const { UNSAFE_getAllByType } = render(<ReviewCard item={mockReview} />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Interaction', () => {
    it('should call onOptionsPress when options button is pressed', () => {
      const onOptionsPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <ReviewCard item={mockReview} onOptionsPress={onOptionsPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(onOptionsPress).toHaveBeenCalledWith(mockReview);
    });

    it('should not throw when onOptionsPress is not provided', () => {
      const { UNSAFE_getAllByType } = render(<ReviewCard item={mockReview} />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      expect(() => fireEvent.press(buttons[0])).not.toThrow();
    });
  });

  describe('Different Reviews', () => {
    it('should render review with 5 star rating', () => {
      const fiveStarReview = { ...mockReview, rating: 5 };
      const { getByTestId } = render(<ReviewCard item={fiveStarReview} />);
      expect(getByTestId('star-rating')).toBeTruthy();
    });

    it('should render review with long comment', () => {
      const longCommentReview = {
        ...mockReview,
        comment: 'This was an absolutely amazing experience! The staff were so friendly and professional. I will definitely be coming back again. Highly recommended!',
      };
      const { getByText } = render(<ReviewCard item={longCommentReview} />);
      expect(getByText(longCommentReview.comment)).toBeTruthy();
    });
  });
});
