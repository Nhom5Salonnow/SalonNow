// Common API Types

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common error
export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}

// Empty response for delete operations
export type EmptyResponse = null | undefined;
