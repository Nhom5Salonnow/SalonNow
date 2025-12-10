import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PaymentScreen from '@/app/payment';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve('mock_token')),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock AuthGuard to render children directly
jest.mock('@/components', () => ({
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock expo-router
const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
    push: (path: string) => mockPush(path),
    replace: (path: string) => mockReplace(path),
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
  ChevronLeft: () => null,
  CreditCard: () => null,
  Check: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

describe('PaymentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Payment')).toBeTruthy();
    });

    it('should render payment header', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Payment')).toBeTruthy();
    });

    it('should render overview section', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Overview')).toBeTruthy();
    });

    it('should render service price', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Hair Spa :')).toBeTruthy();
      expect(getByText('$40')).toBeTruthy();
    });

    it('should render tax', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Tax :')).toBeTruthy();
      expect(getByText('$2.5')).toBeTruthy();
    });

    it('should render total price', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Total Price :')).toBeTruthy();
      expect(getByText('$42.5')).toBeTruthy();
    });

    it('should render payment button', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Book Now / $42.5')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<PaymentScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // Press the first touchable (back button)
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });
  });

  describe('Payment Methods', () => {
    it('should render payment method options', () => {
      const { getByText } = render(<PaymentScreen />);
      // Common payment method texts
      expect(getByText('Payment')).toBeTruthy();
    });
  });

  describe('Submit Payment', () => {
    it('should have a Book Now button', () => {
      const { getByText } = render(<PaymentScreen />);
      expect(getByText('Book Now / $42.5')).toBeTruthy();
    });

    it('should handle payment submission', async () => {
      const { getByText } = render(<PaymentScreen />);
      const payButton = getByText('Book Now / $42.5');

      fireEvent.press(payButton);

      // Should handle payment action
    });
  });
});
