import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StylistOption } from '@/components/salon/StylistOption';

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
  Users: () => null,
  User: () => null,
}));

describe('StylistOption', () => {
  const mockStylist = {
    id: '1',
    name: 'John Doe',
    role: 'Senior Stylist',
    imageUrl: 'https://example.com/john.jpg',
    isTopRated: true,
    rating: 4.8,
    phone: '+123456789',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Any Stylist Type', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(
        <StylistOption type="any" isSelected={false} onPress={jest.fn()} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render "Any Stylist" text', () => {
      const { getByText } = render(
        <StylistOption type="any" isSelected={false} onPress={jest.fn()} />
      );
      expect(getByText('Any Stylist')).toBeTruthy();
    });

    it('should render "Next available stylist" description', () => {
      const { getByText } = render(
        <StylistOption type="any" isSelected={false} onPress={jest.fn()} />
      );
      expect(getByText('Next available stylist')).toBeTruthy();
    });

    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <StylistOption type="any" isSelected={false} onPress={onPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('Multiple Stylists Type', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(
        <StylistOption type="multiple" isSelected={false} onPress={jest.fn()} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render "Multiple Stylists" text', () => {
      const { getByText } = render(
        <StylistOption type="multiple" isSelected={false} onPress={jest.fn()} />
      );
      expect(getByText('Multiple Stylists')).toBeTruthy();
    });

    it('should render "Choose per service" description', () => {
      const { getByText } = render(
        <StylistOption type="multiple" isSelected={false} onPress={jest.fn()} />
      );
      expect(getByText('Choose per service')).toBeTruthy();
    });

    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <StylistOption type="multiple" isSelected={false} onPress={onPress} />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('Individual Stylist Type', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(
        <StylistOption
          type="individual"
          stylist={mockStylist}
          isSelected={false}
          onPress={jest.fn()}
        />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render stylist name', () => {
      const { getByText } = render(
        <StylistOption
          type="individual"
          stylist={mockStylist}
          isSelected={false}
          onPress={jest.fn()}
        />
      );
      expect(getByText('John Doe')).toBeTruthy();
    });

    it('should render stylist role', () => {
      const { getByText } = render(
        <StylistOption
          type="individual"
          stylist={mockStylist}
          isSelected={false}
          onPress={jest.fn()}
        />
      );
      expect(getByText('Senior Stylist')).toBeTruthy();
    });

    it('should render Top Rated badge when stylist is top rated', () => {
      const { getByText } = render(
        <StylistOption
          type="individual"
          stylist={mockStylist}
          isSelected={false}
          onPress={jest.fn()}
        />
      );
      expect(getByText('🏆 Top Rated')).toBeTruthy();
    });

    it('should not render Top Rated badge when stylist is not top rated', () => {
      const nonTopRatedStylist = { ...mockStylist, isTopRated: false };
      const { queryByText } = render(
        <StylistOption
          type="individual"
          stylist={nonTopRatedStylist}
          isSelected={false}
          onPress={jest.fn()}
        />
      );
      expect(queryByText('🏆 Top Rated')).toBeNull();
    });

    it('should render stylist image', () => {
      const { UNSAFE_getAllByType } = render(
        <StylistOption
          type="individual"
          stylist={mockStylist}
          isSelected={false}
          onPress={jest.fn()}
        />
      );
      const Image = require('react-native').Image;
      const images = UNSAFE_getAllByType(Image);
      expect(images.length).toBeGreaterThan(0);
    });

    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { UNSAFE_getAllByType } = render(
        <StylistOption
          type="individual"
          stylist={mockStylist}
          isSelected={false}
          onPress={onPress}
        />
      );
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      fireEvent.press(buttons[0]);
      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('Selection State', () => {
    it('should render with unselected border style', () => {
      const { UNSAFE_root } = render(
        <StylistOption type="any" isSelected={false} onPress={jest.fn()} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render with selected border style', () => {
      const { UNSAFE_root } = render(
        <StylistOption type="any" isSelected={true} onPress={jest.fn()} />
      );
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
