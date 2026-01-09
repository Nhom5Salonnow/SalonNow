import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
import {
  Payment,
  CreatePaymentRequest,
  PaymentMethodInfo,
  CreatePaymentMethodRequest,
  RefundPaymentRequest,
  PaymentSearchParams,
} from './types/payment.types';

export const paymentApi = {
  createPayment: async (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    return safeApiCallOptional(
      () => apiClient.post('/payments', data),
      {} as Payment
    );
  },

  getMyPayments: async (params?: PaymentSearchParams): Promise<ApiResponse<Payment[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/payments/my-payments', { params }),
      []
    );
  },

  getPaymentById: async (paymentId: string): Promise<ApiResponse<Payment>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/payments/${paymentId}`),
      {} as Payment
    );
  },

  refundPayment: async (paymentId: string, data: RefundPaymentRequest): Promise<ApiResponse<Payment>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/payments/${paymentId}/refund`, data),
      {} as Payment
    );
  },

  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethodInfo[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/payments/methods'),
      []
    );
  },

  addPaymentMethod: async (data: CreatePaymentMethodRequest): Promise<ApiResponse<PaymentMethodInfo>> => {
    return safeApiCallOptional(
      () => apiClient.post('/payments/methods', data),
      {} as PaymentMethodInfo
    );
  },

  deletePaymentMethod: async (methodId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/payments/methods/${methodId}`),
      null
    );
  },

  setDefaultPaymentMethod: async (methodId: string): Promise<ApiResponse<PaymentMethodInfo>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/payments/methods/${methodId}/default`),
      {} as PaymentMethodInfo
    );
  },
};
