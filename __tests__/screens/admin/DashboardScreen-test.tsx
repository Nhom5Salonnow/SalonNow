import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminDashboardScreen from '@/app/admin/(tabs)/dashboard';

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
      500: '#6B7280',
      600: '#4B5563',
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  TrendingUp: () => null,
  TrendingDown: () => null,
  Calendar: () => null,
  DollarSign: () => null,
  Users: () => null,
  Star: () => null,
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
}));

describe('AdminDashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Salon Now Admin')).toBeTruthy();
    });

    it('should render welcome message', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Welcome back,')).toBeTruthy();
    });

    it('should render overview stats', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText("Today's Revenue")).toBeTruthy();
      expect(getByText('$1,250')).toBeTruthy();
      expect(getByText('Appointments')).toBeTruthy();
      expect(getByText('18')).toBeTruthy();
    });

    it('should render New Customers stat', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('New Customers')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
    });

    it('should render Average Rating stat', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Avg. Rating')).toBeTruthy();
      expect(getByText('4.8')).toBeTruthy();
    });

    it('should render Upcoming Appointments section', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Upcoming Appointments')).toBeTruthy();
    });

    it('should render View All button', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('View All')).toBeTruthy();
    });

    it('should render appointment items', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Sarah Johnson')).toBeTruthy();
      expect(getByText('Michael Brown')).toBeTruthy();
      expect(getByText('Lisa Wong')).toBeTruthy();
    });

    it('should render Revenue Overview section', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Revenue Overview')).toBeTruthy();
    });

    it('should render period tabs', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Daily')).toBeTruthy();
      expect(getByText('Weekly')).toBeTruthy();
      expect(getByText('Monthly')).toBeTruthy();
    });

    it('should render day labels for revenue chart', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Mon')).toBeTruthy();
      expect(getByText('Tue')).toBeTruthy();
      expect(getByText('Wed')).toBeTruthy();
      expect(getByText('Thu')).toBeTruthy();
      expect(getByText('Fri')).toBeTruthy();
      expect(getByText('Sat')).toBeTruthy();
      expect(getByText('Sun')).toBeTruthy();
    });
  });

  describe('Period Selection', () => {
    it('should default to Weekly period', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Weekly')).toBeTruthy();
    });

    it('should allow selecting Daily period', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      fireEvent.press(getByText('Daily'));
    });

    it('should allow selecting Monthly period', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      fireEvent.press(getByText('Monthly'));
    });
  });
});
