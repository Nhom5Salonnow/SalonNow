import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PromoCard } from '@/components/salon/PromoCard';

describe('PromoCard Component', () => {
  const defaultProps = {
    title: 'Special Offer',
    imageUrl: 'https://example.com/promo.jpg',
    backgroundColor: '#FE697D',
  };

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<PromoCard {...defaultProps} />);
      expect(getByText('Special Offer')).toBeTruthy();
    });

    it('should render title', () => {
      const { getByText } = render(<PromoCard {...defaultProps} />);
      expect(getByText('Special Offer')).toBeTruthy();
    });

    it('should render subtitle when provided', () => {
      const { getByText } = render(
        <PromoCard {...defaultProps} subtitle="50% Off" />
      );
      expect(getByText('50% Off')).toBeTruthy();
    });

    it('should not render subtitle when not provided', () => {
      const { queryByText } = render(<PromoCard {...defaultProps} />);
      expect(queryByText('50% Off')).toBeNull();
    });

    it('should render Image component', () => {
      const { UNSAFE_getByType } = render(<PromoCard {...defaultProps} />);
      const Image = require('react-native').Image;
      expect(UNSAFE_getByType(Image)).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply backgroundColor', () => {
      const { UNSAFE_getByType } = render(<PromoCard {...defaultProps} />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const card = UNSAFE_getByType(TouchableOpacity);
      expect(card.props.style.backgroundColor).toBe('#FE697D');
    });

    it('should apply different backgroundColor', () => {
      const { UNSAFE_getByType } = render(
        <PromoCard {...defaultProps} backgroundColor="#00FF00" />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const card = UNSAFE_getByType(TouchableOpacity);
      expect(card.props.style.backgroundColor).toBe('#00FF00');
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <PromoCard {...defaultProps} onPress={onPressMock} />
      );

      fireEvent.press(getByText('Special Offer'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not crash when onPress is not provided', () => {
      const { getByText } = render(<PromoCard {...defaultProps} />);

      expect(() => fireEvent.press(getByText('Special Offer'))).not.toThrow();
    });
  });

  describe('Content Variations', () => {
    it('should render with title and subtitle', () => {
      const { getByText } = render(
        <PromoCard
          {...defaultProps}
          title="Summer Sale"
          subtitle="Up to 70% off"
        />
      );
      expect(getByText('Summer Sale')).toBeTruthy();
      expect(getByText('Up to 70% off')).toBeTruthy();
    });

    it('should render long title', () => {
      const { getByText } = render(
        <PromoCard
          {...defaultProps}
          title="This is a very long promotional title for testing"
        />
      );
      expect(getByText('This is a very long promotional title for testing')).toBeTruthy();
    });
  });
});
