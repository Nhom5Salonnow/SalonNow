export interface Salon {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number; // in km
  imageUrl?: string;
  phone?: string;
  description?: string;
  services: Service[];
  openingHours?: OpeningHours;
  availableSlots?: TimeSlot[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  categoryId: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string; // HH:mm format
  close: string; // HH:mm format
  isClosed: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string; // ISO 8601 format
  endTime: string;
  isAvailable: boolean;
}

// Home screen category
export interface HomeCategory {
  id: string;
  name: string;
  imageUrl: string;
}

// Onboarding slide
export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}
