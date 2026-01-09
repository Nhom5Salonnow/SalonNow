import { ApiResponse } from './mockServer/types';
import { mockDatabase } from './mockServer/database';
import { withDelay } from './mockServer/delay';

export interface AvailableSlot {
  time: string;
  displayTime: string;
  available: boolean;
  staffId?: string;
  staffName?: string;
  price?: number;
}

export interface StaffAvailability {
  staffId: string;
  staffName: string;
  staffAvatar: string;
  slots: AvailableSlot[];
  nextAvailable?: string;
}

export interface DateAvailability {
  date: string;
  dayName: string;
  isOpen: boolean;
  availableCount: number;
  totalSlots: number;
}

class AvailabilityService {
  private workingHours = {
    start: 9,
    end: 19,
    slotDuration: 60,
  };

  async getAvailableDates(
    salonId: string,
    serviceId: string,
    days: number = 14
  ): Promise<ApiResponse<DateAvailability[]>> {
    return withDelay(() => {
      const result: DateAvailability[] = [];
      const today = new Date();

      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        const salon = mockDatabase.salons.find((s) => s.id === salonId);
        const hours = salon?.openingHours?.[dayOfWeek];
        const isOpen = hours && !hours.closed;

        const bookedCount = mockDatabase.appointments.filter(
          (a: any) =>
            a.salonId === salonId &&
            a.date === dateStr &&
            ['pending', 'confirmed'].includes(a.status)
        ).length;

        const totalSlots = isOpen ? 10 : 0;
        const availableCount = Math.max(0, totalSlots - bookedCount);

        result.push({
          date: dateStr,
          dayName,
          isOpen: isOpen || false,
          availableCount,
          totalSlots,
        });
      }

      return {
        success: true,
        data: result,
      };
    }, 100, 200);
  }

  async getAvailableSlots(
    salonId: string,
    serviceId: string,
    date: string,
    staffId?: string
  ): Promise<ApiResponse<AvailableSlot[]>> {
    return withDelay(() => {
      const slots: AvailableSlot[] = [];

      for (let hour = this.workingHours.start; hour < this.workingHours.end; hour++) {
        const time24 = `${hour.toString().padStart(2, '0')}:00`;
        const displayTime = this.formatTime(hour);

        const isBooked = mockDatabase.appointments.some(
          (a: any) =>
            a.salonId === salonId &&
            a.date === date &&
            a.time === displayTime &&
            ['pending', 'confirmed'].includes(a.status) &&
            (!staffId || a.staffId === staffId)
        );

        const isBreak = hour === 12;

        slots.push({
          time: time24,
          displayTime,
          available: !isBooked && !isBreak,
          staffId: isBooked ? 'booked' : undefined,
        });
      }

      return {
        success: true,
        data: slots,
      };
    }, 100, 200);
  }

  async getStaffAvailability(
    salonId: string,
    date: string,
    serviceId?: string
  ): Promise<ApiResponse<StaffAvailability[]>> {
    return withDelay(() => {
      const salonStaff = mockDatabase.staff.filter(
        (s) => s.salonId === salonId && s.isActive
      );

      const result: StaffAvailability[] = salonStaff.map((staff) => {
        const slots: AvailableSlot[] = [];
        let nextAvailable: string | undefined;

        for (let hour = this.workingHours.start; hour < this.workingHours.end; hour++) {
          const displayTime = this.formatTime(hour);
          const isBreak = hour === 12;

          const isBooked = mockDatabase.appointments.some(
            (a: any) =>
              a.staffId === staff.id &&
              a.date === date &&
              a.time === displayTime &&
              ['pending', 'confirmed'].includes(a.status)
          );

          const available = !isBooked && !isBreak;

          if (available && !nextAvailable) {
            nextAvailable = displayTime;
          }

          slots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            displayTime,
            available,
            staffId: staff.id,
            staffName: staff.name,
          });
        }

        return {
          staffId: staff.id,
          staffName: staff.name,
          staffAvatar: staff.avatar,
          slots,
          nextAvailable,
        };
      });

      return {
        success: true,
        data: result,
      };
    });
  }

  async checkSlotAvailability(
    salonId: string,
    date: string,
    time: string,
    staffId?: string
  ): Promise<ApiResponse<{ available: boolean; reason?: string }>> {
    return withDelay(() => {
      const slotDate = new Date(date + ' ' + time);
      if (slotDate < new Date()) {
        return {
          success: true,
          data: {
            available: false,
            reason: 'This time slot is in the past',
          },
        };
      }

      const isBooked = mockDatabase.appointments.some(
        (a: any) =>
          a.salonId === salonId &&
          a.date === date &&
          a.time === time &&
          ['pending', 'confirmed'].includes(a.status) &&
          (!staffId || a.staffId === staffId)
      );

      if (isBooked) {
        return {
          success: true,
          data: {
            available: false,
            reason: 'This time slot is already booked',
          },
        };
      }

      return {
        success: true,
        data: {
          available: true,
        },
      };
    }, 50, 100);
  }

  async getNextAvailableSlot(
    salonId: string,
    serviceId: string,
    staffId?: string
  ): Promise<ApiResponse<{ date: string; time: string; staffId?: string; staffName?: string } | null>> {
    return withDelay(() => {
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        for (let hour = this.workingHours.start; hour < this.workingHours.end; hour++) {
          if (hour === 12) continue;

          const displayTime = this.formatTime(hour);

          if (i === 0 && hour <= today.getHours()) continue;

          const isBooked = mockDatabase.appointments.some(
            (a: any) =>
              a.salonId === salonId &&
              a.date === dateStr &&
              a.time === displayTime &&
              ['pending', 'confirmed'].includes(a.status) &&
              (!staffId || a.staffId === staffId)
          );

          if (!isBooked) {
            const availableStaff = staffId
              ? mockDatabase.staff.find((s) => s.id === staffId)
              : mockDatabase.staff.find(
                  (s) =>
                    s.salonId === salonId &&
                    s.isActive &&
                    !mockDatabase.appointments.some(
                      (a: any) =>
                        a.staffId === s.id &&
                        a.date === dateStr &&
                        a.time === displayTime &&
                        ['pending', 'confirmed'].includes(a.status)
                    )
                );

            return {
              success: true,
              data: {
                date: dateStr,
                time: displayTime,
                staffId: availableStaff?.id,
                staffName: availableStaff?.name,
              },
            };
          }
        }
      }

      return {
        success: true,
        data: null,
      };
    });
  }

  async getAvailabilitySummary(
    salonId: string,
    serviceId: string
  ): Promise<ApiResponse<{
    todayAvailable: number;
    tomorrowAvailable: number;
    nextAvailable: string | null;
    peakHours: string[];
  }>> {
    return withDelay(() => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const todayBooked = mockDatabase.appointments.filter(
        (a: any) =>
          a.salonId === salonId &&
          a.date === today &&
          ['pending', 'confirmed'].includes(a.status)
      ).length;

      const tomorrowBooked = mockDatabase.appointments.filter(
        (a: any) =>
          a.salonId === salonId &&
          a.date === tomorrow &&
          ['pending', 'confirmed'].includes(a.status)
      ).length;

      const totalSlots = 10;

      return {
        success: true,
        data: {
          todayAvailable: Math.max(0, totalSlots - todayBooked),
          tomorrowAvailable: Math.max(0, totalSlots - tomorrowBooked),
          nextAvailable: todayBooked < totalSlots ? 'Today' : 'Tomorrow',
          peakHours: ['10:00 AM', '2:00 PM', '4:00 PM'],
        },
      };
    }, 100, 200);
  }

  private formatTime(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }
}

export const availabilityService = new AvailabilityService();
