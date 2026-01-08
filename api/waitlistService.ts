// Waitlist Service - Smart Waitlist Management
// This service handles all waitlist operations

import {
  ApiResponse,
  WaitlistEntry,
  WaitlistStatus,
  Notification,
  waitlist,
  notifications,
  users,
  services,
  staff as staffList,
  salons,
  generateId,
  getCurrentTimestamp,
  simulateDelay,
} from './mockServer';

// Types
export interface JoinWaitlistInput {
  userId: string;
  salonId: string;
  serviceId: string;
  staffId?: string;
  preferredDate: string;
  preferredTimeSlots: string[];
  notifyVia: ('push' | 'sms' | 'email')[];
}

export interface WaitlistFilters {
  status?: WaitlistStatus;
  salonId?: string;
  serviceId?: string;
}

// Service Implementation
class WaitlistService {
  /**
   * Get user's waitlist entries
   */
  async getUserWaitlist(userId: string): Promise<ApiResponse<WaitlistEntry[]>> {
    await simulateDelay();

    const userWaitlist = waitlist.filter(w => w.userId === userId);

    return {
      success: true,
      data: userWaitlist.sort((a, b) =>
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
      ),
    };
  }

  /**
   * Get a single waitlist entry by ID
   */
  async getWaitlistEntry(id: string): Promise<ApiResponse<WaitlistEntry | null>> {
    await simulateDelay();

    const entry = waitlist.find(w => w.id === id);

    if (!entry) {
      return {
        success: false,
        data: null,
        error: 'Waitlist entry not found',
      };
    }

    return {
      success: true,
      data: entry,
    };
  }

