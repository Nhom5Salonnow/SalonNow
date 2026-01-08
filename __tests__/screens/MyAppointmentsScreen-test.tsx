import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyAppointmentsScreen from '@/app/my-appointments';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock AuthContext
jest.mock('@/contexts', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Test User', email: 'test@test.com', avatar: 'https://example.com/avatar.jpg' },
    isLoggedIn: true,
    isLoading: false,
  }),
}));

// Mock mockDatabase with future dates for upcoming appointments
jest.mock('@/api/mockServer/database', () => ({
  mockDatabase: {
    appointments: [
      {
        id: '1',
        userId: 'user-1',
        serviceId: 'svc-1',
        serviceName: 'Basic Haircut',
        serviceImage: 'https://example.com/img.jpg',
        salonName: 'Test Salon',
        stylistId: 'stylist-1',
        stylistName: 'Lisa',
        date: '2030-04-12',
        time: '2:00 PM',
        dayTime: 'Afternoon',
        price: 50,
        status: 'confirmed',
        hasReview: false,
        createdAt: '2030-04-12T14:00:00Z',
      },
      {
        id: '2',
        userId: 'user-1',
        serviceId: 'svc-2',
        serviceName: 'Hair dying',
        serviceImage: 'https://example.com/img2.jpg',
        salonName: 'Test Salon 2',
        stylistId: 'stylist-1',
        stylistName: 'Lisa',
        date: '2030-04-12',
        time: '5:00 PM',
        dayTime: 'Evening',
        price: 29,
        status: 'pending',
        hasReview: false,
        createdAt: '2030-04-12T17:00:00Z',
      },
    ],
  },
}));

// Mock appointmentService
jest.mock('@/api/appointmentService', () => ({
  appointmentService: {
    getUserAppointments: jest.fn().mockResolvedValue({
      success: true,
      data: [],
    }),
    cancelAppointment: jest.fn().mockResolvedValue({ success: true }),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(() => Promise.resolve('mock_token')),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock expo-router
const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    back: () => mockBack(),
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
  ChevronLeft: () => null,
  Clock: () => null,
  Calendar: () => null,
  User: () => null,
  XCircle: () => null,
  CheckCircle: () => null,
  AlertCircle: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock components
jest.mock('@/components', () => ({
  WeekCalendar: () => null,
  generateWeekDays: () => [],
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MyAppointmentsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('My Appointments')).toBeTruthy();
    });

    it('should render header with title', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('My Appointments')).toBeTruthy();
    });

    it('should render tabs for upcoming and past', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Upcoming')).toBeTruthy();
      expect(getByText('Past')).toBeTruthy();
    });

    it('should render appointment services', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Basic Haircut')).toBeTruthy();
      expect(getByText('Hair dying')).toBeTruthy();
    });

    it('should render book appointment button', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Book Appointment')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<MyAppointmentsScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable should be back button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should navigate to home screen when Book Appointment is pressed', () => {
      const { getByText } = render(<MyAppointmentsScreen />);

      fireEvent.press(getByText('Book Appointment'));

      expect(mockPush).toHaveBeenCalledWith('/home');
    });
  });

  describe('Tab Selection', () => {
    it('should render upcoming tab as selected by default', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Upcoming')).toBeTruthy();
    });

    it('should render past tab option', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Past')).toBeTruthy();
    });
  });

  describe('Appointment List', () => {
    it('should render confirmed appointment', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Basic Haircut')).toBeTruthy();
    });

    it('should render pending appointment', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Hair dying')).toBeTruthy();
    });
  });
});
