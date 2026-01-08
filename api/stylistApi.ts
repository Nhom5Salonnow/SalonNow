import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import {
  Stylist,
  CreateStylistRequest,
  UpdateStylistRequest,
  SetScheduleRequest,
  StylistAvailability,
  StylistSearchParams,
  AvailabilityParams,
  StylistSchedule,
} from './types/stylist.types';

/**
 * Stylist API Service
 * ALL ENDPOINTS MAY NOT BE AVAILABLE YET
 * Will gracefully fail without crashing
 */
export const stylistApi = {
  /**
   * Get all stylists
   */
  getStylists: async (params?: StylistSearchParams): Promise<ApiResponse<Stylist[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/stylists', { params }),
      []
    );
  },

  /**
   * Get stylist by ID
   */
  getStylistById: async (stylistId: string): Promise<ApiResponse<Stylist>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/${stylistId}`),
      {} as Stylist
    );
  },

  /**
   * Get stylists by salon
   */
  getStylistsBySalon: async (salonId: string, params?: StylistSearchParams): Promise<ApiResponse<Stylist[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/salon/${salonId}`, { params }),
      []
    );
  },

  /**
   * Create stylist (salon owner)
   */
  createStylist: async (data: CreateStylistRequest): Promise<ApiResponse<Stylist>> => {
    return safeApiCallOptional(
      () => apiClient.post('/stylists', data),
      {} as Stylist
    );
  },

  /**
   * Update stylist (salon owner)
   */
  updateStylist: async (stylistId: string, data: UpdateStylistRequest): Promise<ApiResponse<Stylist>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/stylists/${stylistId}`, data),
      {} as Stylist
    );
  },

  /**
   * Delete stylist (salon owner)
   */
  deleteStylist: async (stylistId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/stylists/${stylistId}`),
      null
    );
  },

  /**
   * Get stylist availability
   */
  getStylistAvailability: async (
    stylistId: string,
    params: AvailabilityParams
  ): Promise<ApiResponse<StylistAvailability>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/${stylistId}/availability`, { params }),
      {
        stylistId,
        date: params.date,
        slots: [],
      }
    );
  },

  /**
   * Get stylist schedule
   */
  getStylistSchedule: async (stylistId: string): Promise<ApiResponse<StylistSchedule[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/${stylistId}/schedule`),
      []
    );
  },

  /**
   * Set stylist schedule (salon owner)
   */
  setStylistSchedule: async (stylistId: string, data: SetScheduleRequest): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/stylists/${stylistId}/schedule`, data),
      null
    );
  },
};