  /**
   * Join a waitlist
   */
  async joinWaitlist(input: JoinWaitlistInput): Promise<ApiResponse<WaitlistEntry>> {
    await simulateDelay(300, 600);

    // Validate user
    const user = users.find(u => u.id === input.userId);
    if (!user) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'User not found',
      };
    }

    // Check if already on waitlist for same service/date
    const existing = waitlist.find(
      w =>
        w.userId === input.userId &&
        w.serviceId === input.serviceId &&
        w.preferredDate === input.preferredDate &&
        w.status === 'waiting'
    );

    if (existing) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'You are already on the waitlist for this service on this date',
      };
    }

    // Get service and salon details
    const service = services.find(s => s.id === input.serviceId);
    const salon = salons.find(s => s.id === input.salonId);
    const selectedStaff = input.staffId
      ? staffList.find(s => s.id === input.staffId)
      : undefined;

    if (!service || !salon) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'Service or salon not found',
      };
    }

    // Calculate position (count existing waitlist for same service/date)
    const position = waitlist.filter(
      w =>
        w.serviceId === input.serviceId &&
        w.preferredDate === input.preferredDate &&
        w.status === 'waiting'
    ).length + 1;

    // Create waitlist entry
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newEntry: WaitlistEntry = {
      id: generateId('wl'),
      userId: input.userId,
      userName: user.name,
      userPhone: user.phone,
      salonId: input.salonId,
      salonName: salon.name,
      serviceId: input.serviceId,
      serviceName: service.name,
      staffId: input.staffId,
      staffName: selectedStaff?.name,
      preferredDate: input.preferredDate,
      preferredTimeSlots: input.preferredTimeSlots,
      status: 'waiting',
      position,
      joinedAt: getCurrentTimestamp(),
      expiresAt: expiresAt.toISOString(),
      notifyVia: input.notifyVia,
    };

    // Add to waitlist
    waitlist.push(newEntry);

    // Create notification
    const notification: Notification = {
      id: generateId('notif'),
      userId: input.userId,
      type: 'waitlist_joined',
      title: 'Added to Waitlist',
      body: `You're #${position} on the waitlist for ${service.name} on ${input.preferredDate}. We'll notify you when a slot opens!`,
      data: { waitlistId: newEntry.id },
      read: false,
      createdAt: getCurrentTimestamp(),
    };
    notifications.push(notification);

    return {
      success: true,
      data: newEntry,
      message: `You've been added to the waitlist at position #${position}`,
    };
  }

  /**
   * Cancel a waitlist entry
   */
  async cancelWaitlist(id: string, userId: string): Promise<ApiResponse<WaitlistEntry>> {
    await simulateDelay();

    const entryIndex = waitlist.findIndex(w => w.id === id);

    if (entryIndex === -1) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'Waitlist entry not found',
      };
    }

    const entry = waitlist[entryIndex];

    if (entry.userId !== userId) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'You can only cancel your own waitlist entries',
      };
    }

    if (entry.status !== 'waiting' && entry.status !== 'slot_available') {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'This waitlist entry cannot be cancelled',
      };
    }

    // Update status
    entry.status = 'cancelled';
    waitlist[entryIndex] = entry;

    // Update positions for others
    this.updatePositions(entry.serviceId, entry.preferredDate);

    return {
      success: true,
      data: entry,
      message: 'Waitlist entry cancelled successfully',
    };
  }

  /**
   * Simulate a slot becoming available (for testing)
   */
  async simulateSlotAvailable(
    waitlistId: string,
    slotDate: string,
    slotTime: string
  ): Promise<ApiResponse<WaitlistEntry>> {
    await simulateDelay();

    const entryIndex = waitlist.findIndex(w => w.id === waitlistId);

    if (entryIndex === -1) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'Waitlist entry not found',
      };
    }

    const entry = waitlist[entryIndex];

    if (entry.status !== 'waiting') {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'This entry is no longer waiting',
      };
    }

    // Set available slot (expires in 5 minutes)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    entry.status = 'slot_available';
    entry.availableSlot = {
      date: slotDate,
      time: slotTime,
      notifiedAt: getCurrentTimestamp(),
      expiresAt: expiresAt.toISOString(),
    };

    waitlist[entryIndex] = entry;

    // Create notification
    const notification: Notification = {
      id: generateId('notif'),
      userId: entry.userId,
      type: 'waitlist_slot_available',
      title: 'Slot Available!',
      body: `A slot for ${entry.serviceName} is now available on ${slotDate} at ${slotTime}. Confirm within 5 minutes!`,
      data: { waitlistId: entry.id },
      read: false,
      createdAt: getCurrentTimestamp(),
      actions: [
        { label: 'Book Now', route: `/waitlist/${entry.id}` },
      ],
    };
    notifications.push(notification);

    return {
      success: true,
      data: entry,
      message: 'Slot available notification sent!',
    };
  }

  /**
   * Confirm a waitlist slot (convert to appointment)
   */
  async confirmSlot(waitlistId: string, userId: string): Promise<ApiResponse<{ appointmentId: string }>> {
    await simulateDelay(300, 600);

    const entryIndex = waitlist.findIndex(w => w.id === waitlistId);

    if (entryIndex === -1) {
      return {
        success: false,
        data: { appointmentId: '' },
        error: 'Waitlist entry not found',
      };
    }

    const entry = waitlist[entryIndex];

    if (entry.userId !== userId) {
      return {
        success: false,
        data: { appointmentId: '' },
        error: 'Unauthorized',
      };
    }

    if (entry.status !== 'slot_available' || !entry.availableSlot) {
      return {
        success: false,
        data: { appointmentId: '' },
        error: 'No available slot to confirm',
      };
    }

    // Check if slot expired
    if (new Date(entry.availableSlot.expiresAt) < new Date()) {
      entry.status = 'expired';
      waitlist[entryIndex] = entry;

      return {
        success: false,
        data: { appointmentId: '' },
        error: 'Slot has expired. You will be notified when another slot becomes available.',
      };
    }

    // Mark as confirmed
    entry.status = 'confirmed';
    entry.convertedAppointmentId = generateId('apt');
    waitlist[entryIndex] = entry;

    // Update positions for others
    this.updatePositions(entry.serviceId, entry.preferredDate);

    return {
      success: true,
      data: { appointmentId: entry.convertedAppointmentId },
      message: 'Slot confirmed! Redirecting to payment...',
    };
  }

  /**
   * Skip a slot (pass to next person)
   */
  async skipSlot(waitlistId: string, userId: string): Promise<ApiResponse<WaitlistEntry>> {
    await simulateDelay();

    const entryIndex = waitlist.findIndex(w => w.id === waitlistId);

    if (entryIndex === -1) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'Waitlist entry not found',
      };
    }

    const entry = waitlist[entryIndex];

    if (entry.userId !== userId) {
      return {
        success: false,
        data: {} as WaitlistEntry,
        error: 'Unauthorized',
      };
    }

    // Reset to waiting status, move to back of queue
    const maxPosition = Math.max(
      ...waitlist
        .filter(w => w.serviceId === entry.serviceId && w.preferredDate === entry.preferredDate && w.status === 'waiting')
        .map(w => w.position),
      0
    );

    entry.status = 'waiting';
    entry.position = maxPosition + 1;
    entry.availableSlot = undefined;
    waitlist[entryIndex] = entry;

    return {
      success: true,
      data: entry,
      message: 'Slot skipped. You have been moved to the back of the queue.',
    };
  }

  /**
   * Get waitlist for admin (salon owner)
   */
  async getAdminWaitlist(
    salonId: string,
    filters?: WaitlistFilters
  ): Promise<ApiResponse<WaitlistEntry[]>> {
    await simulateDelay();

    let result = waitlist.filter(w => w.salonId === salonId);

    if (filters?.status) {
      result = result.filter(w => w.status === filters.status);
    }

    if (filters?.serviceId) {
      result = result.filter(w => w.serviceId === filters.serviceId);
    }

    return {
      success: true,
      data: result.sort((a, b) => a.position - b.position),
      meta: {
        total: result.length,
      },
    };
  }

  /**
   * Get waitlist statistics for a date
   */
  async getWaitlistStats(salonId: string, date: string): Promise<ApiResponse<{
    totalWaiting: number;
    avgWaitTime: number;
    conversionRate: number;
    byService: { serviceId: string; serviceName: string; count: number }[];
  }>> {
    await simulateDelay();

    const dateWaitlist = waitlist.filter(
      w => w.salonId === salonId && w.preferredDate === date
    );

    const waiting = dateWaitlist.filter(w => w.status === 'waiting').length;
    const confirmed = dateWaitlist.filter(w => w.status === 'confirmed').length;
    const total = dateWaitlist.length;

    // Group by service
    const byService = dateWaitlist.reduce((acc, w) => {
      const existing = acc.find(s => s.serviceId === w.serviceId);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ serviceId: w.serviceId, serviceName: w.serviceName, count: 1 });
      }
      return acc;
    }, [] as { serviceId: string; serviceName: string; count: number }[]);

    return {
      success: true,
      data: {
        totalWaiting: waiting,
        avgWaitTime: 45, // Mock: 45 minutes average
        conversionRate: total > 0 ? (confirmed / total) * 100 : 0,
        byService,
      },
    };
  }

  /**
   * Update positions after a change
   */
  private updatePositions(serviceId: string, date: string): void {
    const relevantEntries = waitlist
      .filter(w => w.serviceId === serviceId && w.preferredDate === date && w.status === 'waiting')
      .sort((a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime());

    relevantEntries.forEach((entry, index) => {
      const entryIndex = waitlist.findIndex(w => w.id === entry.id);
      if (entryIndex !== -1) {
        waitlist[entryIndex].position = index + 1;

        // Create notification for position update
        if (entry.position !== index + 1) {
          const notification: Notification = {
            id: generateId('notif'),
            userId: entry.userId,
            type: 'waitlist_position_update',
            title: 'Queue Position Updated',
            body: `You're now #${index + 1} on the waitlist for ${entry.serviceName}`,
            data: { waitlistId: entry.id },
            read: false,
            createdAt: getCurrentTimestamp(),
          };
          notifications.push(notification);
        }
      }
    });
  }
}

export const waitlistService = new WaitlistService();
