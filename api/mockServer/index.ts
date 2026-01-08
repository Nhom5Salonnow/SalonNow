// Mock Server - Central Export
// All mock services and utilities are exported from here

export * from './types';
export * from './delay';
export * from './database';

// Re-export commonly used items
export {
  simulateDelay,
  simulateSlowNetwork,
  simulateFastNetwork,
  withDelay,
} from './delay';

export {
  users,
  salons,
  services,
  serviceCategories,
  staff,
  appointments,
  waitlist,
  notifications,
  notificationPreferences,
  paymentMethods,
  payments,
  reviews,
  generateTimeSlots,
  generateId,
  getCurrentTimestamp,
  formatPrice,
  calculateTax,
  getDateString,
  getTimeString,
} from './database';
