import apiClient from './apiClient';
import { safeApiCall, safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  AuthResponse,
  AuthUser,
  TokenResponse,
} from './types/auth.types';

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return safeApiCall(
      () => apiClient.post('/auth/login', data),
      { access_token: '', user: {} as AuthUser }
    );
  },

  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return safeApiCall(
      () => apiClient.post('/auth/register', data),
      { access_token: '', user: {} as AuthUser }
    );
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/logout'),
      null
    );
  },

  getMe: async (): Promise<ApiResponse<AuthUser>> => {
    return safeApiCallOptional(
      () => apiClient.get('/auth/me'),
      {} as AuthUser
    );
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<TokenResponse>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/refresh-token', { refreshToken }),
      { access_token: '' }
    );
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/change-password', data),
      null
    );
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/forgot-password', { email }),
      null
    );
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/reset-password', { token, newPassword }),
      null
    );
  },
};
