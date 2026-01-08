// In-memory Mock Database
// This simulates a backend database for development

import {
  User,
  Salon,
  Service,
  ServiceCategory,
  Staff,
  Appointment,
  WaitlistEntry,
  TimeSlot,
  Notification,
  NotificationPreferences,
  PaymentMethod,
  Payment,
  Review,
} from './types';

// ============================================
// USERS
// ============================================
export const users: User[] = [
  {
    id: 'user-1',
    email: 'doejohn@example.com',
    password: '123456',
    name: 'Doe John',
    phone: '+84 912 345 678',
    avatar: 'https://i.pravatar.cc/200?img=3',
    role: 'customer',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-10-01T10:30:00Z',
  },
  {
    id: 'user-2',
    email: 'lucy@example.com',
    password: '123456',
    name: 'Lucy Nguyen',
    phone: '+84 987 654 321',
    avatar: 'https://i.pravatar.cc/200?img=5',
    role: 'customer',
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-09-15T14:20:00Z',
  },
  {
    id: 'user-3',
    email: 'test@test.com',
    password: 'test',
    name: 'Test User',
    phone: '+84 900 000 000',
    avatar: 'https://i.pravatar.cc/200?img=8',
    role: 'customer',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-10-10T16:45:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@salonnow.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+84 888 888 888',
    avatar: 'https://i.pravatar.cc/200?img=12',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-10-01T00:00:00Z',
  },
];

// ============================================
// SALONS
// ============================================
export const salons: Salon[] = [
  {
    id: 'salon-1',
    name: 'Salon Now Premium',
    address: '123 Nguyen Hue, District 1, Ho Chi Minh City',
    phone: '+84 28 1234 5678',
    email: 'contact@salonnow.com',
    description: 'Premium hair salon with experienced stylists and modern equipment.',
    rating: 4.8,
    reviewCount: 256,
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    ],
    openingHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '10:00', close: '18:00' },
    },
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================
// SERVICE CATEGORIES
// ============================================
export const serviceCategories: ServiceCategory[] = [
  {
    id: 'cat-1',
    name: 'Hair Cut',
    description: 'Professional haircut services for all styles',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',
    servicesCount: 8,
  },
  {
    id: 'cat-2',
    name: 'Hair Color',
    description: 'Hair coloring, highlights, and treatments',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200',
    servicesCount: 6,
  },
  {
    id: 'cat-3',
    name: 'Styling',
    description: 'Hair styling for special occasions',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200',
    servicesCount: 5,
  },
  {
    id: 'cat-4',
    name: 'Nail Care',
    description: 'Manicure, pedicure, and nail art',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200',
    servicesCount: 10,
  },
  {
    id: 'cat-5',
    name: 'Massage',
    description: 'Relaxing massage treatments',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200',
    servicesCount: 7,
  },
  {
    id: 'cat-6',
    name: 'Facial',
    description: 'Facial treatments and skincare',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200',
    servicesCount: 6,
  },
];

// ============================================
// SERVICES
// ============================================
export const services: Service[] = [
  // Hair Cut
  {
    id: 'service-1',
    salonId: 'salon-1',
    categoryId: 'cat-1',
    name: "Women's Haircut",
    description: 'Professional haircut with wash and blow dry',
    duration: 45,
    price: 350000,
    discountPrice: 299000,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    isActive: true,
  },
  {
    id: 'service-2',
    salonId: 'salon-1',
    categoryId: 'cat-1',
    name: "Men's Haircut",
    description: 'Classic or modern cut with styling',
    duration: 30,
    price: 200000,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    isActive: true,
  },
  {
    id: 'service-3',
    salonId: 'salon-1',
    categoryId: 'cat-1',
    name: "Kids' Haircut",
    description: 'Gentle haircut for children under 12',
    duration: 25,
    price: 150000,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400',
    isActive: true,
  },
  // Hair Color
  {
    id: 'service-4',
    salonId: 'salon-1',
    categoryId: 'cat-2',
    name: 'Full Color',
    description: 'Complete hair coloring with premium products',
    duration: 120,
    price: 800000,
    discountPrice: 699000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    isActive: true,
  },
  {
    id: 'service-5',
    salonId: 'salon-1',
    categoryId: 'cat-2',
    name: 'Highlights',
    description: 'Partial or full highlights',
    duration: 90,
    price: 600000,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    isActive: true,
  },
  // Nail Care
  {
    id: 'service-6',
    salonId: 'salon-1',
    categoryId: 'cat-4',
    name: 'Classic Manicure',
    description: 'Nail shaping, cuticle care, and polish',
    duration: 30,
    price: 150000,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    isActive: true,
  },
  {
    id: 'service-7',
    salonId: 'salon-1',
    categoryId: 'cat-4',
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish manicure',
    duration: 45,
    price: 250000,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    isActive: true,
  },
  // Massage
  {
    id: 'service-8',
    salonId: 'salon-1',
    categoryId: 'cat-5',
    name: 'Swedish Massage',
    description: 'Relaxing full body massage',
    duration: 60,
    price: 500000,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    isActive: true,
  },
  {
    id: 'service-9',
    salonId: 'salon-1',
    categoryId: 'cat-5',
    name: 'Deep Tissue Massage',
    description: 'Intensive massage for muscle tension',
    duration: 60,
    price: 600000,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    isActive: true,
  },
];

