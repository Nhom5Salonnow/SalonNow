import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeCategoryCard } from '@/components/salon/HomeCategoryCard';

describe('HomeCategoryCard Component', () => {
  const defaultProps = {
    name: 'Hair Cut',
    imageUrl: 'https://example.com/image.jpg',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<HomeCategoryCard {...defaultProps} />);
      expect(getByText('Hair Cut')).toBeTruthy();
    });

    it('should render category name', () => {
      const { getByText } = render(<HomeCategoryCard {...defaultProps} />);
      expect(getByText('Hair Cut')).toBeTruthy();
    });

    it('should render different category names', () => {
      const { getByText } = render(
        <HomeCategoryCard name="Hair Color" imageUrl="https://example.com/color.jpg" />
      );
      expect(getByText('Hair Color')).toBeTruthy();
    });

    it('should render Image component', () => {
      const { UNSAFE_getByType } = render(<HomeCategoryCard {...defaultProps} />);
      const Image = require('react-native').Image;
      expect(UNSAFE_getByType(Image)).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <HomeCategoryCard {...defaultProps} onPress={onPressMock} />
      );

      fireEvent.press(getByText('Hair Cut'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is not provided', () => {
      const { getByText } = render(<HomeCategoryCard {...defaultProps} />);

      expect(() => fireEvent.press(getByText('Hair Cut'))).not.toThrow();
    });

    it('should handle multiple presses', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <HomeCategoryCard {...defaultProps} onPress={onPressMock} />
      );

      fireEvent.press(getByText('Hair Cut'));
      fireEvent.press(getByText('Hair Cut'));
      fireEvent.press(getByText('Hair Cut'));

      expect(onPressMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('Different Props', () => {
    it('should render with long category name', () => {
      const { getByText } = render(
        <HomeCategoryCard
          name="Hair Design & Cut Professional"
          imageUrl="https://example.com/image.jpg"
        />
      );
      expect(getByText('Hair Design & Cut Professional')).toBeTruthy();
    });

    it('should render with different image URL', () => {
      const { UNSAFE_getByType } = render(
        <HomeCategoryCard
          name="Spa"
          imageUrl="https://different-url.com/spa.png"
        />
      );
      const Image = require('react-native').Image;
      const image = UNSAFE_getByType(Image);
      expect(image.props.source.uri).toBe('https://different-url.com/spa.png');
    });
  });
});
