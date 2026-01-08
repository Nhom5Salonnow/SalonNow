import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import { Category, CreateCategoryRequest, UpdateCategoryRequest, CategorySearchParams } from './types/category.types';
import { Service } from './types/service.types';

/**
 * Category API Service
 * ALL ENDPOINTS MAY NOT BE AVAILABLE YET
 * Will gracefully fail without crashing
 */
export const categoryApi = {
  /**
   * Get all categories
   */
  getCategories: async (params?: CategorySearchParams): Promise<ApiResponse<Category[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/categories', { params }),
      []
    );
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (categoryId: string): Promise<ApiResponse<Category>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/categories/${categoryId}`),
      {} as Category
    );
  },

  /**
   * Create category (admin)
   */
  createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    return safeApiCallOptional(
      () => apiClient.post('/categories', data),
      {} as Category
    );
  },

  /**
   * Update category (admin)
   */
  updateCategory: async (categoryId: string, data: UpdateCategoryRequest): Promise<ApiResponse<Category>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/categories/${categoryId}`, data),
      {} as Category
    );
  },

  /**
   * Delete category (admin)
   */
  deleteCategory: async (categoryId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/categories/${categoryId}`),
      null
    );
  },

  /**
   * Get services by category
   */
  getCategoryServices: async (categoryId: string): Promise<ApiResponse<Service[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/categories/${categoryId}/services`),
      []
    );
  },
};
