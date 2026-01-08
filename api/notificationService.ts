import { Notification, NotificationPreferences, ApiResponse } from './mockServer/types';
import { mockDatabase, generateId, getCurrentTimestamp } from './mockServer/database';
import { withDelay } from './mockServer/delay';

// Simple notification for UI
export interface SimpleNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
  actions?: { label: string; route: string }[];
}

export interface NotificationGroup {
  date: string;
  label: string;
  notifications: SimpleNotification[];
}

class NotificationService {
  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string): Promise<ApiResponse<SimpleNotification[]>> {
    return withDelay(() => {
      const notifications = mockDatabase.notifications
        .filter((n) => n.userId === userId)
        .map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.body,
          read: n.read,
          createdAt: n.createdAt,
          data: n.data,
          actions: n.actions,
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        success: true,
        data: notifications,
      };
    });
  }

  /**
   * Get notifications grouped by date
   */
  async getGroupedNotifications(userId: string): Promise<ApiResponse<NotificationGroup[]>> {
    return withDelay(() => {
      const notifications = mockDatabase.notifications
        .filter((n) => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const groups: Map<string, SimpleNotification[]> = new Map();

      notifications.forEach((n) => {
        const date = new Date(n.createdAt);
        const dateKey = date.toDateString();

        if (!groups.has(dateKey)) {
          groups.set(dateKey, []);
        }

        groups.get(dateKey)!.push({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.body,
          read: n.read,
          createdAt: n.createdAt,
          data: n.data,
          actions: n.actions,
        });
      });

      const result: NotificationGroup[] = [];
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      groups.forEach((notifs, dateKey) => {
        const date = new Date(dateKey);
        let label: string;

        if (date.toDateString() === today.toDateString()) {
          label = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
          label = 'Yesterday';
        } else {
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        result.push({
          date: dateKey,
          label,
          notifications: notifs,
        });
      });

      return {
        success: true,
        data: result,
      };
    });
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<ApiResponse<number>> {
    return withDelay(() => {
      const count = mockDatabase.notifications.filter(
        (n) => n.userId === userId && !n.read
      ).length;

      return {
        success: true,
        data: count,
      };
    }, 50, 100);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const notification = mockDatabase.notifications.find((n) => n.id === notificationId);

      if (notification) {
        notification.read = true;
        return {
          success: true,
          data: true,
        };
      }

      return {
        success: false,
        data: false,
        error: 'Notification not found',
      };
    }, 50, 100);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<ApiResponse<number>> {
    return withDelay(() => {
      let count = 0;

      mockDatabase.notifications.forEach((n) => {
        if (n.userId === userId && !n.read) {
          n.read = true;
          count++;
        }
      });

      return {
        success: true,
        data: count,
      };
    });
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const index = mockDatabase.notifications.findIndex((n) => n.id === notificationId);

      if (index !== -1) {
        mockDatabase.notifications.splice(index, 1);
        return {
          success: true,
          data: true,
        };
      }

      return {
        success: false,
        data: false,
        error: 'Notification not found',
      };
    });
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId: string): Promise<ApiResponse<number>> {
    return withDelay(() => {
      const initialLength = mockDatabase.notifications.length;

      // Filter out user's notifications
      const remaining = mockDatabase.notifications.filter((n) => n.userId !== userId);
      const deletedCount = initialLength - remaining.length;

      // Update the array (can't reassign, so splice and push)
      mockDatabase.notifications.length = 0;
      remaining.forEach((n) => mockDatabase.notifications.push(n));

      return {
        success: true,
        data: deletedCount,
      };
    });
  }

  /**
   * Get notification preferences
   */
  async getPreferences(userId: string): Promise<ApiResponse<NotificationPreferences | null>> {
    return withDelay(() => {
      const prefs = mockDatabase.notificationPreferences.find((p) => p.userId === userId);

      return {
        success: true,
        data: prefs || null,
      };
    });
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> {
    return withDelay(() => {
      let prefs = mockDatabase.notificationPreferences.find((p) => p.userId === userId);

      if (!prefs) {
        // Create default preferences
        prefs = {
          userId,
          pushEnabled: true,
          emailEnabled: true,
          smsEnabled: false,
          appointmentReminders: true,
          waitlistAlerts: true,
          promotions: true,
          reminderHoursBefore: [24, 1],
        };
        mockDatabase.notificationPreferences.push(prefs);
      }

      // Apply updates
      Object.assign(prefs, updates);

      return {
        success: true,
        data: prefs,
      };
    });
  }

  /**
   * Create a notification (internal use)
   */
  async createNotification(
    userId: string,
    type: string,
    title: string,
    body: string,
    data?: Record<string, any>,
    actions?: { label: string; route: string }[]
  ): Promise<ApiResponse<SimpleNotification>> {
    return withDelay(() => {
      const notification: Notification = {
        id: generateId('notif'),
        userId,
        type: type as any,
        title,
        body,
        data: data || {},
        read: false,
        createdAt: getCurrentTimestamp(),
        actions,
      };

      mockDatabase.notifications.push(notification);

      return {
        success: true,
        data: {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.body,
          read: notification.read,
          createdAt: notification.createdAt,
          data: notification.data,
          actions: notification.actions,
        },
      };
    }, 50, 100);
  }

  /**
   * Get notification icon and color based on type
   */
  getNotificationStyle(type: string): { icon: string; color: string; bgColor: string } {
    const styles: Record<string, { icon: string; color: string; bgColor: string }> = {
      appointment_confirmed: { icon: 'check-circle', color: '#10B981', bgColor: '#ECFDF5' },
      appointment_reminder_24h: { icon: 'clock', color: '#F59E0B', bgColor: '#FFFBEB' },
      appointment_reminder_1h: { icon: 'bell', color: '#EF4444', bgColor: '#FEF2F2' },
      appointment_cancelled: { icon: 'x-circle', color: '#EF4444', bgColor: '#FEF2F2' },
      appointment_rescheduled: { icon: 'refresh-cw', color: '#3B82F6', bgColor: '#EFF6FF' },
      waitlist_joined: { icon: 'users', color: '#8B5CF6', bgColor: '#F5F3FF' },
      waitlist_slot_available: { icon: 'star', color: '#10B981', bgColor: '#ECFDF5' },
      waitlist_position_update: { icon: 'trending-up', color: '#F59E0B', bgColor: '#FFFBEB' },
      waitlist_expired: { icon: 'clock', color: '#6B7280', bgColor: '#F3F4F6' },
      payment_success: { icon: 'credit-card', color: '#10B981', bgColor: '#ECFDF5' },
      payment_failed: { icon: 'alert-triangle', color: '#EF4444', bgColor: '#FEF2F2' },
      review_request: { icon: 'message-square', color: '#3B82F6', bgColor: '#EFF6FF' },
      promo_offer: { icon: 'tag', color: '#EC4899', bgColor: '#FDF2F8' },
      system_update: { icon: 'info', color: '#6B7280', bgColor: '#F3F4F6' },
    };

    return styles[type] || { icon: 'bell', color: '#6B7280', bgColor: '#F3F4F6' };
  }
}

export const notificationService = new NotificationService();
