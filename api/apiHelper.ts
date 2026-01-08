import { AxiosError } from 'axios';
import { ApiResponse } from './types/common.types';
import { handleApiError } from '@/utils/apiErrorHandler';

/**
 * Safe API call wrapper
 * Wraps API calls to prevent crashes when API fails
 * Returns a consistent response structure
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<{ data: any }>,
  defaultData: T
): Promise<ApiResponse<T>> {
  try {
    const response = await apiCall();

    // If response has success field, use it
    if (response.data && typeof response.data.success === 'boolean') {
      return {
        success: response.data.success,
        data: response.data.data ?? defaultData,
        message: response.data.message,
      };
    }

    // Otherwise, wrap the response data
    return {
      success: true,
      data: response.data ?? defaultData,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    const message = handleApiError(axiosError);

    // Log error for debugging but don't crash
    console.log('API Error:', {
      status: axiosError?.response?.status,
      message,
      responseData: axiosError?.response?.data,
      url: axiosError?.config?.url,
    });

    return {
      success: false,
      data: defaultData,
      message,
      error: axiosError?.response?.status?.toString(),
    };
  }
}

/**
 * Safe API call for endpoints that might not exist yet
 * Will return default data without error
 */
export async function safeApiCallOptional<T>(
  apiCall: () => Promise<{ data: any }>,
  defaultData: T
): Promise<ApiResponse<T>> {
  try {
    const response = await apiCall();

    if (response.data && typeof response.data.success === 'boolean') {
      return {
        success: response.data.success,
        data: response.data.data ?? defaultData,
        message: response.data.message,
      };
    }

    return {
      success: true,
      data: response.data ?? defaultData,
    };
  } catch (error) {
    // Silently return default data for optional endpoints
    // This is for APIs that don't exist yet
    return {
      success: true,
      data: defaultData,
    };
  }
}
