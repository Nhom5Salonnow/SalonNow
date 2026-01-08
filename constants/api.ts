// API Configuration
export const API_CONFIG = {
  // TODO: Replace with actual API URL when backend is ready
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.salonnow.com',
  TIMEOUT: 30000, // 30 seconds

  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',

    // Salons
    SALONS: '/salons',
    SALON_DETAIL: (id: string) => `/salons/${id}`,
    SALON_SEARCH: '/salons/search',
    NEARBY_SALONS: '/salons/nearby',

    // Services
    SERVICES: '/services',
    SERVICE_DETAIL: (id: string) => `/services/${id}`,

    // Bookings
    BOOKINGS: '/bookings',
    BOOKING_DETAIL: (id: string) => `/bookings/${id}`,
    CREATE_BOOKING: '/bookings',
    CANCEL_BOOKING: (id: string) => `/bookings/${id}/cancel`,

    // User
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    USER_BOOKINGS: '/user/bookings',
    USER_FAVORITES: '/user/favorites',
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  HAS_COMPLETED_ONBOARDING: 'hasCompletedOnboarding',
  FAVORITES: 'favorites',
};
