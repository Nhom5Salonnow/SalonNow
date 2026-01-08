// Stylist Types

export interface StylistSalon {
  id: string;
  name: string;
}

export interface Stylist {
  id: string;
  salonId: string;
  salon?: StylistSalon;
  firstName: string;
  lastName: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateStylistRequest {
  salonId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  bio?: string;
  specialties?: string[];
  isActive?: boolean;
}

export interface UpdateStylistRequest extends Partial<Omit<CreateStylistRequest, 'salonId'>> {}

export interface StylistSchedule {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday, 6=Saturday (theo backend thực tế)
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

export interface SetScheduleRequest {
  schedule: StylistSchedule[];
}

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface StylistAvailability {
  stylistId: string;
  date: string;
  slots: AvailabilitySlot[];
}

export interface StylistSearchParams {
  salonId?: string;
  isActive?: boolean;
  specialty?: string;
}

export interface AvailabilityParams {
  date: string;
  serviceId?: string;
}
