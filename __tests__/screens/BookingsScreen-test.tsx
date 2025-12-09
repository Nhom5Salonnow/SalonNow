import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BookingsScreen from '@/app/(tabs)/bookings';

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  router: {
    push: (path: string) => mockPush(path),
  },
}));

// Mock asyncStorage
const mockGetData = jest.fn();
jest.mock('@/utils/asyncStorage', () => ({
  STORAGE_KEYS: {
    USER_DATA: 'userData',
  },
  getData: (key: string) => mockGetData(key),
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
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
}));

jest.mock('@/components/ui', () => ({
  AppointmentCard: ({ item, onReviewPress }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID={`appointment-${item.id}`}>
        <Text>{item.serviceName}</Text>
        <TouchableOpacity testID={`review-btn-${item.id}`} onPress={() => onReviewPress(item)}>
          <Text>Review</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

describe('BookingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetData.mockResolvedValue(null);
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Appointment History')).toBeTruthy();
    });

    it('should render appointment history title', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Appointment History')).toBeTruthy();
    });

    it('should render default user name when no data in storage', () => {
      const { getByText } = render(<BookingsScreen />);
      expect(getByText('Default User')).toBeTruthy();
    });

    it('should render user name from storage', async () => {
      const userData = { name: 'John Doe', email: 'john@test.com' };
      mockGetData.mockResolvedValueOnce(JSON.stringify(userData));

      const { getByText } = render(<BookingsScreen />);

      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
      });
    });

    it('should render appointment cards', () => {
      const { getByTestId } = render(<BookingsScreen />);
      expect(getByTestId('appointment-1')).toBeTruthy();
      expect(getByTestId('appointment-2')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to feedback when pressing review on appointment without review', () => {
      const { getByTestId } = render(<BookingsScreen />);

      fireEvent.press(getByTestId('review-btn-1'));

      expect(mockPush).toHaveBeenCalledWith('/feedback');
    });

    it('should navigate to review when pressing review on appointment with review', () => {
      const { getByTestId } = render(<BookingsScreen />);

      fireEvent.press(getByTestId('review-btn-2'));

      expect(mockPush).toHaveBeenCalledWith('/review');
    });
  });

  describe('Data Loading', () => {
    it('should call getData on mount', async () => {
      render(<BookingsScreen />);

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledWith('userData');
      });
    });

    it('should handle error when loading user data', async () => {
      mockGetData.mockRejectedValueOnce(new Error('Load error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      render(<BookingsScreen />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });
});
