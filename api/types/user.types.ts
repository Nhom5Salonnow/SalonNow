// User Types

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
  avatar?: string;
  role?: 'USER' | 'OWNER' | 'ADMIN' | string;
  createdAt?: string;
  updatedAt?: string;
  // Stats properties (may be included in user response)
  totalAppointments?: number;
  completedAppointments?: number;
  cancelledAppointments?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  reviewsGiven?: number;
  averageRating?: number;
  favoriteServices?: Array<{ serviceId: string; serviceName: string; count: number }>;
  memberSince?: string;
}

export interface UpdateUserRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
  avatar?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneNumber?: string;
}
