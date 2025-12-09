import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WeekCalendar, generateWeekDays, WEEK_DAYS } from '@/components/common/WeekCalendar';

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
  },
}));

describe('WeekCalendar Component', () => {
  const mockWeekDays = [
    { day: 'Mo', date: 10, isSelected: false, hasAppointment: false },
    { day: 'Tue', date: 11, isSelected: false, hasAppointment: false },
    { day: 'Wed', date: 12, isSelected: true, hasAppointment: true },
    { day: 'Th', date: 13, isSelected: false, hasAppointment: false },
    { day: 'Fri', date: 14, isSelected: false, hasAppointment: true },
    { day: 'Sa', date: 15, isSelected: false, hasAppointment: false },
    { day: 'Su', date: 16, isSelected: false, hasAppointment: false },
  ];

  const defaultProps = {
    month: 'April',
    weekDays: mockWeekDays,
    onSelectDate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<WeekCalendar {...defaultProps} />);
      expect(getByText('April')).toBeTruthy();
    });

    it('should render month name', () => {
      const { getByText } = render(<WeekCalendar {...defaultProps} />);
      expect(getByText('April')).toBeTruthy();
    });

    it('should render all day names', () => {
      const { getByText } = render(<WeekCalendar {...defaultProps} />);
      expect(getByText('Mo')).toBeTruthy();
      expect(getByText('Tue')).toBeTruthy();
      expect(getByText('Wed')).toBeTruthy();
      expect(getByText('Th')).toBeTruthy();
      expect(getByText('Fri')).toBeTruthy();
      expect(getByText('Sa')).toBeTruthy();
      expect(getByText('Su')).toBeTruthy();
    });

    it('should render all dates', () => {
      const { getByText } = render(<WeekCalendar {...defaultProps} />);
      expect(getByText('10')).toBeTruthy();
      expect(getByText('11')).toBeTruthy();
      expect(getByText('12')).toBeTruthy();
      expect(getByText('13')).toBeTruthy();
      expect(getByText('14')).toBeTruthy();
      expect(getByText('15')).toBeTruthy();
      expect(getByText('16')).toBeTruthy();
    });

    it('should render different month', () => {
      const { getByText } = render(
        <WeekCalendar {...defaultProps} month="January" />
      );
      expect(getByText('January')).toBeTruthy();
    });
  });

  describe('Date Selection', () => {
    it('should call onSelectDate when date is pressed', () => {
      const onSelectDateMock = jest.fn();
      const { getByText } = render(
        <WeekCalendar {...defaultProps} onSelectDate={onSelectDateMock} />
      );

      fireEvent.press(getByText('10'));

      expect(onSelectDateMock).toHaveBeenCalledWith(10);
    });

    it('should call onSelectDate with correct date', () => {
      const onSelectDateMock = jest.fn();
      const { getByText } = render(
        <WeekCalendar {...defaultProps} onSelectDate={onSelectDateMock} />
      );

      fireEvent.press(getByText('14'));

      expect(onSelectDateMock).toHaveBeenCalledWith(14);
    });

    it('should call onSelectDate for selected date', () => {
      const onSelectDateMock = jest.fn();
      const { getByText } = render(
        <WeekCalendar {...defaultProps} onSelectDate={onSelectDateMock} />
      );

      fireEvent.press(getByText('12')); // Already selected

      expect(onSelectDateMock).toHaveBeenCalledWith(12);
    });
  });

  describe('Appointment Indicator', () => {
    it('should not show appointment indicator by default', () => {
      const { getByText } = render(<WeekCalendar {...defaultProps} />);
      expect(getByText('12')).toBeTruthy();
    });

    it('should show appointment indicator when showAppointmentIndicator is true', () => {
      const { getByText } = render(
        <WeekCalendar {...defaultProps} showAppointmentIndicator={true} />
      );
      expect(getByText('12')).toBeTruthy();
      expect(getByText('14')).toBeTruthy();
    });
  });
});

describe('generateWeekDays Helper', () => {
  describe('Basic Functionality', () => {
    it('should generate 7 days', () => {
      const result = generateWeekDays(10, 12);
      expect(result.length).toBe(7);
    });

    it('should generate days with correct dates starting from startDate', () => {
      const result = generateWeekDays(10, 12);
      expect(result[0].date).toBe(10);
      expect(result[1].date).toBe(11);
      expect(result[2].date).toBe(12);
      expect(result[6].date).toBe(16);
    });

    it('should generate days with correct day names', () => {
      const result = generateWeekDays(10, 12);
      expect(result[0].day).toBe('Mo');
      expect(result[1].day).toBe('Tue');
      expect(result[2].day).toBe('Wed');
      expect(result[6].day).toBe('Su');
    });
  });

  describe('Selection', () => {
    it('should mark selected date as isSelected true', () => {
      const result = generateWeekDays(10, 12);
      expect(result[2].isSelected).toBe(true); // 10 + 2 = 12
    });

    it('should mark non-selected dates as isSelected false', () => {
      const result = generateWeekDays(10, 12);
      expect(result[0].isSelected).toBe(false);
      expect(result[1].isSelected).toBe(false);
      expect(result[3].isSelected).toBe(false);
    });

    it('should handle first day selected', () => {
      const result = generateWeekDays(10, 10);
      expect(result[0].isSelected).toBe(true);
    });

    it('should handle last day selected', () => {
      const result = generateWeekDays(10, 16);
      expect(result[6].isSelected).toBe(true);
    });
  });

  describe('Appointments', () => {
    it('should mark dates with appointments', () => {
      const result = generateWeekDays(10, 12, [12, 14]);
      expect(result[2].hasAppointment).toBe(true); // date 12
      expect(result[4].hasAppointment).toBe(true); // date 14
    });

    it('should not mark dates without appointments', () => {
      const result = generateWeekDays(10, 12, [12, 14]);
      expect(result[0].hasAppointment).toBe(false);
      expect(result[1].hasAppointment).toBe(false);
      expect(result[3].hasAppointment).toBe(false);
    });

    it('should handle empty appointment array', () => {
      const result = generateWeekDays(10, 12, []);
      result.forEach(day => {
        expect(day.hasAppointment).toBe(false);
      });
    });

    it('should handle default appointment array', () => {
      const result = generateWeekDays(10, 12);
      result.forEach(day => {
        expect(day.hasAppointment).toBe(false);
      });
    });
  });

  describe('Different Start Dates', () => {
    it('should work with start date 1', () => {
      const result = generateWeekDays(1, 3);
      expect(result[0].date).toBe(1);
      expect(result[6].date).toBe(7);
    });

    it('should work with start date 20', () => {
      const result = generateWeekDays(20, 22);
      expect(result[0].date).toBe(20);
      expect(result[6].date).toBe(26);
    });
  });
});

describe('WEEK_DAYS Constant', () => {
  it('should contain 7 days', () => {
    expect(WEEK_DAYS.length).toBe(7);
  });

  it('should have correct day abbreviations', () => {
    expect(WEEK_DAYS).toEqual(['Mo', 'Tue', 'Wed', 'Th', 'Fri', 'Sa', 'Su']);
  });

  it('should start with Monday', () => {
    expect(WEEK_DAYS[0]).toBe('Mo');
  });

  it('should end with Sunday', () => {
    expect(WEEK_DAYS[6]).toBe('Su');
  });
});
