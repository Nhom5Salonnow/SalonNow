import { Appointment, Service, Staff, Review, ApiResponse } from './mockServer/types';
import { mockDatabase, generateId, getCurrentTimestamp } from './mockServer/database';
import { withDelay } from './mockServer/delay';

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedToday: number;
  totalRevenue: number;
  todayRevenue: number;
  averageRating: number;
  totalReviews: number;
  activeStaff: number;
  waitlistCount: number;
}

export interface AppointmentsByDate {
  date: string;
  count: number;
  revenue: number;
}

export interface RevenueByService {
  serviceId: string;
  serviceName: string;
  revenue: number;
  count: number;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  staffAvatar: string;
  completedAppointments: number;
  revenue: number;
  rating: number;
  reviewCount: number;
}

export interface AdminAppointmentFilters {
  status?: string[];
  staffId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(salonId: string): Promise<ApiResponse<DashboardStats>> {
    return withDelay(() => {
      const today = new Date().toISOString().split('T')[0];

      const salonAppointments = mockDatabase.appointments.filter(
        (a: any) => a.salonId === salonId
      );

      const todayAppointments = salonAppointments.filter(
        (a: any) => a.date === today
      );

      const pendingAppointments = salonAppointments.filter(
        (a: any) => a.status === 'pending'
      );

      const completedToday = todayAppointments.filter(
        (a: any) => a.status === 'completed'
      );

      const salonPayments = mockDatabase.payments.filter((p) => {
        const apt = mockDatabase.appointments.find((a: any) => a.id === p.appointmentId);
        return apt && (apt as any).salonId === salonId;
      });

      const totalRevenue = salonPayments.reduce((sum, p) => sum + p.total, 0);

      const todayPayments = salonPayments.filter((p) =>
        p.createdAt.split('T')[0] === today
      );
      const todayRevenue = todayPayments.reduce((sum, p) => sum + p.total, 0);

      const salonReviews = mockDatabase.reviews.filter((r) => r.salonId === salonId);
      const averageRating = salonReviews.length > 0
        ? salonReviews.reduce((sum, r) => sum + r.overallRating, 0) / salonReviews.length
        : 0;

      const activeStaff = mockDatabase.staff.filter(
        (s) => s.salonId === salonId && s.isActive
      ).length;

      const waitlistCount = mockDatabase.waitlist.filter(
        (w: any) => w.salonId === salonId && w.status === 'waiting'
      ).length;

      return {
        success: true,
        data: {
          totalAppointments: salonAppointments.length,
          todayAppointments: todayAppointments.length,
          pendingAppointments: pendingAppointments.length,
          completedToday: completedToday.length,
          totalRevenue,
          todayRevenue,
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: salonReviews.length,
          activeStaff,
          waitlistCount,
        },
      };
    });
  }

  /**
   * Get appointments by date range
   */
  async getAppointmentsByDate(
    salonId: string,
    days: number = 7
  ): Promise<ApiResponse<AppointmentsByDate[]>> {
    return withDelay(() => {
      const result: AppointmentsByDate[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayAppointments = mockDatabase.appointments.filter(
          (a: any) => a.salonId === salonId && a.date === dateStr
        );

        const dayPayments = mockDatabase.payments.filter((p) => {
          const apt = mockDatabase.appointments.find((a: any) => a.id === p.appointmentId);
          return apt && (apt as any).salonId === salonId && (apt as any).date === dateStr;
        });

        const revenue = dayPayments.reduce((sum, p) => sum + p.total, 0);

        result.push({
          date: dateStr,
          count: dayAppointments.length,
          revenue,
        });
      }

      return {
        success: true,
        data: result,
      };
    });
  }

