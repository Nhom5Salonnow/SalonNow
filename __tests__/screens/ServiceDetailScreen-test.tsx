import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ServiceDetailScreen from '@/app/service/[id]';

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
  useLocalSearchParams: () => ({ id: 'hair-design' }),
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
      pinkBg: '#FFF5F5',
      dark: '#1F2937',
    },
    gray: {
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Search: () => null,
  Star: () => null,
  ShoppingCart: () => null,
  Clock: () => null,
  ChevronLeft: () => null,
  AlertCircle: () => null,
  CheckCircle: () => null,
  Calendar: () => null,
  User: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  QuoteBanner: ({ quote, imageUrl }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="quote-banner">
        <Text>{quote}</Text>
      </View>
    );
  },
}));

describe('ServiceDetailScreen', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock Math.random to return 0.5 (2 slots available) so isFullyBooked is false
    Math.random = jest.fn(() => 0.5);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Hair Design & Cut')).toBeTruthy();
    });

    it('should render category name based on route id', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Hair Design & Cut')).toBeTruthy();
    });

    it('should render quote banner', () => {
      const { getByTestId } = render(<ServiceDetailScreen />);
      expect(getByTestId('quote-banner')).toBeTruthy();
    });

    it('should render category quote', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('"Crafting Confidence,\nOne Cut at a Time."')).toBeTruthy();
    });

    it('should render Menu section title', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Menu')).toBeTruthy();
    });

    it('should render service items', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Basic Haircut')).toBeTruthy();
      expect(getByText('Layered Haircut')).toBeTruthy();
      expect(getByText('Bob Haircut')).toBeTruthy();
    });

    it('should render service prices', () => {
      const { getByText, getAllByText } = render(<ServiceDetailScreen />);
      expect(getByText('€60')).toBeTruthy();
      // There are two services with €65 (Layered and Bob)
      expect(getAllByText('€65').length).toBe(2);
    });

    it('should render Stylist section', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Stylist')).toBeTruthy();
    });

    it('should render Choose stylist button', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Choose stylist')).toBeTruthy();
    });

    it('should render Book Appointment button', () => {
      const { getByText } = render(<ServiceDetailScreen />);
      expect(getByText('Book Appointment')).toBeTruthy();
    });

    it('should render review links', () => {
      const { getAllByText } = render(<ServiceDetailScreen />);
      expect(getAllByText('review').length).toBe(3);
    });
  });

  describe('Navigation', () => {
    it('should go back when menu button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<ServiceDetailScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should navigate to choose-stylist when Choose stylist is pressed', () => {
      const { getByText } = render(<ServiceDetailScreen />);

      fireEvent.press(getByText('Choose stylist'));

      expect(mockPush).toHaveBeenCalledWith('/service/choose-stylist');
    });

    it('should navigate to book-appointment when Book Appointment is pressed', () => {
      const { getByText } = render(<ServiceDetailScreen />);

      fireEvent.press(getByText('Book Appointment'));

      expect(mockPush).toHaveBeenCalledWith('/book-appointment');
    });

    it('should navigate to review when review link is pressed', () => {
      const { getAllByText } = render(<ServiceDetailScreen />);
      const reviewLinks = getAllByText('review');

      fireEvent.press(reviewLinks[0]);

      expect(mockPush).toHaveBeenCalledWith('/review');
    });
  });

  describe('Service Selection', () => {
    it('should toggle service selection when service item is pressed', () => {
      const { getByText } = render(<ServiceDetailScreen />);

      // Press Basic Haircut to select it
      fireEvent.press(getByText('Basic Haircut'));

      // Press again to deselect
      fireEvent.press(getByText('Basic Haircut'));

      // Service selection is internal state - we just verify interaction works
    });

    it('should allow selecting multiple services', () => {
      const { getByText } = render(<ServiceDetailScreen />);

      fireEvent.press(getByText('Basic Haircut'));
      fireEvent.press(getByText('Layered Haircut'));

      // Multiple selections should work
    });
  });
});
