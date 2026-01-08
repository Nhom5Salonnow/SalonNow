import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  success?: boolean;
}

/**
 * Extract error message from API error response
 * Returns a user-friendly error message
 */
export const handleApiError = (error: AxiosError<ApiErrorResponse> | any): string => {
  // If it's not an Axios error, return generic message
  if (!error?.isAxiosError) {
    return error?.message || 'Co loi xay ra';
  }

  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    // Get message from response
    const message = data?.message || data?.error;

    // Handle specific status codes
    switch (status) {
      case 400:
        return message || 'Du lieu khong hop le';
      case 401:
        return 'Phien dang nhap het han. Vui long dang nhap lai';
      case 403:
        return 'Ban khong co quyen thuc hien thao tac nay';
      case 404:
        return message || 'Khong tim thay du lieu';
      case 409:
        return message || 'Du lieu da ton tai';
      case 422:
        return message || 'Du lieu khong hop le';
      case 500:
        return 'Loi he thong. Vui long thu lai sau';
      default:
        return message || 'Co loi xay ra';
    }
  } else if (error.request) {
    // No response received (network error)
    return 'Khong the ket noi den server. Vui long kiem tra ket noi mang';
  } else {
    // Request setup error
    return 'Loi ket noi. Vui long thu lai';
  }
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: AxiosError | any): boolean => {
  return !error?.response && !!error?.request;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: AxiosError | any): boolean => {
  return error?.response?.status === 401;
};

/**
 * Create a safe API response for failed requests
 * This prevents the app from crashing when API fails
 */
export const createSafeErrorResponse = <T>(defaultData: T) => {
  return {
    success: false,
    data: defaultData,
    message: 'API request failed',
  };
};
