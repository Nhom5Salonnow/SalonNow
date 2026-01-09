import apiClient from './apiClient';
import { safeApiCall, safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Notification, UnreadCountResponse } from './types/notification.types';

export const notificationApi = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    return safeApiCall(
      () => apiClient.get('/notifications'),
      []
    );
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.patch(`/notifications/${notificationId}/read`),
      null
    );
  },

  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResponse>> => {
    return safeApiCallOptional(
      () => apiClient.get('/notifications/unread-count'),
      { count: 0 }
    );
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.patch('/notifications/read-all'),
      null
    );
  },

  deleteNotification: async (notificationId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/notifications/${notificationId}`),
      null
    );
  },

  deleteAllNotifications: async (): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete('/notifications'),
      null
    );
  },
};
