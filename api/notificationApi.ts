import apiClient from './apiClient';
import { safeApiCall, safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Notification, UnreadCountResponse } from './types/notification.types';

/**
 * Notification API Service
 * Handles notification related API calls
 */
export const notificationApi = {
  /**
   * Get notifications - AVAILABLE
   */
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    return safeApiCall(
      () => apiClient.get('/notifications'),
      []
    );
  },

  /**
   * Mark notification as read - AVAILABLE
   */
  markAsRead: async (notificationId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.patch(`/notifications/${notificationId}/read`),
      null
    );
  },

  /**
   * Get unread count - MAY NOT BE AVAILABLE
   */
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    return safeApiCallOptional(
      () => apiClient.get('/notifications/unread-count'),
      { count: 0 }
    );
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.patch('/notifications/read-all'),
      null
    );
  },

  /**
   * Delete notification - MAY NOT BE AVAILABLE
   */
  deleteNotification: async (notificationId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/notifications/${notificationId}`),
      null
    );
  },
};
