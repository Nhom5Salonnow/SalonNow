import apiClient from './apiClient';
import { safeApiCallOptional } from './apiHelper';
import { ApiResponse } from './types/common.types';
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

export const reviewApi = {
  createReview: async (data: CreateReviewRequest): Promise<ApiResponse<Review>> => {
    return safeApiCallOptional(
      () => apiClient.post('/reviews', data),
      {} as Review
    );
  },

  getMyReviews: async (): Promise<ApiResponse<Review[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/reviews/my-reviews'),
      []
    );
  },

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

  getStylistReviews: async (
    stylistId: string,
    params?: ReviewSearchParams
  ): Promise<ApiResponse<Review[]>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/reviews/stylist/${stylistId}`, { params }),
      []
    );
  },

  updateReview: async (reviewId: string, data: UpdateReviewRequest): Promise<ApiResponse<Review>> => {
    return safeApiCallOptional(
      () => apiClient.patch(`/reviews/${reviewId}`, data),
      {} as Review
    );
  },

  deleteReview: async (reviewId: string): Promise<ApiResponse<null>> => {
    return safeApiCallOptional(
      () => apiClient.delete(`/reviews/${reviewId}`),
      null
    );
  },

  respondToReview: async (reviewId: string, data: RespondReviewRequest): Promise<ApiResponse<Review>> => {
    return safeApiCallOptional(
      () => apiClient.post(`/reviews/${reviewId}/respond`, data),
      {} as Review
    );
  },
};

export const feedbackApi = {
  createFeedback: async (data: CreateFeedbackRequest): Promise<ApiResponse<Feedback>> => {
    return safeApiCallOptional(
      () => apiClient.post('/feedback', data),
      {} as Feedback
    );
  },

  getFeedbackList: async (): Promise<ApiResponse<Feedback[]>> => {
    return safeApiCallOptional(
      () => apiClient.get('/feedback'),
      []
    );
  },

  getFeedbackById: async (feedbackId: string): Promise<ApiResponse<Feedback>> => {
    return safeApiCallOptional(
      () => apiClient.get(`/feedback/${feedbackId}`),
      {} as Feedback
    );
  },

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
