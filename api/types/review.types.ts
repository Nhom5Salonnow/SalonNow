// Review Types

export interface ReviewUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  user?: ReviewUser;
  salonId: string;
  serviceId: string;
  stylistId?: string;
  overallRating: number;
  serviceRating?: number;
  stylistRating?: number;
  comment?: string;
  images?: string[];
  ownerResponse?: string;
  ownerRespondedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  overallRating: number;
  serviceRating?: number;
  stylistRating?: number;
  comment?: string;
  images?: string[];
}

export interface UpdateReviewRequest {
  overallRating?: number;
  serviceRating?: number;
  stylistRating?: number;
  comment?: string;
  images?: string[];
}

export interface RespondReviewRequest {
  response: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

export interface ReviewSearchParams {
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// Feedback Types
export type FeedbackType = 'bug' | 'feature' | 'complaint' | 'suggestion' | 'other';
export type FeedbackStatus = 'pending' | 'in_review' | 'resolved' | 'closed';

export interface FeedbackUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Feedback {
  id: string;
  userId: string;
  user?: FeedbackUser;
  type: FeedbackType;
  subject: string;
  message: string;
  attachments?: string[];
  status: FeedbackStatus;
  adminResponse?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFeedbackRequest {
  type: FeedbackType;
  subject: string;
  message: string;
  attachments?: string[];
}

export interface RespondFeedbackRequest {
  response: string;
  status: FeedbackStatus;
}
