export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.salonnow.com',
  TIMEOUT: 30000,

  ENDPOINTS: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',

    SALONS: '/salons',
    SALON_DETAIL: (id: string) => `/salons/${id}`,
    SALON_SEARCH: '/salons/search',
    NEARBY_SALONS: '/salons/nearby',

    SERVICES: '/services',
    SERVICE_DETAIL: (id: string) => `/services/${id}`,

    BOOKINGS: '/bookings',
    BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
    CREATE_BOOKING: '/bookings',
    CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,

    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    USER_BOOKINGS: '/user/bookings',
    USER_FAVORITES: '/user/favorites',
  },
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
  FAVORITES: 'favorites',
};
