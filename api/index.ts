export { default as apiClient, setOnAuthInvalidated } from './apiClient';
export { safeApiCall, safeApiCallOptional } from './apiHelper';
export { handleApiError, isNetworkError, isAuthError, createSafeErrorResponse } from '../utils/apiErrorHandler';

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

export * from './types';
