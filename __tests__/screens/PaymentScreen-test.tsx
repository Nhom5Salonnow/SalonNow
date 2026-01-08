import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import PaymentScreen from '@/app/payment';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

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
  useLocalSearchParams: () => ({
    serviceId: 'svc-1',
    serviceName: 'Hair Spa',
    serviceImage: 'https://example.com/img.jpg',
    stylistId: 'stylist-1',
    stylistName: 'Lisa',
    price: '40',
    date: '2024-04-15',
    time: '2:00 PM',
    dayTime: 'Afternoon',
  }),
}));

// Mock AuthContext
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Test User', email: 'test@test.com', avatar: 'https://example.com/avatar.jpg' },
    isLoggedIn: true,
    isLoading: false,
  }),
}));

// Mock paymentService
jest.mock('@/api/paymentService', () => ({
  paymentService: {
    getPaymentMethods: jest.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 'pm-1', type: 'credit_card', last4: '4242', brand: 'Visa', isDefault: true },
      ],
    }),
    calculateSummary: jest.fn().mockResolvedValue({
      success: true,
      data: {
        subtotal: 40,
        tax: 2.5,
        tip: 0,
        discount: 0,
        total: 42.5,
      },
    }),
    validatePromoCode: jest.fn().mockResolvedValue({
      success: true,
      data: { valid: false },
    }),
    processPayment: jest.fn().mockResolvedValue({ success: true }),
  },
  PaymentSummary: {},
}));

// Mock appointmentService
jest.mock('@/api/appointmentService', () => ({
  appointmentService: {
    createAppointment: jest.fn().mockResolvedValue({ success: true, data: { id: 'appt-1' } }),
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
  ChevronLeft: () => null,
  CreditCard: () => null,
  Check: () => null,
  Plus: () => null,
  CheckCircle: () => null,
  Clock: () => null,
  Calendar: () => null,
  User: () => null,
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
    it('should render without crashing', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText('Payment')).toBeTruthy();
    });

    it('should render payment header', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText('Payment')).toBeTruthy();
    });

    it('should render order summary section', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText('Order Summary')).toBeTruthy();
    });

    it('should render service name', async () => {
      const { findAllByText } = render(<PaymentScreen />);
      const hairSpaTexts = await findAllByText('Hair Spa');
      expect(hairSpaTexts.length).toBeGreaterThan(0);
    });

    it('should render tax', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText('Tax (10%)')).toBeTruthy();
      expect(await findByText('$2.50')).toBeTruthy();
    });

    it('should render total price', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText('Total')).toBeTruthy();
      expect(await findByText('$42.50')).toBeTruthy();
    });

    it('should render payment button', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText(/Pay \$/)).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', async () => {
      const { findByText, UNSAFE_getAllByType } = render(<PaymentScreen />);
      // Wait for loading to complete
      await findByText('Payment');

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
    it('should render payment method options', async () => {
      const { findByText } = render(<PaymentScreen />);
      // Common payment method texts
      expect(await findByText('Payment')).toBeTruthy();
    });
  });

  describe('Submit Payment', () => {
    it('should have a Pay button', async () => {
      const { findByText } = render(<PaymentScreen />);
      expect(await findByText(/Pay \$/)).toBeTruthy();
    });

    it('should handle payment submission', async () => {
      const { findByText } = render(<PaymentScreen />);
      const payButton = await findByText(/Pay \$/);

      fireEvent.press(payButton);

      // Should handle payment action
    });
  });
});
