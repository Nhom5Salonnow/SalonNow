import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  success?: boolean;
}

export const handleApiError = (error: AxiosError<ApiErrorResponse> | any): string => {
  if (!error?.isAxiosError) {
    return error?.message || 'Co loi xay ra';
  }

  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    const message = data?.message || data?.error;

    switch (status) {
      case 400:
        return message || 'Du lieu khong hop le';
      case 401:
        return message || 'Email hoac mat khau khong dung';
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
    return 'Khong the ket noi den server. Vui long kiem tra ket noi mang';
  } else {
    return 'Loi ket noi. Vui long thu lai';
  }
};

export const isNetworkError = (error: AxiosError | any): boolean => {
  return !error?.response && !!error?.request;
};

export const isAuthError = (error: AxiosError | any): boolean => {
  return error?.response?.status === 401;
};

export const createSafeErrorResponse = <T>(defaultData: T) => {
  return {
    success: false,
    data: defaultData,
    message: 'API request failed',
  };
};
