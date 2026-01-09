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

export const bookingApi = {
  createBooking: async (data: CreateBookingRequest): Promise<ApiResponse<Booking>> => {
    return safeApiCall(
      () => apiClient.post('/bookings', data),
      {} as Booking
    );
  },

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return safeApiCall(
      () => apiClient.get('/bookings/my-bookings'),
      []
    );
  },

  cancelBooking: async (bookingId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/bookings/${bookingId}`),
      null
    );
  },

  getBookingById: async (bookingId: string): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/bookings/${bookingId}`),
      {} as Booking
    );
  },

  updateBooking: async (bookingId: string, data: UpdateBookingRequest): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/bookings/${bookingId}`, data),
      {} as Booking
    );
  },

  updateBookingStatus: async (
    bookingId: string,
    data: UpdateBookingStatusRequest
  ): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/bookings/${bookingId}/status`, data),
      {} as Booking
    );
  },

  getBookingsBySalon: async (
    salonId: string,
    params?: BookingSearchParams
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/bookings/salon/${salonId}`, { params }),
      { items: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
    );
  },

  getBookingHistory: async (params?: BookingSearchParams): Promise<ApiResponse<Booking[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/bookings/history', { params }),
      []
    );
  },

  rescheduleBooking: async (bookingId: string, data: { newDate: string; newTime: string; reason?: string }): Promise<ApiResponse<Booking>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/bookings/${bookingId}/reschedule`, data),
      {} as Booking
    );
  },
};
