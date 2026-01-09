import apiClient from './apiClient';
import { safeApiCall } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { User, UpdateUserRequest, CreateUserRequest } from './types/user.types';

export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return safeApiCall(
      () => apiClient.get('/users'),
      []
    );
  },

  getUserById: async (userId: string): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.get(`/users/${userId}`),
      {} as User
    );
  },

  createUser: async (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.post('/users', data),
      {} as User
    );
  },

  updateUser: async (userId: string, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.patch(`/users/${userId}`, data),
      {} as User
    );
  },

  deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/users/${userId}`),
      null
    );
  },

  bulkCreateUsers: async (users: CreateUserRequest[]): Promise<ApiResponse<User[]>> => {
    return safeApiCall(
      () => apiClient.post('/users/bulk', users),
      []
    );
  },

  updateProfile: async (data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return safeApiCall(
      () => apiClient.patch('/users/profile', data),
      {} as User
    );
  },
};
