import { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Calendar, Clock, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { WeekCalendar, generateWeekDays, AuthGuard } from '@/components';
import { bookingApi } from '@/api/bookingApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts';

type TabType = 'upcoming' | 'past';

const STATUS_CONFIG: Record<string, {color: string; bgColor: string; label: string}> = {
  pending: { color: '#F59E0B', bgColor: '#FFFBEB', label: 'Pending' },
  confirmed: { color: '#10B981', bgColor: '#ECFDF5', label: 'Confirmed' },
  in_progress: { color: '#3B82F6', bgColor: '#EFF6FF', label: 'In Progress' },
  completed: { color: '#6B7280', bgColor: '#F3F4F6', label: 'Completed' },
  cancelled: { color: '#EF4444', bgColor: '#FEF2F2', label: 'Cancelled' },
  no_show: { color: '#EF4444', bgColor: '#FEF2F2', label: 'No Show' },
};

function MyAppointmentsContent() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<TabType>('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = user?.id || 'user-1';

  const loadAppointments = useCallback(async () => {
    try {
      const response = await bookingApi.getMyBookings();

      if (response.success && response.data) {
        const mappedAppointments = response.data.map((booking) => ({
          id: booking.id,
          userId: booking.userId,
          serviceName: booking.serviceName || booking.service?.name || 'Service',
          salonName: booking.salonName || booking.salon?.name || 'Salon',
          staffName: booking.stylistName || (booking.stylist ? `${booking.stylist.firstName} ${booking.stylist.lastName}` : undefined),
          date: booking.date || (booking.startTime ? new Date(booking.startTime).toLocaleDateString() : ''),
          time: booking.time || (booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
          status: booking.status,
          price: booking.price || booking.totalPrice || booking.service?.price || 0,
          total: booking.total || booking.totalPrice || booking.price || 0,
        }));
        setAppointments(mappedAppointments);
      } else {
        console.log('API returned no data');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId]);

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
        className="rounded-xl"
        style={{
          backgroundColor: '#fff',
          marginBottom: hp(2),
          padding: wp(4),
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text style={{ fontSize: rf(17), fontWeight: '600', color: '#000' }}>
              {appointment.serviceName}
            </Text>
            <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.3) }}>
              {appointment.salonName}
            </Text>
          </View>

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

        <View className="flex-row items-center" style={{ marginTop: hp(2) }}>
          <View className="flex-row items-center" style={{ marginRight: wp(4) }}>
            <Calendar size={rf(16)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(1) }}>
              {appointment.date}
            </Text>
          </View>
          <View className="flex-row items-center" style={{ marginRight: wp(4) }}>
            <Clock size={rf(16)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(1) }}>
              {appointment.time}
            </Text>
          </View>
        </View>

        {appointment.staffName && (
          <View className="flex-row items-center" style={{ marginTop: hp(1) }}>
            <User size={rf(16)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(1) }}>
              with {appointment.staffName}
            </Text>
          </View>
        )}

        <View
          className="flex-row items-center justify-between"
          style={{
            marginTop: hp(2),
            paddingTop: hp(1.5),
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
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

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={['#FECDD3', '#FFF5F5', '#FFFFFF']}
        locations={[0, 0.5, 0.8]}
        className="absolute top-0 left-0 right-0"
        style={{ height: hp(25) }}
      />

      <View
        className="flex-row items-center px-6"
        style={{ paddingTop: insets.top + hp(1) }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#000" />
        </TouchableOpacity>
        <Text
          className="flex-1 text-center"
          style={{ fontSize: rf(22), fontWeight: '600', color: '#000' }}
        >
          My Appointments
        </Text>
        <View style={{ width: wp(7) }} />
      </View>

      <View
        className="flex-row rounded-full mx-6"
        style={{
          marginTop: hp(3),
          backgroundColor: '#F3F4F6',
          padding: wp(1),
        }}
      >
        <TouchableOpacity
          onPress={() => setSelectedTab('upcoming')}
          className="flex-1 items-center justify-center rounded-full"
          style={{
            paddingVertical: hp(1.5),
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
          onPress={() => setSelectedTab('past')}
          className="flex-1 items-center justify-center rounded-full"
          style={{
            paddingVertical: hp(1.5),
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

      <ScrollView
        className="flex-1 px-6"
        style={{ marginTop: hp(3) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredAppointments.length > 0
          ? filteredAppointments.map(renderAppointmentCard)
          : !isLoading && renderEmptyState()}

        <View style={{ height: hp(15) }} />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(4), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={() => router.push('/home' as any)}
          className="rounded-full items-center justify-center"
          style={{ backgroundColor: Colors.primary, paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
            Book Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyAppointmentsScreen() {
  return (
    <AuthGuard message="Please login to view your appointments">
      <MyAppointmentsContent />
    </AuthGuard>
  );
}
