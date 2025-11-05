export interface Booking {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  date: string; // ISO 8601 format
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface CreateBookingInput {
  salonId: string;
  serviceId: string;
  date: string;
  startTime: string;
  notes?: string;
}
