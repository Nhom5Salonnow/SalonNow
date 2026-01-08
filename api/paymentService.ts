import { Payment, PaymentMethod, ApiResponse } from './mockServer/types';
import { mockDatabase, generateId, getCurrentTimestamp } from './mockServer/database';
import { withDelay } from './mockServer/delay';

export interface PaymentSummary {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export interface ProcessPaymentInput {
  appointmentId: string;
  userId: string;
  paymentMethodId: string;
  amount: number;
  tip?: number;
}

export interface AddCardInput {
  userId: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  holderName: string;
  setAsDefault?: boolean;
}

class PaymentService {
  /**
   * Get user's payment methods
   */
  async getPaymentMethods(userId: string): Promise<ApiResponse<PaymentMethod[]>> {
    return withDelay(() => {
      const methods = mockDatabase.paymentMethods.filter((m) => m.userId === userId);

      // Sort by default first, then by creation date
      methods.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return {
        success: true,
        data: methods,
      };
    });
  }

  /**
   * Get default payment method
   */
  async getDefaultPaymentMethod(userId: string): Promise<ApiResponse<PaymentMethod | null>> {
    return withDelay(() => {
      const method = mockDatabase.paymentMethods.find(
        (m) => m.userId === userId && m.isDefault
      );

      return {
        success: true,
        data: method || null,
      };
    }, 50, 100);
  }

  /**
   * Add a new card
   */
  async addCard(input: AddCardInput): Promise<ApiResponse<PaymentMethod>> {
    return withDelay(() => {
      // Detect card brand from number
      const cardBrand = this.detectCardBrand(input.cardNumber);
      const lastFour = input.cardNumber.slice(-4);

      // If setting as default, unset other defaults
      if (input.setAsDefault) {
        mockDatabase.paymentMethods.forEach((m) => {
          if (m.userId === input.userId) {
            m.isDefault = false;
          }
        });
      }

      const newCard: PaymentMethod = {
        id: generateId('pm'),
        userId: input.userId,
        type: 'card',
        cardBrand,
        lastFourDigits: lastFour,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
        holderName: input.holderName.toUpperCase(),
        isDefault: input.setAsDefault || mockDatabase.paymentMethods.filter(m => m.userId === input.userId).length === 0,
        isVerified: true,
        createdAt: getCurrentTimestamp(),
      };

      mockDatabase.paymentMethods.push(newCard);

      return {
        success: true,
        data: newCard,
      };
    }, 500, 1000);
  }

