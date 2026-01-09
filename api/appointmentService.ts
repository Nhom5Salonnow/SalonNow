import { Appointment, ApiResponse, NotificationType } from './mockServer/types';
import { mockDatabase, generateId, getCurrentTimestamp } from './mockServer/database';
import { withDelay } from './mockServer/delay';

export interface SimpleTimeSlot {
  time: string;
  available: boolean;
  bookedBy?: string;
}

export interface SimpleAppointment {
  id: string;
  serviceName: string;
  staffName: string;
  salonName: string;
  date: string;
  time: string;
  status: string;
  price: number;
}

export interface CreateAppointmentInput {
  userId: string;
  salonId: string;
  salonName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  staffId?: string;
  staffName?: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
}

export interface RescheduleInput {
  appointmentId: string;
  userId: string;
  newDate: string;
  newTime: string;
  reason?: string;
}

export interface CancelInput {
  appointmentId: string;
  userId: string;
  reason?: string;
}

class AppointmentService {
  async getUserAppointments(userId: string): Promise<ApiResponse<Appointment[]>> {
    return withDelay(() => {
      const appointments = mockDatabase.appointments.filter(
        (a: Appointment) => a.userId === userId
      );

      appointments.sort((a: Appointment, b: Appointment) =>
        new Date(b.date + ' ' + b.time).getTime() -
        new Date(a.date + ' ' + a.time).getTime()
      );

      return {
        success: true,
        data: appointments,
      };
    });
  }

  async getUpcomingAppointments(userId: string): Promise<ApiResponse<Appointment[]>> {
    return withDelay(() => {
      const now = new Date();
      const appointments = mockDatabase.appointments.filter((a: Appointment) => {
        const appointmentDate = new Date(a.date + ' ' + a.time);
        return (
          a.userId === userId &&
          appointmentDate >= now &&
          ['pending', 'confirmed'].includes(a.status)
        );
      });

      appointments.sort((a: Appointment, b: Appointment) =>
        new Date(a.date + ' ' + a.time).getTime() -
        new Date(b.date + ' ' + b.time).getTime()
      );

      return {
        success: true,
        data: appointments,
      };
    });
  }

  async getPastAppointments(userId: string): Promise<ApiResponse<Appointment[]>> {
    return withDelay(() => {
      const now = new Date();
      const appointments = mockDatabase.appointments.filter((a: Appointment) => {
        const appointmentDate = new Date(a.date + ' ' + a.time);
        return (
          a.userId === userId &&
          (appointmentDate < now || ['completed', 'cancelled', 'no_show'].includes(a.status))
        );
      });

      appointments.sort((a: Appointment, b: Appointment) =>
        new Date(b.date + ' ' + b.time).getTime() -
        new Date(a.date + ' ' + a.time).getTime()
      );

      return {
        success: true,
        data: appointments,
      };
    });
  }

  async getAppointment(id: string): Promise<ApiResponse<Appointment | null>> {
    return withDelay(() => {
      const appointment = mockDatabase.appointments.find((a: Appointment) => a.id === id);
      return {
        success: true,
        data: appointment || null,
      };
    });
  }

