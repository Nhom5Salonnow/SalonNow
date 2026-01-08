import { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Menu, Calendar, Clock, User, LogIn } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { DecorativeCircle } from '@/components';
import { mockDatabase } from '@/api/mockServer/database';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image, Platform } from 'react-native';
import { useAuth } from '@/contexts';
import { bookingApi } from '@/api';

type TabType = 'upcoming' | 'past';

const STATUS_CONFIG: Record<string, {color: string; bgColor: string; label: string}> = {
  pending: { color: '#F59E0B', bgColor: '#FFFBEB', label: 'Pending' },
  confirmed: { color: '#10B981', bgColor: '#ECFDF5', label: 'Confirmed' },
  in_progress: { color: '#3B82F6', bgColor: '#EFF6FF', label: 'In Progress' },
  completed: { color: '#6B7280', bgColor: '#F3F4F6', label: 'Completed' },
  cancelled: { color: '#EF4444', bgColor: '#FEF2F2', label: 'Cancelled' },
  no_show: { color: '#EF4444', bgColor: '#FEF2F2', label: 'No Show' },
};

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabType>('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = user?.id;

  const loadAppointments = useCallback(async () => {
    try {
      if (isLoggedIn && userId) {
        // Try to fetch from API first
        const response = await bookingApi.getMyBookings();
        if (response.success && response.data && response.data.length > 0) {
          // Map API response to app format
          setAppointments(response.data.map((booking: any) => ({
            id: booking.id || booking._id,
            userId: booking.userId,
            serviceName: booking.serviceName || booking.service?.name || 'Service',
            salonName: booking.salonName || booking.salon?.name || 'Salon Now',
            date: booking.date,
            time: booking.time || booking.startTime,
            status: booking.status || 'pending',
            staffName: booking.staffName || booking.stylist?.name,
            price: booking.price || booking.totalAmount,
            total: booking.total || booking.totalAmount,
          })));
        } else {
          // Fallback to mock data
          const userAppointments = mockDatabase.appointments.filter(
            (a) => a.userId === userId || a.userId === 'user-1'
          );
          setAppointments(userAppointments);
        }
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Fallback to mock data on error
      if (isLoggedIn && userId) {
        const userAppointments = mockDatabase.appointments.filter(
          (a) => a.userId === userId || a.userId === 'user-1'
        );
        setAppointments(userAppointments);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isLoggedIn, userId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAppointments();
  };

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (selectedTab === 'upcoming') {
      return (
        apptDate >= now &&
        ['pending', 'confirmed', 'in_progress'].includes(appt.status)
      );
    } else {
      return (
        apptDate < now ||
        ['completed', 'cancelled', 'no_show'].includes(appt.status)
      );
    }
  });

  const handleAppointmentPress = (appointmentId: string) => {
    router.push(`/appointment/${appointmentId}` as any);
  };

  const renderAppointmentCard = (appointment: any) => {
    const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;

    return (
      <TouchableOpacity
        key={appointment.id}
        onPress={() => handleAppointmentPress(appointment.id)}
        style={{
          backgroundColor: '#fff',
          marginBottom: hp(1.5),
          padding: wp(4),
          borderRadius: wp(4),
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          ...Platform.select({
            android: {
              elevation: 3,
            },
          }),
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text style={{ fontSize: rf(17), fontWeight: '600', color: '#000' }}>
              {appointment.serviceName}
            </Text>
            <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.3) }}>
              {appointment.salonName}
            </Text>
          </View>

          {/* Status Badge */}
          <View
            className="rounded-full"
            style={{
              backgroundColor: statusConfig.bgColor,
              paddingHorizontal: wp(3),
              paddingVertical: hp(0.5),
            }}
          >
            <Text style={{ fontSize: rf(12), color: statusConfig.color, fontWeight: '600' }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Date & Time */}
        <View className="flex-row items-center" style={{ marginTop: hp(1.5) }}>
          <View className="flex-row items-center" style={{ marginRight: wp(4) }}>
            <Calendar size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1.5) }}>
              {appointment.date}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1.5) }}>
              {appointment.time}
            </Text>
          </View>
        </View>

        {/* Staff */}
        {appointment.staffName && (
          <View className="flex-row items-center" style={{ marginTop: hp(1) }}>
            <User size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1.5) }}>
              with {appointment.staffName}
            </Text>
          </View>
        )}

        {/* Price & Action */}
        <View
          className="flex-row items-center justify-between"
          style={{
            marginTop: hp(1.5),
            paddingTop: hp(1.5),
            borderTopWidth: 1,
            borderTopColor: Colors.gray[100],
          }}
        >
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: Colors.primary }}>
            ${appointment.price || appointment.total || 60}
          </Text>
          <Text style={{ fontSize: rf(13), color: Colors.primary }}>
            View Details →
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View className="items-center justify-center" style={{ paddingTop: hp(10) }}>
      <Calendar size={rf(60)} color={Colors.gray[300]} />
      <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#000', marginTop: hp(2) }}>
        No {selectedTab === 'upcoming' ? 'Upcoming' : 'Past'} Appointments
      </Text>
      <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(1), textAlign: 'center' }}>
        {selectedTab === 'upcoming'
          ? "You don't have any upcoming appointments."
          : "You don't have any past appointments."}
      </Text>
      {selectedTab === 'upcoming' && (
        <TouchableOpacity
          onPress={() => router.push('/home' as any)}
          className="rounded-xl"
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: hp(1.5),
            paddingHorizontal: wp(6),
            marginTop: hp(3),
          }}
        >
          <Text style={{ fontSize: rf(15), fontWeight: '600', color: '#fff' }}>
            Book Now
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderGuestContent = () => (
    <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: wp(8) }}>
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: wp(24),
          height: wp(24),
          backgroundColor: Colors.salon.pinkLight,
          marginBottom: hp(3),
        }}
      >
        <LogIn size={rf(40)} color={Colors.primary} />
      </View>
      <Text style={{ fontSize: rf(20), fontWeight: '600', color: Colors.salon.dark, textAlign: 'center' }}>
        Login to View Appointments
      </Text>
      <Text style={{ fontSize: rf(14), color: Colors.gray[500], textAlign: 'center', marginTop: hp(1), lineHeight: rf(20) }}>
        Sign in to manage your appointments, view upcoming bookings, and track your history.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/auth/login' as any)}
        className="rounded-full"
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: hp(1.8),
          paddingHorizontal: wp(12),
          marginTop: hp(4),
        }}
      >
        <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#fff' }}>
          Login Now
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/home' as any)}
        style={{ marginTop: hp(2) }}
      >
        <Text style={{ fontSize: rf(14), color: Colors.primary }}>
          Continue Browsing
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      {/* Header */}
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: wp(5),
          paddingTop: insets.top + hp(1),
          paddingBottom: hp(1),
        }}
      >
        {/* Left: Menu + Title */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/settings" as any)}
            style={{ padding: wp(2), marginLeft: -wp(2) }}
          >
            <Menu size={rf(24)} color={Colors.salon.dark} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: rf(22),
              fontWeight: "600",
              color: Colors.salon.dark,
              marginLeft: wp(2),
            }}
          >
            My Appointments
          </Text>
        </View>

        {/* Profile Avatar */}
        <TouchableOpacity
          onPress={() => router.push(isLoggedIn ? "/profile" : "/auth/login" as any)}
          className="rounded-full overflow-hidden items-center justify-center"
          style={{
            width: wp(10),
            height: wp(10),
            borderWidth: 2,
            borderColor: Colors.salon.pinkLight,
            backgroundColor: isLoggedIn ? "transparent" : Colors.gray[200],
          }}
        >
          {isLoggedIn ? (
            <Image
              source={{ uri: user?.avatar || 'https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114' }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <User size={rf(18)} color={Colors.gray[500]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Tabs - show for both guest and logged in */}
      <View
        className="flex-row rounded-full"
        style={{
          marginTop: hp(2),
          marginHorizontal: wp(5),
          backgroundColor: '#F3F4F6',
          padding: wp(1),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedTab('upcoming')}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: hp(1.5),
            borderRadius: 999,
            backgroundColor: selectedTab === 'upcoming' ? Colors.primary : 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: rf(14),
              fontWeight: selectedTab === 'upcoming' ? '600' : '400',
              color: selectedTab === 'upcoming' ? '#fff' : Colors.gray[600],
            }}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedTab('past')}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: hp(1.5),
            borderRadius: 999,
            backgroundColor: selectedTab === 'past' ? Colors.primary : 'transparent',
          }}
        >
          <Text
            style={{
              fontSize: rf(14),
              fontWeight: selectedTab === 'past' ? '600' : '400',
              color: selectedTab === 'past' ? '#fff' : Colors.gray[600],
            }}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {isLoggedIn ? (
        <ScrollView
          className="flex-1 px-5"
          style={{ marginTop: hp(2) }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredAppointments.length > 0
            ? filteredAppointments.map(renderAppointmentCard)
            : !isLoading && renderEmptyState()}

          <View style={{ height: hp(12) }} />
        </ScrollView>
      ) : (
        renderGuestContent()
      )}
    </View>
  );
}
