import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { TrendingUp, TrendingDown, Calendar, DollarSign, Users, Star, Clock, ChevronRight, AlertCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { adminApi } from "@/api";

interface StaffPerformance {
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  completedAppointments: number;
  revenue: number;
  rating: number;
  reviewCount: number;
}

type ReportPeriod = "Daily" | "Weekly" | "Monthly";

const SALON_ID = 'salon-1';

// Local flexible interface for stats
interface LocalStats {
  todayRevenue: number;
  todayAppointments: number;
  pendingAppointments: number;
  waitlistCount: number;
  averageRating: number;
  totalReviews: number;
  totalAppointments?: number;
  completedToday?: number;
  totalRevenue?: number;
  activeStaff?: number;
}

interface LocalRevenueData {
  date: string;
  revenue: number;
  appointments?: number;
  count?: number;
}

interface LocalAppointment {
  id: string;
  serviceName: string;
  staffName?: string;
  date: string;
  time: string;
  status: string;
}

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("Weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<LocalStats | null>(null);
  const [revenueData, setRevenueData] = useState<LocalRevenueData[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<LocalAppointment[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);

  const periods: ReportPeriod[] = ["Daily", "Weekly", "Monthly"];

  const loadData = useCallback(async () => {
    try {
      // Call real API for dashboard stats
      const apiDashboardRes = await adminApi.getDashboardStats();
      if (apiDashboardRes.success && apiDashboardRes.data) {
        const apiStats = apiDashboardRes.data;
        setStats({
          todayRevenue: apiStats.totalRevenue || 0,
          todayAppointments: apiStats.totalBookings || 0,
          pendingAppointments: apiStats.pendingBookings || 0,
          waitlistCount: 0,
          averageRating: apiStats.averageRating || 0,
          totalReviews: apiStats.totalServices || 0,
        });
      } else {
        // API returned no data - show empty stats
        setStats({
          todayRevenue: 0,
          todayAppointments: 0,
          pendingAppointments: 0,
          waitlistCount: 0,
          averageRating: 0,
          totalReviews: 0,
        });
      }

      // Call real API for revenue
      const apiRevenueRes = await adminApi.getRevenueReport();
      if (apiRevenueRes.success && apiRevenueRes.data) {
        setRevenueData(apiRevenueRes.data.map((item: any) => ({
          date: item.date,
          revenue: item.revenue,
          appointments: item.appointments || 0,
        })));
      } else {
        setRevenueData([]);
      }

      // Call real API for appointments
      const apiBookingsRes = await adminApi.getAllBookings({ status: 'pending' });
      if (apiBookingsRes.success && apiBookingsRes.data) {
        const today = new Date().toISOString().split('T')[0];
        const upcoming = apiBookingsRes.data
          .filter((apt: any) => apt.date >= today)
          .slice(0, 5)
          .map((apt: any) => ({
            id: apt.id || apt._id,
            serviceName: apt.serviceName || apt.service?.name || 'Service',
            staffName: apt.staffName || apt.stylist?.name,
            date: apt.date,
            time: apt.time || apt.startTime,
            status: apt.status,
          }));
        setUpcomingAppointments(upcoming);
      } else {
        setUpcomingAppointments([]);
      }

      // Call real API for staff performance
      const apiStaffRes = await adminApi.getTopStylists(3);
      if (apiStaffRes.success && apiStaffRes.data) {
        setStaffPerformance(apiStaffRes.data.map((s: any) => ({
          staffId: s.stylistId,
          staffName: s.stylistName,
          staffAvatar: '',
          completedAppointments: s.bookingCount,
          revenue: s.revenue || 0,
          rating: s.averageRating,
          reviewCount: 0,
        })));
      } else {
        setStaffPerformance([]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // On error - show empty data
      setStats({
        todayRevenue: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        waitlistCount: 0,
        averageRating: 0,
        totalReviews: 0,
      });
      setRevenueData([]);
      setUpcomingAppointments([]);
      setStaffPerformance([]);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await loadData();
      setIsLoading(false);
    };
    init();
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const getOverviewCards = () => {
    if (!stats) return [];
    return [
      {
        label: "Today's Revenue",
        value: `$${stats.todayRevenue.toFixed(0)}`,
        change: stats.todayRevenue > 0 ? "+12%" : "0%",
        isPositive: stats.todayRevenue > 0,
        icon: DollarSign
      },
      {
        label: "Today's Appts",
        value: stats.todayAppointments.toString(),
        change: `${stats.pendingAppointments} pending`,
        isPositive: true,
        icon: Calendar
      },
      {
        label: "Waitlist",
        value: stats.waitlistCount.toString(),
        change: "waiting",
        isPositive: stats.waitlistCount > 0,
        icon: Clock
      },
      {
        label: "Avg. Rating",
        value: stats.averageRating.toFixed(1),
        change: `${stats.totalReviews} reviews`,
        isPositive: stats.averageRating >= 4,
        icon: Star
      },
    ];
  };

  const maxRevenue = revenueData.length > 0
    ? Math.max(...revenueData.map((d) => d.revenue))
    : 1;

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={{ paddingTop: insets.top + hp(1), paddingHorizontal: wp(6) }}>
          <Text style={{ fontSize: rf(14), color: Colors.gray[500] }}>
            Welcome back,
          </Text>
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#000" }}>
            Salon Now Admin
          </Text>
        </View>

        {/* Overview Cards */}
        <View style={{ paddingHorizontal: wp(4), marginTop: hp(3) }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: wp(2), gap: wp(3) }}
          >
            {getOverviewCards().map((item, index) => {
              const IconComponent = item.icon;
              return (
                <View
                  key={index}
                  className="rounded-2xl"
                  style={{
                    width: wp(40),
                    backgroundColor: Colors.salon.pinkLight,
                    padding: wp(4),
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <View
                      className="rounded-full items-center justify-center"
                      style={{
                        width: wp(10),
                        height: wp(10),
                        backgroundColor: "rgba(255,255,255,0.7)"
                      }}
                    >
                      <IconComponent size={rf(18)} color={Colors.primary} />
                    </View>
                    <View className="flex-row items-center">
                      {typeof item.change === 'string' && item.change.includes('%') ? (
                        item.isPositive ? (
                          <TrendingUp size={rf(14)} color="#10B981" />
                        ) : (
                          <TrendingDown size={rf(14)} color="#EF4444" />
                        )
                      ) : null}
                      <Text
                        style={{
                          fontSize: rf(11),
                          color: Colors.gray[500],
                          marginLeft: wp(1),
                        }}
                      >
                        {item.change}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: rf(28),
                      fontWeight: "700",
                      color: "#000",
                      marginTop: hp(1),
                    }}
                  >
                    {item.value}
                  </Text>
                  <Text style={{ fontSize: rf(13), color: Colors.gray[600] }}>
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="flex-row" style={{ paddingHorizontal: wp(6), marginTop: hp(3), gap: wp(3) }}>
          {/* Waitlist Management */}
          <TouchableOpacity
            onPress={() => router.push("/admin/waitlist" as any)}
            className="flex-1 rounded-xl"
            style={{ backgroundColor: "#FFFBEB", padding: wp(4) }}
          >
            <View className="flex-row items-center justify-between">
              <View
                className="rounded-full items-center justify-center"
                style={{ width: wp(10), height: wp(10), backgroundColor: "#FEF3C7" }}
              >
                <Clock size={rf(18)} color="#F59E0B" />
              </View>
              <ChevronRight size={rf(16)} color="#F59E0B" />
            </View>
            <Text style={{ fontSize: rf(14), fontWeight: "600", color: "#000", marginTop: hp(1) }}>
              Waitlist
            </Text>
            <Text style={{ fontSize: rf(12), color: "#92400E" }}>
              {stats?.waitlistCount || 0} waiting
            </Text>
          </TouchableOpacity>

          {/* Pending Appointments */}
          <TouchableOpacity
            onPress={() => router.push("/admin/appointments" as any)}
            className="flex-1 rounded-xl"
            style={{ backgroundColor: "#FEF2F2", padding: wp(4) }}
          >
            <View className="flex-row items-center justify-between">
              <View
                className="rounded-full items-center justify-center"
                style={{ width: wp(10), height: wp(10), backgroundColor: "#FEE2E2" }}
              >
                <AlertCircle size={rf(18)} color="#EF4444" />
              </View>
              <ChevronRight size={rf(16)} color="#EF4444" />
            </View>
            <Text style={{ fontSize: rf(14), fontWeight: "600", color: "#000", marginTop: hp(1) }}>
              Pending
            </Text>
            <Text style={{ fontSize: rf(12), color: "#991B1B" }}>
              {stats?.pendingAppointments || 0} to confirm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointments */}
        <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: rf(18), fontWeight: "600", color: "#000" }}>
              Upcoming Appointments
            </Text>
            <TouchableOpacity onPress={() => router.push("/admin/appointments" as any)}>
              <Text style={{ fontSize: rf(14), color: Colors.primary }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: hp(2) }}>
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <View
                  key={appointment.id}
                  className="flex-row items-center rounded-xl"
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: wp(3),
                    marginBottom: hp(1.5),
                  }}
                >
                  <View
                    className="rounded-full items-center justify-center"
                    style={{ width: wp(12), height: wp(12), backgroundColor: Colors.salon.pinkBg }}
                  >
                    <Users size={rf(18)} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginLeft: wp(3) }}>
                    <Text style={{ fontSize: rf(15), fontWeight: "600", color: "#000" }}>
                      {appointment.serviceName}
                    </Text>
                    <Text style={{ fontSize: rf(13), color: Colors.gray[500] }}>
                      {appointment.staffName} • {appointment.date}
                    </Text>
                  </View>
                  <View
                    className="rounded-lg"
                    style={{ backgroundColor: Colors.salon.pinkLight, paddingHorizontal: wp(3), paddingVertical: hp(0.5) }}
                  >
                    <Text style={{ fontSize: rf(13), color: Colors.primary, fontWeight: "500" }}>
                      {appointment.time}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center py-6">
                <Calendar size={rf(32)} color={Colors.gray[300]} />
                <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(1) }}>
                  No upcoming appointments
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Staff Performance */}
        {staffPerformance.length > 0 && (
          <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
            <Text style={{ fontSize: rf(18), fontWeight: "600", color: "#000" }}>
              Top Performers
            </Text>

            <View style={{ marginTop: hp(2) }}>
              {staffPerformance.map((staff, index) => (
                <View
                  key={staff.staffId}
                  className="flex-row items-center rounded-xl"
                  style={{
                    backgroundColor: index === 0 ? "#ECFDF5" : "#F9FAFB",
                    padding: wp(3),
                    marginBottom: hp(1.5),
                  }}
                >
                  <View className="relative">
                    <Image
                      source={{ uri: staff.staffAvatar }}
                      style={{ width: wp(12), height: wp(12), borderRadius: wp(6) }}
                    />
                    {index === 0 && (
                      <View
                        className="absolute -top-1 -right-1 rounded-full items-center justify-center"
                        style={{ width: wp(5), height: wp(5), backgroundColor: "#F59E0B" }}
                      >
                        <Text style={{ fontSize: rf(10), color: "#FFF" }}>1</Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1, marginLeft: wp(3) }}>
                    <Text style={{ fontSize: rf(15), fontWeight: "600", color: "#000" }}>
                      {staff.staffName}
                    </Text>
                    <View className="flex-row items-center">
                      <Star size={rf(12)} color="#F59E0B" fill="#F59E0B" />
                      <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(1) }}>
                        {staff.rating} ({staff.reviewCount} reviews)
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text style={{ fontSize: rf(16), fontWeight: "700", color: "#10B981" }}>
                      ${staff.revenue.toFixed(0)}
                    </Text>
                    <Text style={{ fontSize: rf(11), color: Colors.gray[500] }}>
                      {staff.completedAppointments} appts
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Revenue Chart */}
        <View style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
          <Text style={{ fontSize: rf(18), fontWeight: "600", color: "#000" }}>
            Revenue Overview
          </Text>

          {/* Period Tabs */}
          <View
            className="flex-row rounded-full"
            style={{
              marginTop: hp(2),
              backgroundColor: "#F3F4F6",
              padding: wp(1),
            }}
          >
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setSelectedPeriod(period)}
                className="flex-1 items-center justify-center rounded-full"
                style={{
                  paddingVertical: hp(1.2),
                  backgroundColor:
                    selectedPeriod === period ? Colors.salon.pinkLight : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    color: selectedPeriod === period ? Colors.primary : "#6B7280",
                    fontWeight: selectedPeriod === period ? "600" : "400",
                  }}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Total Revenue */}
          <View
            className="rounded-xl items-center"
            style={{ backgroundColor: Colors.salon.pinkBg, padding: wp(4), marginTop: hp(2) }}
          >
            <Text style={{ fontSize: rf(13), color: Colors.gray[500] }}>Total Revenue (7 days)</Text>
            <Text style={{ fontSize: rf(32), fontWeight: "700", color: Colors.primary }}>
              ${revenueData.reduce((sum, d) => sum + d.revenue, 0).toFixed(0)}
            </Text>
          </View>

          {/* Bar Chart */}
          <View
            className="flex-row items-end justify-between"
            style={{ marginTop: hp(3), height: hp(15) }}
          >
            {revenueData.map((item, index) => (
              <View key={index} className="items-center" style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: rf(10),
                    color: Colors.gray[600],
                    marginBottom: hp(0.5),
                  }}
                >
                  ${item.revenue}
                </Text>
                <View
                  className="rounded-t-lg"
                  style={{
                    width: wp(7),
                    height: maxRevenue > 0 ? `${(item.revenue / maxRevenue) * 80}%` : 5,
                    minHeight: 5,
                    backgroundColor: Colors.primary,
                    opacity: 0.8,
                  }}
                />
                <Text
                  style={{
                    fontSize: rf(12),
                    color: "#6B7280",
                    marginTop: hp(1),
                  }}
                >
                  {formatDay(item.date)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
}
