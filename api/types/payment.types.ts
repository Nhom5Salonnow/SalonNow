// Payment Types

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'card' | 'cash' | 'wallet';

export interface PaymentBooking {
  id: string;
  service?: {
    name: string;
  };
  salon?: {
    name: string;
  };
  startTime: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  booking?: PaymentBooking;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  refundedAt?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  paymentMethodId?: string;
}

export interface PaymentMethodInfo {
  id: string;
  userId: string;
  type: 'card' | 'wallet';
  last4?: string;
  cardHolderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  brand?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreatePaymentMethodRequest {
  type: 'card' | 'wallet';
  cardNumber?: string;
  cardHolderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  isDefault?: boolean;
}

export interface RefundPaymentRequest {
  reason: string;
}

export interface PaymentSearchParams {
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
