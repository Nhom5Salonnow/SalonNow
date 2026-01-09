import apiClient from './apiClient';
import { safeApiCall, safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Service, CreateServiceRequest, UpdateServiceRequest, ServiceSearchParams } from './types/service.types';

export const serviceApi = {
  getServices: async (params?: ServiceSearchParams): Promise<ApiResponse<Service[]>> => {
    return safeApiCall(
      () => apiClient.get('/service', { params }),
      []
    );
  },

  getServiceById: async (serviceId: string): Promise<ApiResponse<Service>> => {
    return safeApiCall(
      () => apiClient.get(`/service/${serviceId}`),
      {} as Service
    );
  },

  createService: async (data: CreateServiceRequest): Promise<ApiResponse<Service>> => {
    return safeApiCall(
      () => apiClient.post('/service', data),
      {} as Service
    );
  },

  updateService: async (serviceId: string, data: UpdateServiceRequest): Promise<ApiResponse<Service>> => {
    return safeApiCall(
      () => apiClient.patch(`/service/${serviceId}`, data),
      {} as Service
    );
  },

  deleteService: async (serviceId: string): Promise<ApiResponse<null>> => {
    return safeApiCall(
      () => apiClient.delete(`/service/${serviceId}`),
      null
    );
  },

  getServicesBySalon: async (salonId: string): Promise<ApiResponse<Service[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/service/salon/${salonId}`),
      []
    );
  },

  getServicesByCategory: async (categoryId: string): Promise<ApiResponse<Service[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/service/category/${categoryId}`),
      []
    );
  },
};
