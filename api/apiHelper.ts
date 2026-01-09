import { AxiosError } from 'axios';
import { ApiResponse } from './types/common.types';
import { handleApiError } from '@/utils/apiErrorHandler';

export async function safeApiCall<T>(
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
    const axiosError = error as AxiosError;
    const message = handleApiError(axiosError);

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
    return {
      success: true,
      data: defaultData,
    };
  }
}
