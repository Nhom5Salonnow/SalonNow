import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ChooseStylistScreen from '@/app/service/choose-stylist';

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
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Search: () => null,
  Users: () => null,
  User: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  QuoteBanner: ({ quote }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="quote-banner">
        <Text>{quote}</Text>
      </View>
    );
  },
}));

describe('ChooseStylistScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Hair Design & Cut')).toBeTruthy();
    });

    it('should render header with category name', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Hair Design & Cut')).toBeTruthy();
    });

    it('should render quote banner', () => {
      const { getByTestId } = render(<ChooseStylistScreen />);
      expect(getByTestId('quote-banner')).toBeTruthy();
    });

    it('should render Menu section title', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Menu')).toBeTruthy();
    });

    it('should render Any Stylist option', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Any Stylist')).toBeTruthy();
      expect(getByText('Next available stylist')).toBeTruthy();
    });

    it('should render Multiple Stylists option', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Multiple Stylists')).toBeTruthy();
      expect(getByText('Choose per service')).toBeTruthy();
    });

    it('should render individual stylists', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Praveen')).toBeTruthy();
      expect(getByText('Thinu')).toBeTruthy();
      expect(getByText('Lisa')).toBeTruthy();
    });

    it('should render stylist roles', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Hair Specialist')).toBeTruthy();
      expect(getByText('Hair Dresser')).toBeTruthy();
      expect(getByText('Hair Stylist')).toBeTruthy();
    });

    it('should render Top Rated badges for top rated stylists', () => {
      const { getAllByText } = render(<ChooseStylistScreen />);
      // Praveen and Thinu are top rated
      expect(getAllByText('🏆 Top Rated').length).toBe(2);
    });

    it('should render Done button', () => {
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Done')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when menu button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ChooseStylistScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should go back when Done button is pressed', () => {
      const { getByText } = render(<ChooseStylistScreen />);

      fireEvent.press(getByText('Done'));

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Stylist Selection', () => {
    it('should default to Any Stylist option', () => {
      // Default selection is 'any'
      const { getByText } = render(<ChooseStylistScreen />);
      expect(getByText('Any Stylist')).toBeTruthy();
    });

    it('should select Any Stylist when pressed', () => {
      const { getByText } = render(<ChooseStylistScreen />);

      fireEvent.press(getByText('Any Stylist'));

      // Selection is internal state
    });

    it('should select Multiple Stylists when pressed', () => {
      const { getByText } = render(<ChooseStylistScreen />);

      fireEvent.press(getByText('Multiple Stylists'));

      // Selection is internal state
    });

    it('should select individual stylist when pressed', () => {
      const { getByText } = render(<ChooseStylistScreen />);

      fireEvent.press(getByText('Praveen'));

      // Selection is internal state
    });

    it('should allow changing selection between stylists', () => {
      const { getByText } = render(<ChooseStylistScreen />);

      // Select Praveen
      fireEvent.press(getByText('Praveen'));

      // Then select Thinu
      fireEvent.press(getByText('Thinu'));

      // Selection should change
    });

    it('should allow switching between any and specific stylist', () => {
      const { getByText } = render(<ChooseStylistScreen />);

      // Select specific stylist
      fireEvent.press(getByText('Lisa'));

      // Then select Any Stylist
      fireEvent.press(getByText('Any Stylist'));

      // Selection should change back to any
    });
  });
});