  /**
   * Remove a payment method
   */
  async removePaymentMethod(methodId: string, userId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const index = mockDatabase.paymentMethods.findIndex(
        (m) => m.id === methodId && m.userId === userId
      );

      if (index === -1) {
        return {
          success: false,
          data: false,
          error: 'Payment method not found',
        };
      }

      const wasDefault = mockDatabase.paymentMethods[index].isDefault;
      mockDatabase.paymentMethods.splice(index, 1);

      // If removed default, set another as default
      if (wasDefault) {
        const remaining = mockDatabase.paymentMethods.find((m) => m.userId === userId);
        if (remaining) {
          remaining.isDefault = true;
        }
      }

      return {
        success: true,
        data: true,
      };
    });
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(methodId: string, userId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const method = mockDatabase.paymentMethods.find(
        (m) => m.id === methodId && m.userId === userId
      );

      if (!method) {
        return {
          success: false,
          data: false,
          error: 'Payment method not found',
        };
      }

      // Unset all defaults for user
      mockDatabase.paymentMethods.forEach((m) => {
        if (m.userId === userId) {
          m.isDefault = m.id === methodId;
        }
      });

      return {
        success: true,
        data: true,
      };
    });
  }

  /**
   * Calculate payment summary
   */
  async calculateSummary(
    servicePrice: number,
    discount?: number,
    tip?: number
  ): Promise<ApiResponse<PaymentSummary>> {
    return withDelay(() => {
      const subtotal = servicePrice + (tip || 0);
      const discountAmount = discount || 0;
      const taxableAmount = subtotal - discountAmount;
      const tax = Math.round(taxableAmount * 0.1); // 10% tax
      const total = taxableAmount + tax;

      return {
        success: true,
        data: {
          subtotal,
          tax,
          discount: discountAmount,
          total,
          currency: 'USD',
        },
      };
    }, 50, 100);
  }

  /**
   * Process payment
   */
  async processPayment(input: ProcessPaymentInput): Promise<ApiResponse<Payment>> {
    return withDelay(() => {
      // Verify payment method
      const paymentMethod = mockDatabase.paymentMethods.find(
        (m) => m.id === input.paymentMethodId && m.userId === input.userId
      );

      if (!paymentMethod) {
        return {
          success: false,
          data: null as unknown as Payment,
          error: 'Invalid payment method',
        };
      }

      // Calculate amounts
      const subtotal = input.amount;
      const tax = Math.round(subtotal * 0.1);
      const total = subtotal + tax + (input.tip || 0);

      // Create payment record
      const payment: Payment = {
        id: generateId('pay'),
        appointmentId: input.appointmentId,
        userId: input.userId,
        subtotal,
        tax,
        discount: 0,
        total,
        currency: 'USD',
        status: 'completed',
        paymentMethodId: input.paymentMethodId,
        paymentMethodType: paymentMethod.type,
        createdAt: getCurrentTimestamp(),
        completedAt: getCurrentTimestamp(),
        receiptNumber: `RCP-${Date.now()}`,
      };

      mockDatabase.payments.push(payment);

      // Update appointment payment status
      const appointment = mockDatabase.appointments.find((a) => a.id === input.appointmentId);
      if (appointment) {
        appointment.paymentStatus = 'paid';
      }

      // Create notification
      mockDatabase.notifications.push({
        id: generateId('notif'),
        userId: input.userId,
        type: 'payment_success',
        title: 'Payment Successful',
        body: `Your payment of $${total.toFixed(2)} has been processed successfully.`,
        data: { paymentId: payment.id, appointmentId: input.appointmentId },
        read: false,
        createdAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        data: payment,
      };
    }, 1000, 2000); // Simulate payment processing time
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId: string): Promise<ApiResponse<Payment[]>> {
    return withDelay(() => {
      const payments = mockDatabase.payments
        .filter((p) => p.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        success: true,
        data: payments,
      };
    });
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<ApiResponse<Payment | null>> {
    return withDelay(() => {
      const payment = mockDatabase.payments.find((p) => p.id === paymentId);

      return {
        success: true,
        data: payment || null,
      };
    });
  }

  /**
   * Request refund
   */
  async requestRefund(
    paymentId: string,
    userId: string,
    reason: string
  ): Promise<ApiResponse<Payment>> {
    return withDelay(() => {
      const payment = mockDatabase.payments.find(
        (p) => p.id === paymentId && p.userId === userId
      );

      if (!payment) {
        return {
          success: false,
          data: null as unknown as Payment,
          error: 'Payment not found',
        };
      }

      if (payment.status !== 'completed') {
        return {
          success: false,
          data: null as unknown as Payment,
          error: 'Only completed payments can be refunded',
        };
      }

      // Process refund
      payment.status = 'refunded';

      // Create notification
      mockDatabase.notifications.push({
        id: generateId('notif'),
        userId,
        type: 'payment_success',
        title: 'Refund Processed',
        body: `Your refund of $${payment.total.toFixed(2)} has been initiated. It may take 3-5 business days to appear in your account.`,
        data: { paymentId: payment.id },
        read: false,
        createdAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        data: payment,
      };
    }, 500, 1000);
  }

  /**
   * Validate promo code
   */
  async validatePromoCode(code: string): Promise<ApiResponse<{ valid: boolean; discount: number; description: string }>> {
    return withDelay(() => {
      const promoCodes: Record<string, { discount: number; description: string }> = {
        'WELCOME10': { discount: 10, description: '10% off for new customers' },
        'SUMMER20': { discount: 20, description: '20% summer discount' },
        'VIP25': { discount: 25, description: '25% VIP member discount' },
        'FIRST50': { discount: 50, description: '50% off first booking' },
      };

      const promo = promoCodes[code.toUpperCase()];

      if (promo) {
        return {
          success: true,
          data: {
            valid: true,
            discount: promo.discount,
            description: promo.description,
          },
        };
      }

      return {
        success: true,
        data: {
          valid: false,
          discount: 0,
          description: 'Invalid promo code',
        },
      };
    }, 200, 400);
  }

  // Helper to detect card brand
  private detectCardBrand(cardNumber: string): 'visa' | 'mastercard' | 'amex' | 'jcb' {
    const firstDigit = cardNumber[0];
    const firstTwo = cardNumber.substring(0, 2);

    if (firstDigit === '4') return 'visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'mastercard';
    if (['34', '37'].includes(firstTwo)) return 'amex';
    if (firstTwo === '35') return 'jcb';

    return 'visa'; // Default
  }
}

export const paymentService = new PaymentService();
