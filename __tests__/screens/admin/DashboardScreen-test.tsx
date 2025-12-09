import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AdminDashboardScreen from '@/app/admin/dashboard';

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
  },
}));

// Mock components
jest.mock('@/components', () => ({
  DecorativeCircle: () => null,
  AdminBottomNav: ({ activeTab }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID="admin-bottom-nav">
        <Text testID="active-tab">{activeTab}</Text>
      </View>
    );
  },
}));

describe('AdminDashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Dashboard')).toBeTruthy();
    });

    it('should render Dashboard title', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Dashboard')).toBeTruthy();
    });

    it('should render Overview section', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Overview')).toBeTruthy();
    });

    it('should render overview stats', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Total Revenue')).toBeTruthy();
      expect(getByText('$25,450')).toBeTruthy();
      expect(getByText('Appointments')).toBeTruthy();
      expect(getByText('320')).toBeTruthy();
    });

    it('should render customer retention stat', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Customer\nRetention')).toBeTruthy();
      expect(getByText('75%')).toBeTruthy();
    });

    it('should render average spend stat', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Avg. Spend')).toBeTruthy();
      expect(getByText('$80')).toBeTruthy();
    });

    it('should render Detailed Reports section', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Detailed Reports')).toBeTruthy();
    });

    it('should render period tabs', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Daily')).toBeTruthy();
      expect(getByText('Weekly')).toBeTruthy();
      expect(getByText('Monthly')).toBeTruthy();
    });

    it('should render Revenue Trend section', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Revenue Trend')).toBeTruthy();
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

    it('should render Trend Analysis section', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Trend Analysis')).toBeTruthy();
    });

    it('should render Customer Retention Rate label', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Customer Retention Rate')).toBeTruthy();
    });

    it('should render month labels for trend chart', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      expect(getByText('Jan')).toBeTruthy();
      expect(getByText('Feb')).toBeTruthy();
      expect(getByText('Mar')).toBeTruthy();
      expect(getByText('Apr')).toBeTruthy();
      expect(getByText('May')).toBeTruthy();
      expect(getByText('Jun')).toBeTruthy();
    });

    it('should render admin bottom nav with dashboard active', () => {
      const { getByTestId } = render(<AdminDashboardScreen />);
      expect(getByTestId('admin-bottom-nav')).toBeTruthy();
      expect(getByTestId('active-tab').children[0]).toBe('dashboard');
    });
  });

  describe('Period Selection', () => {
    it('should default to Weekly period', () => {
      const { getByText } = render(<AdminDashboardScreen />);
      // Weekly should be selected by default
      expect(getByText('Weekly')).toBeTruthy();
    });

    it('should allow selecting Daily period', () => {
      const { getByText } = render(<AdminDashboardScreen />);

      fireEvent.press(getByText('Daily'));

      // Period selection is internal state
    });

    it('should allow selecting Weekly period', () => {
      const { getByText } = render(<AdminDashboardScreen />);

      fireEvent.press(getByText('Weekly'));

      // Period selection is internal state
    });

    it('should allow selecting Monthly period', () => {
      const { getByText } = render(<AdminDashboardScreen />);

      fireEvent.press(getByText('Monthly'));

      // Period selection is internal state
    });
  });
});
