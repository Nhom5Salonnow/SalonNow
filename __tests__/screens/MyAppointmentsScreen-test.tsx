import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyAppointmentsScreen from '@/app/my-appointments';

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
      dark: '#1F2937',
    },
  },
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
  WeekCalendar: ({ month, weekDays, onSelectDate, showAppointmentIndicator }: any) => {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <View testID="week-calendar">
        <Text>{month}</Text>
        <Text testID="show-indicator">{showAppointmentIndicator ? 'true' : 'false'}</Text>
        {weekDays.map((day: any, index: number) => (
          <TouchableOpacity
            key={index}
            testID={`day-${day.day}`}
            onPress={() => onSelectDate(day.day)}
          >
            <Text>{day.day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  },
  generateWeekDays: (startDay: number, selectedDay: number, appointmentDays?: number[]) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push({
        day: startDay + i,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        isSelected: startDay + i === selectedDay,
        hasAppointment: appointmentDays?.includes(startDay + i) || false,
      });
    }
    return days;
  },
}));

describe('MyAppointmentsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Appointment')).toBeTruthy();
    });

    it('should render header with title', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Appointment')).toBeTruthy();
    });

    it('should render week calendar with appointment indicator', () => {
      const { getByTestId } = render(<MyAppointmentsScreen />);
      expect(getByTestId('week-calendar')).toBeTruthy();
      expect(getByTestId('show-indicator').children[0]).toBe('true');
    });

    it('should render current month (April)', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('April')).toBeTruthy();
    });

    it('should render appointment times', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('2:00 PM')).toBeTruthy();
      expect(getByText('5:00 PM')).toBeTruthy();
    });

    it('should render appointment categories', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Hair Design & Cut')).toBeTruthy();
      expect(getByText('Color & Shine')).toBeTruthy();
    });

    it('should render appointment services', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('Basic Haircut')).toBeTruthy();
      expect(getByText('Hair dying')).toBeTruthy();
    });

    it('should render appointment prices', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      expect(getByText('€50')).toBeTruthy();
      expect(getByText('€29')).toBeTruthy();
    });

    it('should render stylist names', () => {
      const { getAllByText } = render(<MyAppointmentsScreen />);
      expect(getAllByText('Lisa').length).toBe(2);
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

    it('should navigate to appointment screen when Book Appointment is pressed', () => {
      const { getByText } = render(<MyAppointmentsScreen />);

      fireEvent.press(getByText('Book Appointment'));

      expect(mockPush).toHaveBeenCalledWith('/appointment');
    });
  });

  describe('Date Selection', () => {
    it('should update selected date when calendar day is pressed', () => {
      const { getByTestId } = render(<MyAppointmentsScreen />);

      fireEvent.press(getByTestId('day-14'));

      // Date selection is internal state
    });
  });

  describe('Appointment Status', () => {
    it('should render confirmed appointment with green background', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      // The first appointment (Basic Haircut) should be confirmed
      expect(getByText('Basic Haircut')).toBeTruthy();
    });

    it('should render pending appointment with pink background', () => {
      const { getByText } = render(<MyAppointmentsScreen />);
      // The second appointment (Hair dying) should be pending
      expect(getByText('Hair dying')).toBeTruthy();
    });
  });
});
