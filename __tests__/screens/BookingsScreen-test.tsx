import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BookingsScreen from '@/app/(tabs)/bookings';

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
        serviceName: 'Haircut',
        serviceImage: 'https://example.com/img.jpg',
        salonName: 'Test Salon',
        stylistId: 'stylist-1',
        stylistName: 'Doe John',
        date: '2030-01-15',
        time: '10:00 AM',
        dayTime: 'Morning',
        price: 50,
        status: 'confirmed',
        hasReview: false,
        createdAt: '2030-01-15T10:00:00Z',
      },
      {
        id: '2',
        userId: 'user-1',
        serviceId: 'svc-2',
        serviceName: 'Color',
        serviceImage: 'https://example.com/img2.jpg',
        salonName: 'Test Salon 2',
        stylistId: 'stylist-2',
        stylistName: 'Jane Doe',
        date: '2030-01-10',
        time: '2:00 PM',
        dayTime: 'Afternoon',
        price: 80,
        status: 'pending',
        hasReview: false,
        createdAt: '2030-01-10T14:00:00Z',
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
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
  },
}));

// Mock asyncStorage (unused but may be required by component)
jest.mock('@/utils/asyncStorage', () => ({
  STORAGE_KEYS: {
    USER_DATA: 'userData',
  },
  getData: jest.fn().mockResolvedValue(null),
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
  APPOINTMENT_HISTORY: [
    {
      id: '1',
      serviceName: 'Haircut',
      salonName: 'Test Salon',
      date: '2024-01-15',
      time: '10:00 AM',
      price: 50,
      status: 'completed',
      hasReview: false,
    },
    {
      id: '2',
      serviceName: 'Color',
      salonName: 'Test Salon 2',
      date: '2024-01-10',
      time: '2:00 PM',
      price: 80,
      status: 'completed',
      hasReview: true,
    },
  ],
  DEFAULT_USER: {
    name: 'Default User',
    avatar: 'https://example.com/avatar.jpg',
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Menu: () => null,
  Calendar: () => null,
  Clock: () => null,
  User: () => null,
  Star: () => null,
  CheckCircle: () => null,
  XCircle: () => null,
  AlertCircle: () => null,
  ChevronRight: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/components/ui', () => ({
  AppointmentCard: ({ item }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>{item.serviceName}</Text>
      </View>
    );
  },
}));

describe('BookingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('My Appointments')).toBeTruthy();
    });

    it('should render title', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('My Appointments')).toBeTruthy();
    });

    it('should render tabs for upcoming and past', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Upcoming')).toBeTruthy();
      expect(getByText('Past')).toBeTruthy();
    });

    it('should render appointment services', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Haircut')).toBeTruthy();
      expect(getByText('Color')).toBeTruthy();
    });
  });

  describe('Tab Selection', () => {
    it('should render upcoming tab by default', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Upcoming')).toBeTruthy();
    });

    it('should render past tab option', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Past')).toBeTruthy();
    });
  });
});
