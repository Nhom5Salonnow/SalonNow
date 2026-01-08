import { User, ApiResponse } from './mockServer/types';
import { mockDatabase, getCurrentTimestamp } from './mockServer/database';
import { withDelay } from './mockServer/delay';

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface UserStats {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalSpent: number;
  averageRating: number;
  reviewsGiven: number;
  memberSince: string;
  loyaltyPoints: number;
  favoriteServices: { serviceId: string; serviceName: string; count: number }[];
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

class UserService {
  /**
   * Get user by ID
   */
  async getUser(userId: string): Promise<ApiResponse<User | null>> {
    return withDelay(() => {
      const user = mockDatabase.users.find((u) => u.id === userId);

      if (user) {
        // Don't return password
        const { password, ...userWithoutPassword } = user as User & { password?: string };
        return {
          success: true,
          data: userWithoutPassword as User,
        };
      }

      return {
        success: false,
        data: null,
        error: 'User not found',
      };
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: UpdateProfileInput): Promise<ApiResponse<User>> {
    return withDelay(() => {
      const userIndex = mockDatabase.users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return {
          success: false,
          data: null as unknown as User,
          error: 'User not found',
        };
      }

      // Check email uniqueness if changing email
      if (updates.email) {
        const existingEmail = mockDatabase.users.find(
          (u) => u.email === updates.email && u.id !== userId
        );
        if (existingEmail) {
          return {
            success: false,
            data: null as unknown as User,
            error: 'Email already in use',
          };
        }
      }

      // Apply updates
      const user = mockDatabase.users[userIndex];
      Object.assign(user, updates);

      return {
        success: true,
        data: user,
      };
    });
  }

  /**
   * Update avatar
   */
  async updateAvatar(userId: string, avatarUrl: string): Promise<ApiResponse<User>> {
    return withDelay(() => {
      const user = mockDatabase.users.find((u) => u.id === userId);

      if (!user) {
        return {
          success: false,
          data: null as unknown as User,
          error: 'User not found',
        };
      }

      user.avatar = avatarUrl;

      return {
        success: true,
        data: user,
      };
    }, 500, 1000);
  }

  /**
   * Change password
   */
  async changePassword(userId: string, input: ChangePasswordInput): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const user = mockDatabase.users.find((u) => u.id === userId) as User & { password?: string };

      if (!user) {
        return {
          success: false,
          data: false,
          error: 'User not found',
        };
      }

      // In mock, we just simulate password check
      // In real app, would verify current password hash
      if (input.currentPassword.length < 6) {
        return {
          success: false,
          data: false,
          error: 'Current password is incorrect',
        };
      }

      if (input.newPassword.length < 6) {
        return {
          success: false,
          data: false,
          error: 'New password must be at least 6 characters',
        };
      }

      // Update password (in real app, would hash)
      user.password = input.newPassword;

      return {
        success: true,
        data: true,
      };
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<ApiResponse<UserStats>> {
    return withDelay(() => {
      const user = mockDatabase.users.find((u) => u.id === userId);

      if (!user) {
        return {
          success: false,
          data: null as unknown as UserStats,
          error: 'User not found',
        };
      }

      // Calculate stats from mock data
      const userAppointments = mockDatabase.appointments.filter((a: any) => a.userId === userId);
      const completedAppointments = userAppointments.filter((a: any) => a.status === 'completed');
      const cancelledAppointments = userAppointments.filter((a: any) => a.status === 'cancelled');

      const userPayments = mockDatabase.payments.filter((p) => p.userId === userId);
      const totalSpent = userPayments.reduce((sum, p) => sum + p.total, 0);

      const userReviews = mockDatabase.reviews.filter((r) => r.userId === userId);
      const averageRating = userReviews.length > 0
        ? userReviews.reduce((sum, r) => sum + r.overallRating, 0) / userReviews.length
        : 0;

      // Count favorite services
      const serviceCount: Record<string, { serviceId: string; serviceName: string; count: number }> = {};
      completedAppointments.forEach((apt: any) => {
        const service = mockDatabase.services.find((s) => s.id === apt.serviceId);
        if (service) {
          if (!serviceCount[apt.serviceId]) {
            serviceCount[apt.serviceId] = { serviceId: apt.serviceId, serviceName: service.name, count: 0 };
          }
          serviceCount[apt.serviceId].count++;
        }
      });

      const favoriteServices = Object.values(serviceCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        success: true,
        data: {
          totalAppointments: userAppointments.length,
          completedAppointments: completedAppointments.length,
          cancelledAppointments: cancelledAppointments.length,
          totalSpent,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewsGiven: userReviews.length,
          memberSince: user.createdAt || getCurrentTimestamp(),
          loyaltyPoints: Math.floor(totalSpent / 10), // 1 point per $10 spent
          favoriteServices,
        },
      };
    });
  }

  /**
   * Delete account
   */
  async deleteAccount(userId: string, password: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const userIndex = mockDatabase.users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return {
          success: false,
          data: false,
          error: 'User not found',
        };
      }

      // Verify password (simulated)
      if (password.length < 6) {
        return {
          success: false,
          data: false,
          error: 'Incorrect password',
        };
      }

      // Remove user (in real app, might soft delete)
      mockDatabase.users.splice(userIndex, 1);

      return {
        success: true,
        data: true,
      };
    }, 500, 1000);
  }

  /**
   * Get user's favorite salons
   */
  async getFavoriteSalons(userId: string): Promise<ApiResponse<string[]>> {
    return withDelay(() => {
      const user = mockDatabase.users.find((u) => u.id === userId);

      if (!user) {
        return {
          success: false,
          data: [],
          error: 'User not found',
        };
      }

      // Get salons user has visited multiple times
      const salonVisits: Record<string, number> = {};
      mockDatabase.appointments
        .filter((a: any) => a.userId === userId && a.status === 'completed')
        .forEach((apt: any) => {
          salonVisits[apt.salonId] = (salonVisits[apt.salonId] || 0) + 1;
        });

      const favoriteSalonIds = Object.entries(salonVisits)
        .filter(([_, count]) => count >= 2)
        .map(([salonId]) => salonId);

      return {
        success: true,
        data: favoriteSalonIds,
      };
    });
  }

  /**
   * Toggle favorite salon
   */
  async toggleFavoriteSalon(userId: string, salonId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      // In a real app, this would be stored in a favorites table
      // For mock, we just return success
      return {
        success: true,
        data: true,
      };
    });
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(userId: string, limit: number = 10): Promise<ApiResponse<{
    type: 'appointment' | 'payment' | 'review' | 'waitlist';
    title: string;
    description: string;
    timestamp: string;
    data?: Record<string, any>;
  }[]>> {
    return withDelay(() => {
      const activities: {
        type: 'appointment' | 'payment' | 'review' | 'waitlist';
        title: string;
        description: string;
        timestamp: string;
        data?: Record<string, any>;
      }[] = [];

      // Add appointments
      mockDatabase.appointments
        .filter((a: any) => a.userId === userId)
        .forEach((apt: any) => {
          const service = mockDatabase.services.find((s) => s.id === apt.serviceId);
          activities.push({
            type: 'appointment',
            title: apt.status === 'completed' ? 'Appointment Completed' :
                   apt.status === 'cancelled' ? 'Appointment Cancelled' : 'Appointment Booked',
            description: service?.name || 'Unknown Service',
            timestamp: apt.createdAt,
            data: { appointmentId: apt.id },
          });
        });

      // Add payments
      mockDatabase.payments
        .filter((p) => p.userId === userId)
        .forEach((payment) => {
          activities.push({
            type: 'payment',
            title: 'Payment Made',
            description: `$${payment.total.toFixed(2)}`,
            timestamp: payment.createdAt,
            data: { paymentId: payment.id },
          });
        });

      // Add reviews
      mockDatabase.reviews
        .filter((r) => r.userId === userId)
        .forEach((review) => {
          activities.push({
            type: 'review',
            title: 'Review Posted',
            description: `${review.overallRating} stars`,
            timestamp: review.createdAt,
            data: { reviewId: review.id },
          });
        });

      // Sort by timestamp and limit
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        success: true,
        data: activities.slice(0, limit),
      };
    });
  }
}

export const userService = new UserService();
