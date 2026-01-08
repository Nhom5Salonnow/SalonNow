import apiClient from './apiClient';
import { safeApiCall } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { WaitlistItem, CreateWaitlistRequest } from './types/waitlist.types';

/**
 * Waitlist API Service
 * Handles waitlist related API calls
 */
export const waitlistApi = {
  /**
   * Join waitlist
   */
  joinWaitlist: async (data: CreateWaitlistRequest): Promise<ApiResponse<WaitlistItem>> => {
    return safeApiCall(
      () => apiClient.post('/waitlist', data),
      {} as WaitlistItem
    );
  },

  /**
   * Get my waitlist
   */
  getMyWaitlist: async (): Promise<ApiResponse<WaitlistItem[]>> => {
    return safeApiCall(
      () => apiClient.get('/waitlist/my-list'),
      []
    );
  },

  /**
   * Get salon waitlist (for owners)
   */
  getSalonWaitlist: async (salonId: string): Promise<ApiResponse<WaitlistItem[]>> => {
    return safeApiCall(
      () => apiClient.get(`/waitlist/salon/${salonId}`),
      []
    );
  },

  /**
   * Leave waitlist
   */
  leaveWaitlist: async (waitlistId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/waitlist/${waitlistId}`),
      null
    );
  },
};
