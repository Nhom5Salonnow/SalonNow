import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Category, CreateCategoryRequest, UpdateCategoryRequest, CategorySearchParams } from './types/category.types';
import { Service } from './types/service.types';

export const categoryApi = {
  getCategories: async (params?: CategorySearchParams): Promise<ApiResponse<Category[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/categories', { params }),
      []
    );
  },

  getCategoryById: async (categoryId: string): Promise<ApiResponse<Category>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/categories/${categoryId}`),
      {} as Category
    );
  },

  createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    return safeApiCallOptional(
      () => apiClient.post('/categories', data),
      {} as Category
    );
  },

  updateCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/categories/${categoryId}`, data),
      {} as Category
    );
  },

  deleteCategory: async (categoryId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/categories/${categoryId}`),
      null
    );
  },

  getCategoryServices: async (categoryId: string): Promise<ApiResponse<Service[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/categories/${categoryId}/services`),
      []
    );
  },
};
