// Notification Types

export type NotificationType =
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_reminder'
  | 'waitlist_available'
  | 'payment_success'
  | 'review_reply'
  | 'system';

export interface NotificationData {
  bookingId?: string;
  salonId?: string;
  reviewId?: string;
  paymentId?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: NotificationData;
  isRead: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}
