// API Response Types - Standard format for all mock services

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  password: string; // Hashed in real backend
  name: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'staff';
  createdAt: string;
  updatedAt: string;
}

// Salon Types
export interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  openingHours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  createdAt: string;
}

// Service Types
export interface Service {
  id: string;
  salonId: string;
  categoryId: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  discountPrice?: number;
  image: string;
  isActive: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  servicesCount: number;
}

// Staff Types
export interface Staff {
  id: string;
  salonId: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  email: string;
  rating: number;
  totalAppointments: number;
  specialties: string[];
  workingHours: string;
  isActive: boolean;
}

// Appointment Types
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Appointment {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  staffId: string;

  // Service details (denormalized for display)
  serviceName: string;
  staffName: string;
  salonName: string;

  // Timing
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes

  // Status
  status: AppointmentStatus;

  // Pricing
  price: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;

  // Cancellation
  cancellation?: {
    cancelledAt: string;
    cancelledBy: 'user' | 'salon' | 'system';
    reason: string;
    refundAmount: number;
    refundStatus: 'pending' | 'processed' | 'none';
  };

  // Reschedule history
  rescheduleHistory: {
    fromDate: string;
    fromTime: string;
    toDate: string;
    toTime: string;
    changedAt: string;
    changedBy: 'user' | 'salon';
  }[];

  // Review
  hasReview: boolean;
  reviewId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Waitlist Types
export type WaitlistStatus =
  | 'waiting'
  | 'slot_available'
  | 'confirmed'
  | 'expired'
  | 'cancelled';

export interface WaitlistEntry {
  id: string;

  // User info
  userId: string;
  userName: string;
  userPhone: string;

  // Booking preference
  salonId: string;
  salonName: string;
  serviceId: string;
  serviceName: string;
  staffId?: string;
  staffName?: string;
  preferredDate: string;
  preferredTimeSlots: string[]; // ["09:00", "10:00", "11:00"]

  // Waitlist status
  status: WaitlistStatus;
  position: number;
  joinedAt: string;
  expiresAt: string;

  // When slot becomes available
  availableSlot?: {
    date: string;
    time: string;
    notifiedAt: string;
    expiresAt: string; // Must confirm within this time
  };

  // Notification preferences
  notifyVia: ('push' | 'sms' | 'email')[];

  // Conversion
  convertedAppointmentId?: string;
}

// Availability Types
export type SlotStatus = 'available' | 'booked' | 'blocked' | 'break';

export interface TimeSlot {
  id: string;
  salonId: string;
  staffId: string;
  date: string;
  time: string;
  duration: number;
  status: SlotStatus;
  appointmentId?: string;
  price?: number; // Dynamic pricing
}

export interface DayAvailability {
  date: string;
  dayOfWeek: string;
  isOpen: boolean;
  totalSlots: number;
  availableSlots: number;
  slots: TimeSlot[];
}

// Notification Types
export type NotificationType =
  | 'appointment_confirmed'
  | 'appointment_reminder_24h'
  | 'appointment_reminder_1h'
  | 'appointment_cancelled'
  | 'appointment_rescheduled'
  | 'waitlist_joined'
  | 'waitlist_slot_available'
  | 'waitlist_position_update'
  | 'waitlist_expired'
  | 'payment_success'
  | 'payment_failed'
  | 'review_request'
  | 'promo_offer'
  | 'system_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;

  // Action buttons
  actions?: {
    label: string;
    route: string;
  }[];
}

export interface NotificationPreferences {
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  appointmentReminders: boolean;
  waitlistAlerts: boolean;
  promotions: boolean;
  reminderHoursBefore: number[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

// Payment Types
export type PaymentMethodType = 'card' | 'paypal' | 'applepay' | 'googlepay' | 'momo' | 'vnpay';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'jcb';

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  cardBrand?: CardBrand;
  lastFourDigits?: string;
  expiryMonth?: number;
  expiryYear?: number;
  holderName?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  userId: string;

  // Amount
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;

  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

  // Method
  paymentMethodId: string;
  paymentMethodType: PaymentMethodType;

  // Timestamps
  createdAt: string;
  completedAt?: string;

  // Receipt
  receiptNumber?: string;
  receiptUrl?: string;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  appointmentId: string;
  salonId: string;
  serviceId: string;
  staffId: string;

  // Ratings (1-5)
  overallRating: number;
  serviceRating: number;
  staffRating: number;
  cleanlinessRating: number;

  // Content
  comment: string;
  images?: string[];

  // Response
  response?: {
    text: string;
    respondedAt: string;
    respondedBy: string;
  };

  // Meta
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
}

// Search Types
export interface SearchFilters {
  query?: string;
  serviceCategories?: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  date?: string;
  timeRange?: {
    start: string;
    end: string;
  };
  staffGender?: 'male' | 'female' | 'any';
  sortBy?: 'relevance' | 'rating' | 'price_low' | 'price_high' | 'distance';
}

export interface SearchResult {
  type: 'salon' | 'service' | 'staff';
  id: string;
  name: string;
  description: string;
  image: string;
  rating?: number;
  price?: number;
  matchScore: number;
}
