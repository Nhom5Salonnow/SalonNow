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

/**
 * Auth API Service
 * Handles authentication related API calls
 */
export const authApi = {
  /**
   * Login - AVAILABLE
   */
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return safeApiCall(
      () => apiClient.post('/auth/login', data),
      { access_token: '', user: {} as AuthUser }
    );
  },

  /**
   * Register - MAY NOT BE AVAILABLE YET
   * Will gracefully fail if endpoint doesn't exist
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/register', data),
      { access_token: '', user: {} as AuthUser }
    );
  },

  /**
   * Logout - MAY NOT BE AVAILABLE YET
   */
  logout: async (): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/logout'),
      null
    );
  },

  /**
   * Get current user - MAY NOT BE AVAILABLE YET
   */
  getMe: async (): Promise<ApiResponse<AuthUser>> => {
    return safeApiCallOptional(
      () => apiClient.get('/auth/me'),
      {} as AuthUser
    );
  },

  /**
   * Refresh token - MAY NOT BE AVAILABLE YET
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<TokenResponse>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/refresh-token', { refreshToken }),
      { access_token: '' }
    );
  },

  /**
   * Change password - MAY NOT BE AVAILABLE YET
   */
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/change-password', data),
      null
    );
  },

  /**
   * Forgot password - MAY NOT BE AVAILABLE YET
   */
  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/forgot-password', { email }),
      null
    );
  },

  /**
   * Reset password - MAY NOT BE AVAILABLE YET
   */
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post('/auth/reset-password', { token, newPassword }),
      null
    );
  },
};
