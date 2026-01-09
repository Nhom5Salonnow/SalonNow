// Salon Types

export interface SalonOwner {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Salon {
  id: string;
  ownerId: string;
  owner?: SalonOwner;
  name: string;
  address: string;
  description?: string;
  phoneNumber?: string;
  email?: string;
  logo?: string;
  images?: string[];
  openTime?: string;
  closeTime?: string;
  workingDays?: number[];
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  serviceCount?: number;
  stylistCount?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSalonRequest {
  name: string;
  address: string;
  description?: string;
  phone?: string;
  email?: string;
  logo?: string;
  images?: string[];
  openTime?: string;
  closeTime?: string;
  workingDays?: number[];
  latitude?: number;
  longitude?: number;
}

export interface UpdateSalonRequest extends Partial<CreateSalonRequest> {}

export interface SalonSearchParams {
  keyword?: string;
  page?: number;
  limit?: number;
}
