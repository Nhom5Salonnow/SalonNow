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

  /**
   * Get single waitlist entry
   */
  getWaitlistEntry: async (id: string): Promise<ApiResponse<WaitlistItem>> => {
    return safeApiCall(
      () => apiClient.get(`/waitlist/${id}`),
      {} as WaitlistItem
    );
  },

  /**
   * Cancel/leave waitlist (alias for leaveWaitlist)
   */
  cancelWaitlist: async (id: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/waitlist/${id}`),
      null
    );
  },

  /**
   * Confirm available slot
   */
  confirmSlot: async (waitlistId: string): Promise<ApiResponse<WaitlistItem>> => {
    return safeApiCall(
      () => apiClient.post(`/waitlist/${waitlistId}/confirm`),
      {} as WaitlistItem
    );
  },

  /**
   * Skip available slot (stay on waitlist)
   */
  skipSlot: async (waitlistId: string): Promise<ApiResponse<WaitlistItem>> => {
    return safeApiCall(
      () => apiClient.post(`/waitlist/${waitlistId}/skip`),
      {} as WaitlistItem
    );
  },

  /**
   * Admin: Get all waitlist entries
   */
  getAdminWaitlist: async (): Promise<ApiResponse<WaitlistItem[]>> => {
    return safeApiCall(
      () => apiClient.get('/waitlist/admin/all'),
      []
    );
  },

  /**
   * Admin: Trigger slot available notification
   */
  triggerSlotAvailable: async (
    waitlistId: string,
    date: string,
    time: string
  ): Promise<ApiResponse<WaitlistItem>> => {
    return safeApiCall(
      () => apiClient.post(`/waitlist/${waitlistId}/trigger-slot`, { date, time }),
      {} as WaitlistItem
    );
  },
};