// ============================================
// STAFF
// ============================================
export const staff: Staff[] = [
  {
    id: 'staff-1',
    salonId: 'salon-1',
    name: 'Emily Chen',
    role: 'Senior Stylist',
    avatar: 'https://i.pravatar.cc/200?img=1',
    phone: '+84 912 111 001',
    email: 'emily@salonnow.com',
    rating: 4.9,
    totalAppointments: 1250,
    specialties: ['Hair Cut', 'Hair Color', 'Styling'],
    workingHours: 'Mon-Sat 9AM-6PM',
    isActive: true,
  },
  {
    id: 'staff-2',
    salonId: 'salon-1',
    name: 'John Doe',
    role: 'Barber',
    avatar: 'https://i.pravatar.cc/200?img=3',
    phone: '+84 912 111 002',
    email: 'john@salonnow.com',
    rating: 4.7,
    totalAppointments: 980,
    specialties: ["Men's Cut", 'Beard Trim', 'Shaving'],
    workingHours: 'Tue-Sun 10AM-7PM',
    isActive: true,
  },
  {
    id: 'staff-3',
    salonId: 'salon-1',
    name: 'Lucy Han',
    role: 'Nail Technician',
    avatar: 'https://i.pravatar.cc/200?img=5',
    phone: '+84 912 111 003',
    email: 'lucy@salonnow.com',
    rating: 4.8,
    totalAppointments: 850,
    specialties: ['Manicure', 'Pedicure', 'Nail Art'],
    workingHours: 'Mon-Fri 9AM-5PM',
    isActive: true,
  },
  {
    id: 'staff-4',
    salonId: 'salon-1',
    name: 'Mike Wilson',
    role: 'Massage Therapist',
    avatar: 'https://i.pravatar.cc/200?img=8',
    phone: '+84 912 111 004',
    email: 'mike@salonnow.com',
    rating: 4.6,
    totalAppointments: 620,
    specialties: ['Deep Tissue', 'Swedish', 'Sports Massage'],
    workingHours: 'Wed-Sun 11AM-8PM',
    isActive: true,
  },
  {
    id: 'staff-5',
    salonId: 'salon-1',
    name: 'Sarah Park',
    role: 'Junior Stylist',
    avatar: 'https://i.pravatar.cc/200?img=9',
    phone: '+84 912 111 005',
    email: 'sarah@salonnow.com',
    rating: 4.5,
    totalAppointments: 320,
    specialties: ['Hair Cut', 'Blow Dry'],
    workingHours: 'Mon-Sat 10AM-6PM',
    isActive: true,
  },
];

