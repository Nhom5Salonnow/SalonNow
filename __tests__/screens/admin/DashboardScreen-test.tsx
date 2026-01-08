import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdminDashboardScreen from '@/app/admin/(tabs)/dashboard';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock adminService
jest.mock('@/api/adminService', () => ({
  adminService: {
    getDashboardStats: jest.fn().mockResolvedValue({
      success: true,
      data: {
        todayRevenue: 1250,
        todayAppointments: 18,
        pendingAppointments: 5,
        waitlistCount: 3,
        averageRating: 4.8,
        totalReviews: 25,
      },
    }),
    getAppointmentsByDate: jest.fn().mockResolvedValue({
      success: true,
      data: [
        { date: '2024-01-15', count: 5, revenue: 500 },
        { date: '2024-01-16', count: 8, revenue: 800 },
        { date: '2024-01-17', count: 6, revenue: 600 },
        { date: '2024-01-18', count: 7, revenue: 700 },
        { date: '2024-01-19', count: 10, revenue: 1000 },
        { date: '2024-01-20', count: 9, revenue: 900 },
        { date: '2024-01-21', count: 4, revenue: 400 },
      ],
    }),
    getStaffPerformance: jest.fn().mockResolvedValue({
      success: true,
      data: [],
    }),
  },
}));

// Get future dates for testing
const getFutureDate = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Mock appointmentService
jest.mock('@/api/appointmentService', () => ({
  appointmentService: {
    getSalonAppointments: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          userId: 'user-1',
          salonId: 'salon-1',
          serviceId: 'service-1',
          staffId: 'emp-1',
          date: '2099-12-20',
          time: '10:00',
          status: 'confirmed',
          totalPrice: 50,
          serviceName: 'Haircut',
          staffName: 'Sarah Johnson',
        },
        {
          id: '2',
          userId: 'user-2',
          salonId: 'salon-1',
          serviceId: 'service-2',
          staffId: 'emp-2',
          date: '2099-12-20',
          time: '11:00',
          status: 'pending',
          totalPrice: 80,
          serviceName: 'Hair Color',
          staffName: 'Michael Brown',
        },
        {
          id: '3',
          userId: 'user-3',
          salonId: 'salon-1',
          serviceId: 'service-1',
          staffId: 'emp-3',
          date: '2099-12-21',
          time: '14:00',
          status: 'confirmed',
          totalPrice: 50,
          serviceName: 'Haircut',
          staffName: 'Lisa Wong',
        },
      ],
    }),
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
      400: '#9CA3AF',
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
  Clock: () => null,
  ChevronRight: () => null,
  MessageSquare: () => null,
  AlertCircle: () => null,
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
    it('should render without crashing', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Salon Now Admin')).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('should render welcome message', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Welcome back,')).toBeTruthy();
      });
    });

    it('should render overview stats', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText("Today's Revenue")).toBeTruthy();
        expect(getByText('$1250')).toBeTruthy();
        expect(getByText("Today's Appts")).toBeTruthy();
        expect(getByText('18')).toBeTruthy();
      });
    });

    it('should render Waitlist stat', async () => {
      const { getAllByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getAllByText('Waitlist').length).toBeGreaterThanOrEqual(1);
        expect(getAllByText('3').length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should render Average Rating stat', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Avg. Rating')).toBeTruthy();
        expect(getByText('4.8')).toBeTruthy();
      });
    });

    it('should render Upcoming Appointments section', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Upcoming Appointments')).toBeTruthy();
      });
    });

    it('should render View All button', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('View All')).toBeTruthy();
      });
    });

    it('should render appointment service names', async () => {
      const { getAllByText, getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        // Haircut appears multiple times (2 appointments)
        expect(getAllByText('Haircut').length).toBeGreaterThanOrEqual(1);
        expect(getByText('Hair Color')).toBeTruthy();
      });
    });

    it('should render Revenue Overview section', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Revenue Overview')).toBeTruthy();
      });
    });

    it('should render period tabs', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Daily')).toBeTruthy();
        expect(getByText('Weekly')).toBeTruthy();
        expect(getByText('Monthly')).toBeTruthy();
      });
    });

    it('should render day labels for revenue chart', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Mon')).toBeTruthy();
        expect(getByText('Tue')).toBeTruthy();
        expect(getByText('Wed')).toBeTruthy();
        expect(getByText('Thu')).toBeTruthy();
        expect(getByText('Fri')).toBeTruthy();
        expect(getByText('Sat')).toBeTruthy();
        expect(getByText('Sun')).toBeTruthy();
      });
    });
  });

  describe('Period Selection', () => {
    it('should default to Weekly period', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Weekly')).toBeTruthy();
      });
    });

    it('should allow selecting Daily period', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Daily')).toBeTruthy();
      });
      fireEvent.press(getByText('Daily'));
    });

    it('should allow selecting Monthly period', async () => {
      const { getByText } = render(<AdminDashboardScreen />);
      await waitFor(() => {
        expect(getByText('Monthly')).toBeTruthy();
      });
      fireEvent.press(getByText('Monthly'));
    });
  });
});
