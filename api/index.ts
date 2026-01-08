/**
 * API Module Index
 * Export all API services and types for easy importing
 */

// Legacy exports (will be deprecated)
export * from './api';
export * from './salonService';
export * from './authService';

// Core
export { default as apiClient } from './apiClient';
export { safeApiCall, safeApiCallOptional } from './apiHelper';
export { handleApiError, isNetworkError, isAuthError, createSafeErrorResponse } from '../utils/apiErrorHandler';

// API Services
export { authApi } from './authApi';
export { userApi } from './userApi';
export { salonApi } from './salonApi';
export { serviceApi } from './serviceApi';
export { bookingApi } from './bookingApi';
export { waitlistApi } from './waitlistApi';
export { notificationApi } from './notificationApi';
export { paymentApi } from './paymentApi';
export { reviewApi, feedbackApi } from './reviewApi';
export { stylistApi } from './stylistApi';
export { categoryApi } from './categoryApi';
export { adminApi } from './adminApi';

// Types
export * from './types';
