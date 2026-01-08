import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse, PaginatedResponse } from './types/common.types';
import {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  RespondReviewRequest,
  ReviewSummary,
  ReviewSearchParams,
  Feedback,
  CreateFeedbackRequest,
  RespondFeedbackRequest,
} from './types/review.types';

/**
 * Review API Service
 * ALL ENDPOINTS MAY NOT BE AVAILABLE YET
 * Will gracefully fail without crashing
 */
export const reviewApi = {
  /**
   * Create review
   */
  createReview: async (data: CreateReviewRequest): Promise<ApiResponse<Review>> => {
    return safeApiCallOptional(
      () => apiClient.post('/reviews', data),
      {} as Review
    );
  },

  /**
   * Get my reviews
   */
  getMyReviews: async (): Promise<ApiResponse<Review[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/reviews/my-reviews'),
      []
    );
  },

  /**
   * Get reviews by service
   */
  getServiceReviews: async (
    serviceId: string,
    params?: ReviewSearchParams
  ): Promise<ApiResponse<{ summary: ReviewSummary; items: Review[] }>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/reviews/service/${serviceId}`, { params }),
      {
        summary: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
        },
        items: [],
      }
    );
  },

  /**
   * Get reviews by salon
   */
  getSalonReviews: async (
    salonId: string,
    params?: ReviewSearchParams
  ): Promise<ApiResponse<{ summary: ReviewSummary; items: Review[] }>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/reviews/salon/${salonId}`, { params }),
      {
        summary: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
        },
        items: [],
      }
    );
  },

  /**
   * Get reviews by stylist
   */
  getStylistReviews: async (
    stylistId: string,
    params?: ReviewSearchParams
  ): Promise<ApiResponse<Review[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/reviews/stylist/${stylistId}`, { params }),
      []
    );
  },

  /**
   * Update review
   */
  updateReview: async (reviewId: string, data: UpdateReviewRequest): Promise<ApiResponse<Review>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/reviews/${reviewId}`, data),
      {} as Review
    );
  },

  /**
   * Delete review
   */
  deleteReview: async (reviewId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/reviews/${reviewId}`),
      null
    );
  },

  /**
   * Respond to review (salon owner)
   */
  respondToReview: async (reviewId: string, data: RespondReviewRequest): Promise<ApiResponse<Review>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/reviews/${reviewId}/respond`, data),
      {} as Review
    );
  },
};

/**
 * Feedback API Service
 * ALL ENDPOINTS MAY NOT BE AVAILABLE YET
 */
export const feedbackApi = {
  /**
   * Create feedback
   */
  createFeedback: async (data: CreateFeedbackRequest): Promise<ApiResponse<Feedback>> => {
    return safeApiCallOptional(
      () => apiClient.post('/feedback', data),
      {} as Feedback
    );
  },

  /**
   * Get all feedback (admin)
   */
  getFeedbackList: async (): Promise<ApiResponse<Feedback[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/feedback'),
      []
    );
  },

  /**
   * Get feedback by ID (admin)
   */
  getFeedbackById: async (feedbackId: string): Promise<ApiResponse<Feedback>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/feedback/${feedbackId}`),
      {} as Feedback
    );
  },

  /**
   * Respond to feedback (admin)
   */
  respondToFeedback: async (
    feedbackId: string,
    data: RespondFeedbackRequest
  ): Promise<ApiResponse<Feedback>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/feedback/${feedbackId}/respond`, data),
      {} as Feedback
    );
  },
};
