import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/home';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
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
      pinkBg: '#FFF5F5',
      dark: '#1F2937',
    },
    gray: {
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
  HOME_CATEGORIES: [
    { id: '1', name: 'Hair Cut', imageUrl: 'http://example.com/1.jpg' },
    { id: '2', name: 'Hair Color', imageUrl: 'http://example.com/2.jpg' },
    { id: '3', name: 'Massage', imageUrl: 'http://example.com/3.jpg' },
  ],
  SPECIALISTS: [
    { id: '1', name: 'Doe John', rating: 2, phone: '+732 8888 111', imageUrl: 'http://example.com/s1.jpg' },
    { id: '2', name: 'Lucy', rating: 2, phone: '+732 8888 111', imageUrl: 'http://example.com/s2.jpg' },
    { id: '3', name: 'Laila', rating: 0, phone: '+732 8888 111', imageUrl: 'http://example.com/s3.jpg' },
  ],
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Bell: () => null,
  ShoppingCart: () => null,
}));

// Mock DecorativeCircle component
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
}));

// Mock salon components
jest.mock('@/components/salon', () => ({
  HomeCategoryCard: ({ name, onPress }: { name: string; onPress?: () => void }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={`category-${name}`} onPress={onPress}>
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  },
  PromoCard: ({ title, subtitle }: { title: string; subtitle?: string }) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`promo-${title.substring(0, 10)}`}>
        <Text>{title}</Text>
        {subtitle && <Text>{subtitle}</Text>}
      </View>
    );
  },
  SpecialistCard: ({ name, onPress }: { name: string; onPress?: () => void }) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID={`specialist-${name}`} onPress={onPress}>
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  },
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Hi')).toBeTruthy();
    });

    it('should render greeting text with default user name', () => {
      const { getByText, getAllByText } = render(<HomeScreen />);
      expect(getByText('Hi')).toBeTruthy();
      // Doe John appears in greeting and as specialist name
      expect(getAllByText('Doe John').length).toBeGreaterThan(0);
    });

    it('should render Categories section title', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Categories')).toBeTruthy();
    });

    it('should render all categories from HOME_CATEGORIES', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('category-Hair Cut')).toBeTruthy();
      expect(getByTestId('category-Hair Color')).toBeTruthy();
      expect(getByTestId('category-Massage')).toBeTruthy();
    });

    it('should render correct number of category cards', () => {
      const { getAllByTestId } = render(<HomeScreen />);
      const categoryCards = getAllByTestId(/^category-/);
      expect(categoryCards.length).toBe(3);
    });

    it('should render Hair Specialist section title', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Hair Specialist')).toBeTruthy();
    });

    it('should render all specialist cards', () => {
      const { getByTestId } = render(<HomeScreen />);
      expect(getByTestId('specialist-Doe John')).toBeTruthy();
      expect(getByTestId('specialist-Lucy')).toBeTruthy();
      expect(getByTestId('specialist-Laila')).toBeTruthy();
    });

    it('should render correct number of specialist cards', () => {
      const { getAllByTestId } = render(<HomeScreen />);
      const specialists = getAllByTestId(/^specialist-/);
      expect(specialists.length).toBe(3);
    });
  });

  describe('Navigation', () => {
    it('should navigate to service detail when category is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('category-Hair Cut'));

      expect(mockPush).toHaveBeenCalledWith('/service/1');
    });

    it('should navigate to appointment when specialist is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('specialist-Doe John'));

      expect(mockPush).toHaveBeenCalledWith('/appointment');
    });

    it('should navigate to notifications when notification button is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('notification-button'));

      expect(mockPush).toHaveBeenCalledWith('/notifications');
    });

    it('should navigate to profile when profile button is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('profile-button'));

      expect(mockPush).toHaveBeenCalledWith('/profile');
    });

    it('should navigate to promo service when promo card is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('promo-button'));

      expect(mockPush).toHaveBeenCalledWith('/service/hair-design');
    });

    it('should navigate to payment when cart button is pressed', () => {
      const { getByTestId } = render(<HomeScreen />);

      fireEvent.press(getByTestId('cart-button'));

      expect(mockPush).toHaveBeenCalledWith('/payment');
    });
  });
});
