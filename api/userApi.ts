import apiClient from './apiClient';
import { safeApiCall } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { User, UpdateUserRequest, CreateUserRequest } from './types/user.types';

/**
 * User API Service
 * Handles user related API calls
 */
export const userApi = {
  /**
   * Get all users
   */
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return safeApiCall(
      () => apiClient.get('/users'),
      []
    );
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.get(`/users/${userId}`),
      {} as User
    );
  },

  /**
   * Create user
   */
  createUser: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.post('/users', data),
      {} as User
    );
  },

  /**
   * Update user
   */
  updateUser: async (userId: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.patch(`/users/${userId}`, data),
      {} as User
    );
  },

  /**
   * Delete user
   */
  deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/users/${userId}`),
      null
    );
  },

  /**
   * Bulk create users
   */
  bulkCreateUsers: async (users: CreateUserRequest[]): Promise<ApiResponse<User[]>> => {
    return safeApiCall(
      () => apiClient.post('/users/bulk', users),
      []
    );
  },

  /**
   * Update current user's profile
   */
  updateProfile: async (data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.patch('/users/profile', data),
      {} as User
    );
  },
};
