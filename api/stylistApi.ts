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

export const stylistApi = {
  getStylists: async (params?: StylistSearchParams): Promise<ApiResponse<Stylist[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/stylists', { params }),
      []
    );
  },

  getStylistById: async (stylistId: string): Promise<ApiResponse<Stylist>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/${stylistId}`),
      {} as Stylist
    );
  },

  getStylistsBySalon: async (salonId: string, params?: StylistSearchParams): Promise<ApiResponse<Stylist[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/salon/${salonId}`, { params }),
      []
    );
  },

  createStylist: async (data: CreateStylistRequest): Promise<ApiResponse<Stylist>> => {
    return safeApiCallOptional(
      () => apiClient.post('/stylists', data),
      {} as Stylist
    );
  },

  updateStylist: async (stylistId: string, data: UpdateStylistRequest): Promise<ApiResponse<Stylist>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/stylists/${stylistId}`, data),
      {} as Stylist
    );
  },

  deleteStylist: async (stylistId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/stylists/${stylistId}`),
      null
    );
  },

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

  getStylistSchedule: async (stylistId: string): Promise<ApiResponse<StylistSchedule[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/stylists/${stylistId}/schedule`),
      []
    );
  },

  setStylistSchedule: async (stylistId: string, data: SetScheduleRequest): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/stylists/${stylistId}/schedule`, data),
      null
    );
  },
};
