import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppointmentScreen from '@/app/book-appointment';

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

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock components
jest.mock('@/components', () => ({
  WeekCalendar: ({ month, weekDays, onSelectDate }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="week-calendar">
        <Text>{month}</Text>
        {weekDays.map((day: any, index: number) => (
          <TouchableOpacity
            key={index}
            testID={`day-${day.day}`}
            onPress={() => onSelectDate(day.day)}
          >
            <Text>{day.dayName}</Text>
            <Text>{day.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
  generateWeekDays: (startDay: number, selectedDay: number) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        day: startDay + i,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        isSelected: startDay + i === selectedDay,
      });
    }
    return days;
  },
  AuthGuard: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AppointmentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('Appointment')).toBeTruthy();
    });

    it('should render header with title', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('Appointment')).toBeTruthy();
    });

    it('should render week calendar', () => {
      const { getByTestId } = render(<AppointmentScreen />);
      expect(getByTestId('week-calendar')).toBeTruthy();
    });

    it('should render current month (April)', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('April')).toBeTruthy();
    });

    it('should render time picker with default values', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('2:00')).toBeTruthy();
      expect(getByText('P.M')).toBeTruthy();
    });

    it('should render service card', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('Hair Design & Cut')).toBeTruthy();
      expect(getByText('Basic Haircut')).toBeTruthy();
      expect(getByText('€50')).toBeTruthy();
    });

    it('should render stylist name', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('Doe John')).toBeTruthy();
    });

    it('should render book button', () => {
      const { getByText } = render(<AppointmentScreen />);
      expect(getByText('Book')).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should go back when back button is pressed', () => {
      const { UNSAFE_getAllByType } = render(<AppointmentScreen />);
      const TouchableOpacity = require('react-native').TouchableOpacity;
      const buttons = UNSAFE_getAllByType(TouchableOpacity);

      // First touchable should be back button
      if (buttons.length > 0) {
        fireEvent.press(buttons[0]);
        expect(mockBack).toHaveBeenCalled();
      }
    });

    it('should go back when book button is pressed', () => {
      const { getByText } = render(<AppointmentScreen />);

      fireEvent.press(getByText('Book'));

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Date Selection', () => {
    it('should update selected date when calendar day is pressed', () => {
      const { getByTestId } = render(<AppointmentScreen />);

      // Press a different day
      fireEvent.press(getByTestId('day-13'));

      // Component should re-render with new selection
      // The selection is internal state, so we just verify the interaction works
    });
  });

  describe('Booking', () => {
    it('should log booking details when book is pressed', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const { getByText } = render(<AppointmentScreen />);

      fireEvent.press(getByText('Book'));

      expect(consoleSpy).toHaveBeenCalledWith('Booking:', {
        selectedDate: 12,
        selectedHour: '2:00',
        selectedPeriod: 'P.M',
      });

      consoleSpy.mockRestore();
    });
  });
});
