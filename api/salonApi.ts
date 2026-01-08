import apiClient from './apiClient';
import { safeApiCall } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Salon, CreateSalonRequest, UpdateSalonRequest, SalonSearchParams } from './types/salon.types';

/**
 * Salon API Service
 * Handles salon related API calls
 */
export const salonApi = {
  /**
   * Get salons list with optional search - AVAILABLE
   */
  getSalons: async (params?: SalonSearchParams): Promise<ApiResponse<Salon[]>> => {
    return safeApiCall(
      () => apiClient.get('/salons', { params }),
      []
    );
  },

  /**
   * Get salon by ID - AVAILABLE
   */
  getSalonById: async (salonId: string): Promise<ApiResponse<Salon>> => {
    return safeApiCall(
      () => apiClient.get(`/salons/${salonId}`),
      {} as Salon
    );
  },

  /**
   * Get my salons (for salon owners) - AVAILABLE
   */
  getMySalons: async (): Promise<ApiResponse<Salon[]>> => {
    return safeApiCall(
      () => apiClient.get('/salons/my-salons'),
      []
    );
  },

  /**
   * Create salon - AVAILABLE
   */
  createSalon: async (data: CreateSalonRequest): Promise<ApiResponse<Salon>> => {
    return safeApiCall(
      () => apiClient.post('/salons', data),
      {} as Salon
    );
  },

  /**
   * Update salon - AVAILABLE
   */
  updateSalon: async (salonId: string, data: UpdateSalonRequest): Promise<ApiResponse<Salon>> => {
    return safeApiCall(
      () => apiClient.patch(`/salons/${salonId}`, data),
      {} as Salon
    );
  },

  /**
   * Delete salon - AVAILABLE
   */
  deleteSalon: async (salonId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/salons/${salonId}`),
      null
    );
  },
};