  async createAppointment(input: CreateAppointmentInput): Promise<ApiResponse<Appointment>> {
    return withDelay(() => {
      const tax = Math.round(input.servicePrice * 0.08 * 100) / 100;
      const total = input.servicePrice + tax;

      const appointment: Appointment = {
        id: generateId('appt'),
        userId: input.userId,
        salonId: input.salonId,
        salonName: input.salonName,
        serviceId: input.serviceId,
        serviceName: input.serviceName,
        staffId: input.staffId || '',
        staffName: input.staffName || 'Any Available',
        date: input.date,
        time: input.time,
        duration: input.duration,
        status: 'pending',
        price: input.servicePrice,
        tax,
        discount: 0,
        total,
        paymentStatus: 'pending',
        rescheduleHistory: [],
        hasReview: false,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
      };

      mockDatabase.appointments.push(appointment);

      mockDatabase.notifications.push({
        id: generateId('notif'),
        userId: input.userId,
        type: 'appointment_confirmed' as NotificationType,
        title: 'Appointment Booked',
        body: `Your appointment for ${input.serviceName} on ${input.date} at ${input.time} has been booked.`,
        read: false,
        data: { appointmentId: appointment.id },
        createdAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        data: appointment,
      };
    });
  }

  async rescheduleAppointment(input: RescheduleInput): Promise<ApiResponse<Appointment>> {
    return withDelay(() => {
      const appointmentIndex = mockDatabase.appointments.findIndex(
        (a: Appointment) => a.id === input.appointmentId && a.userId === input.userId
      );

      if (appointmentIndex === -1) {
        return {
          success: false,
          data: null as unknown as Appointment,
          error: 'Appointment not found',
        };
      }

      const appointment = mockDatabase.appointments[appointmentIndex];

      if (['completed', 'cancelled', 'no_show'].includes(appointment.status)) {
        return {
          success: false,
          data: null as unknown as Appointment,
          error: 'This appointment cannot be rescheduled',
        };
      }

      const conflictingAppointment = mockDatabase.appointments.find(
        (a: Appointment) =>
          a.id !== input.appointmentId &&
          a.salonId === appointment.salonId &&
          a.staffId === appointment.staffId &&
          a.date === input.newDate &&
          a.time === input.newTime &&
          ['pending', 'confirmed'].includes(a.status)
      );

      if (conflictingAppointment) {
        return {
          success: false,
          data: null as unknown as Appointment,
          error: 'The selected time slot is not available',
        };
      }

      const oldDate = appointment.date;
      const oldTime = appointment.time;

      appointment.date = input.newDate;
      appointment.time = input.newTime;
      appointment.status = 'confirmed';
      appointment.updatedAt = getCurrentTimestamp();
      appointment.rescheduleHistory = appointment.rescheduleHistory || [];
      appointment.rescheduleHistory.push({
        fromDate: oldDate,
        fromTime: oldTime,
        toDate: input.newDate,
        toTime: input.newTime,
        changedAt: getCurrentTimestamp(),
        changedBy: 'user',
      });

      mockDatabase.appointments[appointmentIndex] = appointment;

      mockDatabase.notifications.push({
        id: generateId('notif'),
        userId: input.userId,
        type: 'appointment_rescheduled' as NotificationType,
        title: 'Appointment Rescheduled',
        body: `Your appointment has been rescheduled from ${oldDate} ${oldTime} to ${input.newDate} ${input.newTime}.`,
        read: false,
        data: { appointmentId: appointment.id },
        createdAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        data: appointment,
      };
    });
  }

  async cancelAppointment(input: CancelInput): Promise<ApiResponse<Appointment>> {
    return withDelay(() => {
      const appointmentIndex = mockDatabase.appointments.findIndex(
        (a) => a.id === input.appointmentId && a.userId === input.userId
      );

      if (appointmentIndex === -1) {
        return {
          success: false,
          data: null as any,
          error: 'Appointment not found',
        };
      }

      const appointment = mockDatabase.appointments[appointmentIndex];

      if (['completed', 'cancelled', 'no_show'].includes(appointment.status)) {
        return {
          success: false,
          data: null as any,
          error: 'This appointment cannot be cancelled',
        };
      }

      const appointmentDate = new Date(appointment.date + ' ' + appointment.time);
      const now = new Date();
      const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      let cancellationFee = 0;
      if (hoursUntil < 24 && hoursUntil > 0) {
        cancellationFee = Math.round(appointment.price * 0.5);
      }

      appointment.status = 'cancelled';
      appointment.updatedAt = getCurrentTimestamp();
      appointment.cancellation = {
        cancelledAt: getCurrentTimestamp(),
        cancelledBy: 'user',
        reason: input.reason || 'Cancelled by user',
        refundAmount: appointment.total - cancellationFee,
        refundStatus: 'pending',
      };

      mockDatabase.appointments[appointmentIndex] = appointment;

      mockDatabase.notifications.push({
        id: generateId('notif'),
        userId: input.userId,
        type: 'appointment_cancelled' as NotificationType,
        title: 'Appointment Cancelled',
        body: cancellationFee
          ? `Your appointment on ${appointment.date} has been cancelled. A cancellation fee of $${cancellationFee} applies.`
          : `Your appointment on ${appointment.date} has been cancelled.`,
        read: false,
        data: { appointmentId: appointment.id },
        createdAt: getCurrentTimestamp(),
      });

      const waitlistEntry = mockDatabase.waitlist.find(
        (w) =>
          w.salonId === appointment.salonId &&
          w.serviceId === appointment.serviceId &&
          w.status === 'waiting' &&
          w.preferredDate === appointment.date &&
          w.preferredTimeSlots.includes(appointment.time)
      );

      if (waitlistEntry) {
        waitlistEntry.status = 'slot_available';
        waitlistEntry.availableSlot = {
          date: appointment.date,
          time: appointment.time,
          notifiedAt: getCurrentTimestamp(),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        };

        mockDatabase.notifications.push({
          id: generateId('notif'),
          userId: waitlistEntry.userId,
          type: 'waitlist_slot_available' as NotificationType,
          title: 'Slot Available!',
          body: `A slot for ${waitlistEntry.serviceName} is now available on ${appointment.date} at ${appointment.time}. Confirm now!`,
          read: false,
          data: { waitlistId: waitlistEntry.id },
          createdAt: getCurrentTimestamp(),
        });
      }

      return {
        success: true,
        data: appointment,
      };
    });
  }

  async getAvailableSlots(
    salonId: string,
    serviceId: string,
    date: string,
    staffId?: string
  ): Promise<ApiResponse<SimpleTimeSlot[]>> {
    return withDelay(() => {
      const allSlots: SimpleTimeSlot[] = [];
      for (let hour = 9; hour <= 18; hour++) {
        const time = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        allSlots.push({
          time,
          available: true,
        });
      }

      const bookedAppointments = mockDatabase.appointments.filter(
        (a: Appointment) =>
          a.salonId === salonId &&
          a.date === date &&
          ['pending', 'confirmed'].includes(a.status) &&
          (!staffId || a.staffId === staffId)
      );

      bookedAppointments.forEach((appt: Appointment) => {
        const slot = allSlots.find((s) => s.time === appt.time);
        if (slot) {
          slot.available = false;
          slot.bookedBy = appt.staffId;
        }
      });

      return {
        success: true,
        data: allSlots,
      };
    });
  }

  async getSalonAppointments(
    salonId: string,
    filters?: {
      date?: string;
      status?: Appointment['status'];
      staffId?: string;
    }
  ): Promise<ApiResponse<Appointment[]>> {
    return withDelay(() => {
      let appointments = mockDatabase.appointments.filter(
        (a) => a.salonId === salonId
      );

      if (filters?.date) {
        appointments = appointments.filter((a) => a.date === filters.date);
      }

      if (filters?.status) {
        appointments = appointments.filter((a) => a.status === filters.status);
      }

      if (filters?.staffId) {
        appointments = appointments.filter((a) => a.staffId === filters.staffId);
      }

      appointments.sort((a, b) =>
        new Date(a.date + ' ' + a.time).getTime() -
        new Date(b.date + ' ' + b.time).getTime()
      );

      return {
        success: true,
        data: appointments,
      };
    });
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ): Promise<ApiResponse<Appointment>> {
    return withDelay(() => {
      const appointmentIndex = mockDatabase.appointments.findIndex(
        (a) => a.id === appointmentId
      );

      if (appointmentIndex === -1) {
        return {
          success: false,
          data: null as any,
          error: 'Appointment not found',
        };
      }

      const appointment = mockDatabase.appointments[appointmentIndex];
      appointment.status = status;
      appointment.updatedAt = getCurrentTimestamp();

      mockDatabase.appointments[appointmentIndex] = appointment;

      let message = '';
      switch (status) {
        case 'confirmed':
          message = `Your appointment on ${appointment.date} has been confirmed!`;
          break;
        case 'completed':
          message = `Your appointment has been completed. We'd love your feedback!`;
          break;
        case 'no_show':
          message = `You missed your appointment on ${appointment.date}.`;
          break;
      }

      if (message) {
        mockDatabase.notifications.push({
          id: generateId('notif'),
          userId: appointment.userId,
          type: 'appointment_confirmed' as NotificationType,
          title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
          body: message,
          read: false,
          data: { appointmentId: appointment.id },
          createdAt: getCurrentTimestamp(),
        });
      }

      return {
        success: true,
        data: appointment,
      };
    });
  }
}

export const appointmentService = new AppointmentService();
