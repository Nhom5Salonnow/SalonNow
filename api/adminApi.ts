import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';

/**
 * Admin Dashboard Types
 */
export interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalCustomers: number;
  totalServices: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  averageRating: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface BookingTrend {
  date: string;
  count: number;
}

export interface TopService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  revenue: number;
}

export interface TopStylist {
  stylistId: string;
  stylistName: string;
  bookingCount: number;
  averageRating: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  revenueByDay: RevenueData[];
  bookingTrends: BookingTrend[];
  topServices: TopService[];
  topStylists: TopStylist[];
}

/**
 * Admin API Service
 * ALL ENDPOINTS MAY NOT BE AVAILABLE YET
 * Will gracefully fail without crashing
 */
export const adminApi = {
  /**
   * Get dashboard overview
   */
  getDashboardOverview: async (): Promise<ApiResponse<DashboardOverview>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/dashboard'),
      {
        stats: {
          totalBookings: 0,
          totalRevenue: 0,
          totalCustomers: 0,
          totalServices: 0,
          pendingBookings: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          averageRating: 0,
        },
        revenueByDay: [],
        bookingTrends: [],
        topServices: [],
        topStylists: [],
      }
    );
  },

  /**
   * Get dashboard stats
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/dashboard/stats'),
      {
        totalBookings: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalServices: 0,
        pendingBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        averageRating: 0,
      }
    );
  },

  /**
   * Get revenue report
   */
  getRevenueReport: async (params?: {
    startDate?: string;
    endDate?: string;
    period?: 'day' | 'week' | 'month' | 'year';
  }): Promise<ApiResponse<RevenueData[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/dashboard/revenue', { params }),
      []
    );
  },

  /**
   * Get booking trends
   */
  getBookingTrends: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<BookingTrend[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/dashboard/bookings', { params }),
      []
    );
  },

  /**
   * Get top services
   */
  getTopServices: async (limit?: number): Promise<ApiResponse<TopService[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/reports/top-services', { params: { limit } }),
      []
    );
  },

  /**
   * Get top stylists
   */
  getTopStylists: async (limit?: number): Promise<ApiResponse<TopStylist[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/reports/top-stylists', { params: { limit } }),
      []
    );
  },

  /**
   * Get all bookings (admin view)
   */
  getAllBookings: async (params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/bookings', { params }),
      []
    );
  },

  /**
   * Update booking status (admin)
   */
  updateBookingStatus: async (
    bookingId: string,
    status: string
  ): Promise<ApiResponse<any>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/admin/bookings/${bookingId}/status`, { status }),
      {}
    );
  },

  /**
   * Get all users (admin)
   */
  getAllUsers: async (params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/admin/users', { params }),
      []
    );
  },

  /**
   * Update user role (admin)
   */
  updateUserRole: async (
    userId: string,
    role: string
  ): Promise<ApiResponse<any>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/admin/users/${userId}/role`, { role }),
      {}
    );
  },
};
