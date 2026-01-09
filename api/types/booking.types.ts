// Booking Types

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface BookingSalon {
  id: string;
  name: string;
  address: string;
  phoneNumber?: string;
}

export interface BookingService {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface BookingStylist {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface BookingUser {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Booking {
  id: string;
  salonId: string;
  salon?: BookingSalon;
  serviceId: string;
  service?: BookingService;
  stylistId?: string;
  stylist?: BookingStylist;
  userId: string;
  user?: BookingUser;
  startTime: string;
  endTime?: string;
  status: BookingStatus;
  notes?: string;
  cancelReason?: string;
  totalPrice?: number;
  price?: number;
  total?: number;
  // Legacy fields for compatibility
  serviceName?: string;
  serviceImage?: string;
  salonName?: string;
  stylistName?: string;
  date?: string;
  time?: string;
  dayTime?: string;
  hasReview?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBookingRequest {
  salonId: string;
  serviceId: string;
  stylistId?: string;
  startTime: string;
  notes?: string;
}

export interface UpdateBookingRequest {
  startTime?: string;
  stylistId?: string;
  notes?: string;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  cancelReason?: string;
}

export interface BookingSearchParams {
  status?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
