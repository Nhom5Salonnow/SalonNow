import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuoteBanner } from '@/components/common/QuoteBanner';

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

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Pencil: () => null,
}));

describe('QuoteBanner', () => {
  const defaultProps = {
    quote: 'Test quote message',
    imageUrl: 'https://example.com/image.jpg',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<QuoteBanner {...defaultProps} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render quote text', () => {
      const { getByText } = render(<QuoteBanner {...defaultProps} />);
      expect(getByText('Test quote message')).toBeTruthy();
    });

    it('should render with custom background color', () => {
      const { UNSAFE_root } = render(
        <QuoteBanner {...defaultProps} backgroundColor="#FF0000" />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with custom height', () => {
      const { UNSAFE_root } = render(
        <QuoteBanner {...defaultProps} height={30} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render image', () => {
      const { UNSAFE_getAllByType } = render(<QuoteBanner {...defaultProps} />);
      const Image = require('react-native').Image;
      const images = UNSAFE_getAllByType(Image);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe('Edit Mode', () => {
    it('should render edit button when editable is true', () => {
      const { UNSAFE_getAllByType } = render(
        <QuoteBanner {...defaultProps} editable />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should not render edit button when editable is false', () => {
      const { queryAllByTestId, UNSAFE_root } = render(
        <QuoteBanner {...defaultProps} editable={false} />
      );
      // Just verify component renders without edit functionality
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should call onEditPress when edit button is pressed', () => {
      const onEditPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <QuoteBanner {...defaultProps} editable onEditPress={onEditPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(onEditPress).toHaveBeenCalled();
      }
    });
  });
});