  /**
   * Get revenue by service
   */
  async getRevenueByService(salonId: string): Promise<ApiResponse<RevenueByService[]>> {
    return withDelay(() => {
      const serviceStats: Record<string, { revenue: number; count: number }> = {};

      mockDatabase.appointments
        .filter((a: any) => a.salonId === salonId && a.status === 'completed')
        .forEach((apt: any) => {
          const payment = mockDatabase.payments.find((p) => p.appointmentId === apt.id);
          if (payment) {
            if (!serviceStats[apt.serviceId]) {
              serviceStats[apt.serviceId] = { revenue: 0, count: 0 };
            }
            serviceStats[apt.serviceId].revenue += payment.total;
            serviceStats[apt.serviceId].count++;
          }
        });

      const result: RevenueByService[] = Object.entries(serviceStats)
        .map(([serviceId, stats]) => {
          const service = mockDatabase.services.find((s) => s.id === serviceId);
          return {
            serviceId,
            serviceName: service?.name || 'Unknown Service',
            revenue: stats.revenue,
            count: stats.count,
          };
        })
        .sort((a, b) => b.revenue - a.revenue);

      return {
        success: true,
        data: result,
      };
    });
  }

  /**
   * Get staff performance
   */
  async getStaffPerformance(salonId: string): Promise<ApiResponse<StaffPerformance[]>> {
    return withDelay(() => {
      const salonStaff = mockDatabase.staff.filter(
        (s) => s.salonId === salonId && s.isActive
      );

      const result: StaffPerformance[] = salonStaff.map((staff) => {
        const staffAppointments = mockDatabase.appointments.filter(
          (a: any) => a.staffId === staff.id && a.status === 'completed'
        );

        const staffPayments = mockDatabase.payments.filter((p) => {
          const apt = mockDatabase.appointments.find((a: any) => a.id === p.appointmentId);
          return apt && (apt as any).staffId === staff.id;
        });

        const revenue = staffPayments.reduce((sum, p) => sum + p.total, 0);

        const staffReviews = mockDatabase.reviews.filter((r) => r.staffId === staff.id);
        const avgRating = staffReviews.length > 0
          ? staffReviews.reduce((sum, r) => sum + r.overallRating, 0) / staffReviews.length
          : 0;

        return {
          staffId: staff.id,
          staffName: staff.name,
          staffAvatar: staff.avatar,
          completedAppointments: staffAppointments.length,
          revenue,
          rating: Math.round(avgRating * 10) / 10,
          reviewCount: staffReviews.length,
        };
      }).sort((a, b) => b.revenue - a.revenue);

      return {
        success: true,
        data: result,
      };
    });
  }

  /**
   * Get all appointments with filters
   */
  async getAppointments(
    salonId: string,
    filters?: AdminAppointmentFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<Appointment[]>> {
    return withDelay(() => {
      let appointments = mockDatabase.appointments.filter(
        (a: any) => a.salonId === salonId
      );

      // Apply filters
      if (filters) {
        if (filters.status?.length) {
          appointments = appointments.filter((a: any) => filters.status!.includes(a.status));
        }
        if (filters.staffId) {
          appointments = appointments.filter((a: any) => a.staffId === filters.staffId);
        }
        if (filters.serviceId) {
          appointments = appointments.filter((a: any) => a.serviceId === filters.serviceId);
        }
        if (filters.dateFrom) {
          appointments = appointments.filter((a: any) => a.date >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          appointments = appointments.filter((a: any) => a.date <= filters.dateTo!);
        }
      }

      // Sort by date desc
      appointments.sort((a: any, b: any) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB.getTime() - dateA.getTime();
      });

      // Pagination
      const startIndex = (page - 1) * limit;
      const paginatedAppointments = appointments.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedAppointments as Appointment[],
        meta: {
          total: appointments.length,
          page,
          limit,
          hasMore: startIndex + limit < appointments.length,
        },
      };
    });
  }

  /**
   * Update appointment status
   */
  async updateAppointmentStatus(
    appointmentId: string,
    status: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  ): Promise<ApiResponse<Appointment>> {
    return withDelay(() => {
      const appointment = mockDatabase.appointments.find((a: any) => a.id === appointmentId);

      if (!appointment) {
        return {
          success: false,
          data: null as unknown as Appointment,
          error: 'Appointment not found',
        };
      }

      (appointment as any).status = status;
      if (status === 'confirmed') {
        (appointment as any).confirmedAt = getCurrentTimestamp();
      }

      return {
        success: true,
        data: appointment as Appointment,
      };
    });
  }

