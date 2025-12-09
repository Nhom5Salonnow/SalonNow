import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppointmentCard } from '@/components/ui/AppointmentCard';

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
      dark: '#1F2937',
    },
    gray: {
      100: '#F3F4F6',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
    },
  },
}));

describe('AppointmentCard', () => {
  const mockAppointment = {
    id: '1',
    service: 'Haircut',
    stylist: 'John Doe',
    price: 50,
    date: 'Mon, 15 Jan',
    dayTime: 'Morning',
    time: '10:00 AM',
    hasReview: false,
  };

  const mockAppointmentWithReview = {
    ...mockAppointment,
    hasReview: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(<AppointmentCard item={mockAppointment} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render service name', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText('Haircut')).toBeTruthy();
    });

    it('should render stylist name', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText('Hair stylish : John Doe')).toBeTruthy();
    });

    it('should render price', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText('Price of Service : $50')).toBeTruthy();
    });

    it('should render date', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText('Mon, 15 Jan')).toBeTruthy();
    });

    it('should render time with "at" prefix', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText('at 10:00 AM')).toBeTruthy();
    });

    it('should render day time', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText(/Morning/)).toBeTruthy();
    });
  });

  describe('Review Button', () => {
    it('should render "Review" text when hasReview is false', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(getByText('Review')).toBeTruthy();
    });

    it('should render "View review" text when hasReview is true', () => {
      const { getByText } = render(
        <AppointmentCard item={mockAppointmentWithReview} />
      );
      expect(getByText('View review')).toBeTruthy();
    });

    it('should call onReviewPress when review button is pressed', () => {
      const onReviewPress = jest.fn();
      const { getByText } = render(
        <AppointmentCard item={mockAppointment} onReviewPress={onReviewPress} />
      );

      fireEvent.press(getByText('Review'));
      expect(onReviewPress).toHaveBeenCalledWith(mockAppointment);
    });

    it('should call onReviewPress with item when view review is pressed', () => {
      const onReviewPress = jest.fn();
      const { getByText } = render(
        <AppointmentCard
          item={mockAppointmentWithReview}
          onReviewPress={onReviewPress}
        />
      );

      fireEvent.press(getByText('View review'));
      expect(onReviewPress).toHaveBeenCalledWith(mockAppointmentWithReview);
    });

    it('should not throw when onReviewPress is not provided', () => {
      const { getByText } = render(<AppointmentCard item={mockAppointment} />);
      expect(() => fireEvent.press(getByText('Review'))).not.toThrow();
    });
  });
});
