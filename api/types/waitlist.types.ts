// Waitlist Types

export interface WaitlistSalon {
  id: string;
  name: string;
}

export interface WaitlistService {
  id: string;
  name: string;
}

export interface WaitlistStaff {
  id: string;
  name: string;
}

export interface WaitlistAvailableSlot {
  date: string;
  time: string;
  notifiedAt?: string;
}

export interface WaitlistItem {
  id: string;
  salonId: string;
  salonName?: string;
  salon?: WaitlistSalon;
  serviceId: string;
  serviceName?: string;
  service?: WaitlistService;
  userId: string;
  staffId?: string;
  staffName?: string;
  staff?: WaitlistStaff;
  preferredDate: string;
  preferredTimeSlots?: string[];
  startWindow: string;
  endWindow: string;
  isAutoBook: boolean;
  status?: 'waiting' | 'notified' | 'booked' | 'expired' | 'slot_available' | 'confirmed' | 'cancelled';
  position?: number;
  availableSlot?: WaitlistAvailableSlot;
  expiresAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWaitlistRequest {
  salonId: string;
  serviceId: string;
  staffId?: string;
  preferredDate: string;
  preferredTimeSlots?: string[];
  startWindow?: string;
  endWindow?: string;
  isAutoBook?: boolean;
  notifyVia?: ('push' | 'email' | 'sms')[];
}