// ============================================
// APPOINTMENTS
// ============================================
export let appointments: Appointment[] = [
  {
    id: 'apt-1',
    userId: 'user-1',
    salonId: 'salon-1',
    serviceId: 'service-1',
    staffId: 'staff-1',
    serviceName: "Women's Haircut",
    staffName: 'Emily Chen',
    salonName: 'Salon Now Premium',
    date: '2024-12-20',
    time: '10:00',
    duration: 45,
    status: 'confirmed',
    price: 299000,
    tax: 29900,
    discount: 0,
    total: 328900,
    paymentStatus: 'paid',
    hasReview: false,
    rescheduleHistory: [],
    createdAt: '2024-12-15T08:00:00Z',
    updatedAt: '2024-12-15T08:30:00Z',
  },
  {
    id: 'apt-2',
    userId: 'user-1',
    salonId: 'salon-1',
    serviceId: 'service-8',
    staffId: 'staff-4',
    serviceName: 'Swedish Massage',
    staffName: 'Mike Wilson',
    salonName: 'Salon Now Premium',
    date: '2024-12-22',
    time: '14:00',
    duration: 60,
    status: 'pending',
    price: 500000,
    tax: 50000,
    discount: 0,
    total: 550000,
    paymentStatus: 'pending',
    hasReview: false,
    rescheduleHistory: [],
    createdAt: '2024-12-16T10:00:00Z',
    updatedAt: '2024-12-16T10:00:00Z',
  },
  {
    id: 'apt-3',
    userId: 'user-1',
    salonId: 'salon-1',
    serviceId: 'service-2',
    staffId: 'staff-2',
    serviceName: "Men's Haircut",
    staffName: 'John Doe',
    salonName: 'Salon Now Premium',
    date: '2024-12-10',
    time: '11:00',
    duration: 30,
    status: 'completed',
    price: 200000,
    tax: 20000,
    discount: 0,
    total: 220000,
    paymentStatus: 'paid',
    hasReview: true,
    reviewId: 'review-1',
    rescheduleHistory: [],
    createdAt: '2024-12-05T09:00:00Z',
    updatedAt: '2024-12-10T11:30:00Z',
  },
  {
    id: 'apt-4',
    userId: 'user-2',
    salonId: 'salon-1',
    serviceId: 'service-4',
    staffId: 'staff-1',
    serviceName: 'Full Color',
    staffName: 'Emily Chen',
    salonName: 'Salon Now Premium',
    date: '2024-12-18',
    time: '09:00',
    duration: 120,
    status: 'cancelled',
    price: 699000,
    tax: 69900,
    discount: 0,
    total: 768900,
    paymentStatus: 'refunded',
    hasReview: false,
    cancellation: {
      cancelledAt: '2024-12-17T15:00:00Z',
      cancelledBy: 'user',
      reason: 'Schedule conflict',
      refundAmount: 768900,
      refundStatus: 'processed',
    },
    rescheduleHistory: [],
    createdAt: '2024-12-12T14:00:00Z',
    updatedAt: '2024-12-17T15:00:00Z',
  },
];

// ============================================
// WAITLIST
// ============================================
export let waitlist: WaitlistEntry[] = [
  {
    id: 'wl-1',
    userId: 'user-2',
    userName: 'Lucy Nguyen',
    userPhone: '+84 987 654 321',
    salonId: 'salon-1',
    salonName: 'Salon Now Premium',
    serviceId: 'service-1',
    serviceName: "Women's Haircut",
    staffId: 'staff-1',
    staffName: 'Emily Chen',
    preferredDate: '2024-12-21',
    preferredTimeSlots: ['09:00', '10:00', '11:00'],
    status: 'waiting',
    position: 1,
    joinedAt: '2024-12-16T08:00:00Z',
    expiresAt: '2024-12-17T08:00:00Z',
    notifyVia: ['push', 'sms'],
  },
  {
    id: 'wl-2',
    userId: 'user-3',
    userName: 'Test User',
    userPhone: '+84 900 000 000',
    salonId: 'salon-1',
    salonName: 'Salon Now Premium',
    serviceId: 'service-4',
    serviceName: 'Full Color',
    preferredDate: '2024-12-21',
    preferredTimeSlots: ['14:00', '15:00'],
    status: 'waiting',
    position: 2,
    joinedAt: '2024-12-16T09:00:00Z',
    expiresAt: '2024-12-17T09:00:00Z',
    notifyVia: ['push'],
  },
];

// ============================================
// TIME SLOTS (Generated for next 7 days)
// ============================================
export const generateTimeSlots = (salonId: string, staffId: string, date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  hours.forEach((time, index) => {
    // Randomly mark some slots as booked
    const isBooked = Math.random() < 0.3;
    const isBreak = time === '12:00' || time === '13:00';

    slots.push({
      id: `slot-${date}-${staffId}-${time}`,
      salonId,
      staffId,
      date,
      time,
      duration: 60,
      status: isBreak ? 'break' : isBooked ? 'booked' : 'available',
    });
  });

  return slots;
};

// ============================================
// NOTIFICATIONS
// ============================================
export let notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'appointment_confirmed',
    title: 'Appointment Confirmed',
    body: "Your appointment for Women's Haircut on Dec 20 at 10:00 AM has been confirmed.",
    data: { appointmentId: 'apt-1' },
    read: false,
    createdAt: '2024-12-15T08:30:00Z',
    actions: [
      { label: 'View Details', route: '/appointment/apt-1' },
    ],
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'review_request',
    title: 'How was your visit?',
    body: "Rate your Men's Haircut experience with John Doe",
    data: { appointmentId: 'apt-3' },
    read: true,
    createdAt: '2024-12-10T12:00:00Z',
    actions: [
      { label: 'Leave Review', route: '/feedback?appointmentId=apt-3' },
    ],
  },
  {
    id: 'notif-3',
    userId: 'user-2',
    type: 'waitlist_joined',
    title: 'Added to Waitlist',
    body: "You're #1 on the waitlist for Women's Haircut on Dec 21. We'll notify you when a slot opens!",
    data: { waitlistId: 'wl-1' },
    read: false,
    createdAt: '2024-12-16T08:00:00Z',
  },
];