  /**
   * Get recent reviews
   */
  async getRecentReviews(salonId: string, limit: number = 10): Promise<ApiResponse<Review[]>> {
    return withDelay(() => {
      const reviews = mockDatabase.reviews
        .filter((r) => r.salonId === salonId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);

      return {
        success: true,
        data: reviews,
      };
    });
  }

  /**
   * Respond to review
   */
  async respondToReview(reviewId: string, response: string): Promise<ApiResponse<Review>> {
    return withDelay(() => {
      const review = mockDatabase.reviews.find((r) => r.id === reviewId);

      if (!review) {
        return {
          success: false,
          data: null as unknown as Review,
          error: 'Review not found',
        };
      }

      review.response = {
        text: response,
        respondedAt: getCurrentTimestamp(),
        respondedBy: 'admin',
      };

      return {
        success: true,
        data: review,
      };
    });
  }

  /**
   * Add new service
   */
  async addService(service: Omit<Service, 'id'>): Promise<ApiResponse<Service>> {
    return withDelay(() => {
      const newService: Service = {
        ...service,
        id: generateId('svc'),
      };

      mockDatabase.services.push(newService);

      return {
        success: true,
        data: newService,
      };
    });
  }

  /**
   * Update service
   */
  async updateService(serviceId: string, updates: Partial<Service>): Promise<ApiResponse<Service>> {
    return withDelay(() => {
      const serviceIndex = mockDatabase.services.findIndex((s) => s.id === serviceId);

      if (serviceIndex === -1) {
        return {
          success: false,
          data: null as unknown as Service,
          error: 'Service not found',
        };
      }

      const service = mockDatabase.services[serviceIndex];
      Object.assign(service, updates);

      return {
        success: true,
        data: service,
      };
    });
  }

  /**
   * Delete service
   */
  async deleteService(serviceId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const serviceIndex = mockDatabase.services.findIndex((s) => s.id === serviceId);

      if (serviceIndex === -1) {
        return {
          success: false,
          data: false,
          error: 'Service not found',
        };
      }

      mockDatabase.services.splice(serviceIndex, 1);

      return {
        success: true,
        data: true,
      };
    });
  }

  /**
   * Add new staff member
   */
  async addStaff(staff: Omit<Staff, 'id'>): Promise<ApiResponse<Staff>> {
    return withDelay(() => {
      const newStaff: Staff = {
        ...staff,
        id: generateId('staff'),
      };

      mockDatabase.staff.push(newStaff);

      return {
        success: true,
        data: newStaff,
      };
    });
  }

  /**
   * Update staff member
   */
  async updateStaff(staffId: string, updates: Partial<Staff>): Promise<ApiResponse<Staff>> {
    return withDelay(() => {
      const staffIndex = mockDatabase.staff.findIndex((s) => s.id === staffId);

      if (staffIndex === -1) {
        return {
          success: false,
          data: null as unknown as Staff,
          error: 'Staff not found',
        };
      }

      const staff = mockDatabase.staff[staffIndex];
      Object.assign(staff, updates);

      return {
        success: true,
        data: staff,
      };
    });
  }

  /**
   * Delete staff member
   */
  async deleteStaff(staffId: string): Promise<ApiResponse<boolean>> {
    return withDelay(() => {
      const staffIndex = mockDatabase.staff.findIndex((s) => s.id === staffId);

      if (staffIndex === -1) {
        return {
          success: false,
          data: false,
          error: 'Staff not found',
        };
      }

      // Soft delete - set as inactive
      mockDatabase.staff[staffIndex].isActive = false;

      return {
        success: true,
        data: true,
      };
    });
  }

  /**
   * Get popular times
   */
  async getPopularTimes(salonId: string): Promise<ApiResponse<{ hour: number; count: number }[]>> {
    return withDelay(() => {
      const hourCounts: Record<number, number> = {};

      mockDatabase.appointments
        .filter((a: any) => a.salonId === salonId)
        .forEach((apt: any) => {
          const time = apt.time;
          const hour = parseInt(time.split(':')[0], 10);
          hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

      const result = Object.entries(hourCounts)
        .map(([hour, count]) => ({
          hour: parseInt(hour, 10),
          count,
        }))
        .sort((a, b) => a.hour - b.hour);

      return {
        success: true,
        data: result,
      };
    });
  }
}

export const adminService = new AdminService();
