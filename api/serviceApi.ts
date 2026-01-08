import apiClient from './apiClient';
import { safeApiCall, safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Service, CreateServiceRequest, UpdateServiceRequest, ServiceSearchParams } from './types/service.types';

/**
 * Service API
 * Handles service related API calls
 */
export const serviceApi = {
  /**
   * Get all services - AVAILABLE
   */
  getServices: async (params?: ServiceSearchParams): Promise<ApiResponse<Service[]>> => {
    return safeApiCall(
      () => apiClient.get('/service', { params }),
      []
    );
  },

  /**
   * Get service by ID - AVAILABLE
   */
  getServiceById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    return safeApiCall(
      () => apiClient.get(`/service/${serviceId}`),
      {} as Service
    );
  },

  /**
   * Create service - AVAILABLE
   */
  createService: async (data: CreateServiceRequest): Promise<ApiResponse<Service>> => {
    return safeApiCall(
      () => apiClient.post('/service', data),
      {} as Service
    );
  },

  /**
   * Update service - AVAILABLE
   */
  updateService: async (serviceId: string, data: UpdateServiceRequest): Promise<ApiResponse<Service>> => {
    return safeApiCall(
      () => apiClient.patch(`/service/${serviceId}`, data),
      {} as Service
    );
  },

  /**
   * Delete service - AVAILABLE
   */
  deleteService: async (serviceId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/service/${serviceId}`),
      null
    );
  },

  /**
   * Get services by salon
   */
  getServicesBySalon: async (salonId: string): Promise<ApiResponse<Service[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/service/salon/${salonId}`),
      []
    );
  },

  /**
   * Get services by category
   */
  getServicesByCategory: async (categoryId: string): Promise<ApiResponse<Service[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/service/category/${categoryId}`),
      []
    );
  },
};
