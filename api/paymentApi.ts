import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse, PaginatedResponse } from './types/common.types';
import {
  Payment,
  CreatePaymentRequest,
  PaymentMethodInfo,
  CreatePaymentMethodRequest,
  RefundPaymentRequest,
  PaymentSearchParams,
} from './types/payment.types';

/**
 * Payment API Service
 * ALL ENDPOINTS MAY NOT BE AVAILABLE YET
 * Will gracefully fail without crashing
 */
export const paymentApi = {
  /**
   * Create payment
   */
  createPayment: async (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    return safeApiCallOptional(
      () => apiClient.post('/payments', data),
      {} as Payment
    );
  },

  /**
   * Get my payments
   */
  getMyPayments: async (params?: PaymentSearchParams): Promise<ApiResponse<Payment[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/payments/my-payments', { params }),
      []
    );
  },

  /**
   * Get payment by ID
   */
  getPaymentById: async (paymentId: string): Promise<ApiResponse<Payment>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/payments/${paymentId}`),
      {} as Payment
    );
  },

  /**
   * Refund payment
   */
  refundPayment: async (paymentId: string, data: RefundPaymentRequest): Promise<ApiResponse<Payment>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/payments/${paymentId}/refund`, data),
      {} as Payment
    );
  },

  /**
   * Get payment methods
   */
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethodInfo[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/payments/methods'),
      []
    );
  },

  /**
   * Add payment method
   */
  addPaymentMethod: async (data: CreatePaymentMethodRequest): Promise<ApiResponse<PaymentMethodInfo>> => {
    return safeApiCallOptional(
      () => apiClient.post('/payments/methods', data),
      {} as PaymentMethodInfo
    );
  },

  /**
   * Delete payment method
   */
  deletePaymentMethod: async (methodId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/payments/methods/${methodId}`),
      null
    );
  },

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod: async (methodId: string): Promise<ApiResponse<PaymentMethodInfo>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/payments/methods/${methodId}/default`),
      {} as PaymentMethodInfo
    );
  },
};