// ============================================
// NOTIFICATION PREFERENCES
// ============================================
export let notificationPreferences: NotificationPreferences[] = [
  {
    userId: 'user-1',
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    appointmentReminders: true,
    waitlistAlerts: true,
    promotions: true,
    reminderHoursBefore: [24, 1],
  },
  {
    userId: 'user-2',
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: true,
    appointmentReminders: true,
    waitlistAlerts: true,
    promotions: false,
    reminderHoursBefore: [24],
  },
];

// ============================================
// PAYMENT METHODS
// ============================================
export let paymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    userId: 'user-1',
    type: 'card',
    cardBrand: 'visa',
    lastFourDigits: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    holderName: 'DOE JOHN',
    isDefault: true,
    isVerified: true,
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'pm-2',
    userId: 'user-1',
    type: 'card',
    cardBrand: 'mastercard',
    lastFourDigits: '9035',
    expiryMonth: 8,
    expiryYear: 2025,
    holderName: 'DOE JOHN',
    isDefault: false,
    isVerified: true,
    createdAt: '2024-08-15T00:00:00Z',
  },
  {
    id: 'pm-3',
    userId: 'user-1',
    type: 'momo',
    isDefault: false,
    isVerified: true,
    createdAt: '2024-09-01T00:00:00Z',
  },
];

// ============================================
// PAYMENTS
// ============================================
export let payments: Payment[] = [
  {
    id: 'pay-1',
    appointmentId: 'apt-1',
    userId: 'user-1',
    subtotal: 299000,
    tax: 29900,
    discount: 0,
    total: 328900,
    currency: 'VND',
    status: 'completed',
    paymentMethodId: 'pm-1',
    paymentMethodType: 'card',
    createdAt: '2024-12-15T08:15:00Z',
    completedAt: '2024-12-15T08:15:30Z',
    receiptNumber: 'RCP-20241215-001',
  },
  {
    id: 'pay-2',
    appointmentId: 'apt-3',
    userId: 'user-1',
    subtotal: 200000,
    tax: 20000,
    discount: 0,
    total: 220000,
    currency: 'VND',
    status: 'completed',
    paymentMethodId: 'pm-2',
    paymentMethodType: 'card',
    createdAt: '2024-12-05T09:30:00Z',
    completedAt: '2024-12-05T09:30:45Z',
    receiptNumber: 'RCP-20241205-001',
  },
];

// ============================================
// REVIEWS
// ============================================
export let reviews: Review[] = [
  {
    id: 'review-1',
    userId: 'user-1',
    userName: 'Doe John',
    userAvatar: 'https://i.pravatar.cc/200?img=3',
    appointmentId: 'apt-3',
    salonId: 'salon-1',
    serviceId: 'service-2',
    staffId: 'staff-2',
    overallRating: 5,
    serviceRating: 5,
    staffRating: 5,
    cleanlinessRating: 4,
    comment: 'Great haircut! John really understood what I wanted and the result was perfect.',
    isVerified: true,
    helpfulCount: 12,
    createdAt: '2024-12-10T15:00:00Z',
  },
  {
    id: 'review-2',
    userId: 'user-2',
    userName: 'Lucy Nguyen',
    userAvatar: 'https://i.pravatar.cc/200?img=5',
    appointmentId: 'apt-old-1',
    salonId: 'salon-1',
    serviceId: 'service-1',
    staffId: 'staff-1',
    overallRating: 4,
    serviceRating: 5,
    staffRating: 5,
    cleanlinessRating: 4,
    comment: 'Emily is amazing! She gave me exactly the style I showed her.',
    isVerified: true,
    helpfulCount: 8,
    createdAt: '2024-11-25T14:00:00Z',
    response: {
      text: 'Thank you so much Lucy! Looking forward to seeing you again!',
      respondedAt: '2024-11-26T09:00:00Z',
      respondedBy: 'Emily Chen',
    },
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Generate unique ID
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get current timestamp
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// Format price to VND
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

// Calculate tax (10%)
export const calculateTax = (price: number): number => {
  return Math.round(price * 0.1);
};

// Get date string in YYYY-MM-DD format
export const getDateString = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

// Get time string in HH:mm format
export const getTimeString = (date: Date = new Date()): string => {
  return date.toTimeString().slice(0, 5);
};

// ============================================
// MOCK DATABASE OBJECT
// ============================================
// Grouped export for convenient access
export const mockDatabase = {
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
};
