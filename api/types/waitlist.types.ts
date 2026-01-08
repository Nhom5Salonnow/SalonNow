// Waitlist Types

export interface WaitlistSalon {
  id: string;
  name: string;
}

export interface WaitlistService {
  id: string;
  name: string;
}

export interface WaitlistItem {
  id: string;
  salonId: string;
  salon?: WaitlistSalon;
  serviceId: string;
  service?: WaitlistService;
  userId: string;
  preferredDate: string;
  startWindow: string;
  endWindow: string;
  isAutoBook: boolean;
  status?: 'waiting' | 'notified' | 'booked' | 'expired';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWaitlistRequest {
  salonId: string;
  serviceId: string;
  preferredDate: string;
  startWindow: string;
  endWindow: string;
  isAutoBook: boolean;
}
