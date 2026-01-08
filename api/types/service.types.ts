// Service Types

export interface ServiceSalon {
  id: string;
  name: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  salonId: string;
  salon?: ServiceSalon;
  categoryId?: string;
  category?: ServiceCategory;
  name: string;
  price: number;
  duration: number;
  description?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateServiceRequest {
  salonId: string;
  categoryId?: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  images?: string[];
  isActive?: boolean;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

export interface ServiceSearchParams {
  salonId?: string;
  categoryId?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}
