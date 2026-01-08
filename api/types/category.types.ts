// Category Types

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  quote?: string;
  icon?: string;
  image?: string;
  displayOrder: number;
  serviceCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CategorySearchParams {
  isActive?: boolean;
}
