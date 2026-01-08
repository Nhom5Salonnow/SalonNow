import apiClient from './apiClient';
import { safeApiCall, safeApiCallOptional } from './apiHelper';
import { ApiResponse, PaginatedResponse } from './types/common.types';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  UpdateBookingStatusRequest,
  BookingSearchParams,
} from './types/booking.types';

/**
 * Booking API Service
 * Handles booking related API calls
 */
export const bookingApi = {
  /**
   * Create booking - AVAILABLE
   */
  createBooking: async (data: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
    return safeApiCall(
      () => apiClient.post('/bookings', data),
      {} as Booking
    );
  },

  /**
   * Get my bookings - AVAILABLE
   */
  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return safeApiCall(
      () => apiClient.get('/bookings/my-bookings'),
      []
    );
  },

  /**
   * Cancel booking - AVAILABLE
   * Uses DELETE /bookings/:id
   */
  cancelBooking: async (bookingId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/bookings/${bookingId}`),
      null
    );
  },

  /**
   * Get booking by ID - MAY NOT BE AVAILABLE
   */
  getBookingById: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/bookings/${bookingId}`),
      {} as Booking
    );
  },

  /**
   * Update booking - MAY NOT BE AVAILABLE
   */
  updateBooking: async (bookingId: string, data: UpdateBookingRequest): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/bookings/${bookingId}`, data),
      {} as Booking
    );
  },

  /**
   * Update booking status (for salon owners) - MAY NOT BE AVAILABLE
   */
  updateBookingStatus: async (
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/bookings/${bookingId}/status`, data),
      {} as Booking
    );
  },

  /**
   * Get bookings by salon (for salon owners) - MAY NOT BE AVAILABLE
   */
  getBookingsBySalon: async (
    salonId: string,
    params?: BookingSearchParams
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/bookings/salon/${salonId}`, { params }),
      { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    );
  },

  /**
   * Get booking history - MAY NOT BE AVAILABLE
   */
  getBookingHistory: async (params?: BookingSearchParams): Promise<ApiResponse<Booking[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/bookings/history', { params }),
      []
    );
  },

  /**
   * Reschedule booking - MAY NOT BE AVAILABLE
   */
  rescheduleBooking: async (bookingId: string, data: { newDate: string; newTime: string; reason?: string }): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/bookings/${bookingId}/reschedule`, data),
      {} as Booking
    );
  },
};
