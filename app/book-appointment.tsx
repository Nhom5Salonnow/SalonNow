import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { WeekCalendar, generateWeekDays, AuthGuard } from '@/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts';
import { bookingApi } from '@/api/bookingApi';

interface BookingParams {
  salonId?: string;
  salonName?: string;
  serviceId?: string;
  serviceName?: string;
  servicePrice?: string;
  stylistId?: string;
  stylistName?: string;
  stylistImage?: string;
}

function AppointmentContent() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams() as BookingParams;
  const { user } = useAuth();

  const today = new Date();
  const currentDay = today.getDate();

  const [selectedDate, setSelectedDate] = useState(currentDay);
  const [selectedHour, setSelectedHour] = useState('14:00');
  const [isBooking, setIsBooking] = useState(false);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[today.getMonth()];

  const weekDays = generateWeekDays(currentDay - 2, selectedDate);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const serviceName = params.serviceName || 'Hair Design & Cut';
  const servicePrice = params.servicePrice || '50';
  const salonName = params.salonName || 'Salon';
  const stylistName = params.stylistName || 'Doe John';
  const stylistImage = params.stylistImage || 'https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240';

  const handleBook = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book an appointment.');
      return;
    }

    if (!params.salonId || !params.serviceId) {
      Alert.alert('Missing Information', 'Please select a salon and service first.');
      return;
    }

    setIsBooking(true);

    try {
      const bookingDate = new Date(today.getFullYear(), today.getMonth(), selectedDate);
      const [hours, minutes] = selectedHour.split(':').map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);
      const startTime = bookingDate.toISOString();

      const apiResponse = await bookingApi.createBooking({
        salonId: params.salonId,
        serviceId: params.serviceId,
        stylistId: params.stylistId,
        startTime: startTime,
        notes: '',
      });

      if (apiResponse.success && apiResponse.data && apiResponse.data.id) {
        Alert.alert(
          'Booking Confirmed',
          `Your appointment for ${serviceName} has been booked for ${selectedHour}.`,
          [
            {
              text: 'View My Appointments',
              onPress: () => router.replace('/my-appointments' as any),
            },
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Booking Failed', apiResponse.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={['#FECDD3', '#FFF5F5', '#FFFFFF']}
        locations={[0, 0.5, 1]}
        className="absolute top-0 left-0 right-0"
        style={{ height: hp(25) }}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <View
          className="flex-row items-center px-6"
          style={{ paddingTop: insets.top + hp(1) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={28} color="#000" />
          </TouchableOpacity>
          <Text
            className="flex-1 text-center"
            style={{ fontSize: rf(22), fontWeight: '500', color: '#000' }}
          >
            Appointment
          </Text>
          <View style={{ width: wp(7) }} />
        </View>

        <View style={{ marginTop: hp(2) }}>
          <WeekCalendar
            month={currentMonth}
            weekDays={weekDays}
            onSelectDate={setSelectedDate}
          />
        </View>

        <View style={{ marginTop: hp(3), paddingHorizontal: wp(6) }}>
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000', marginBottom: hp(1.5) }}>
            Select Time
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: wp(2) }}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setSelectedHour(time)}
                className="rounded-full items-center justify-center"
                style={{
                  paddingVertical: hp(1.2),
                  paddingHorizontal: wp(4),
                  backgroundColor: selectedHour === time ? Colors.primary : '#F3F4F6',
                  borderWidth: selectedHour === time ? 0 : 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    fontWeight: selectedHour === time ? '600' : '400',
                    color: selectedHour === time ? '#FFF' : '#374151',
                  }}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          className="mx-6 rounded-2xl bg-white border border-gray-200"
          style={{
            marginTop: hp(4),
            padding: wp(4),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: rf(16),
              color: '#6B7280',
              marginBottom: hp(2),
            }}
          >
            {serviceName}
          </Text>

          <View className="flex-row items-center">
            <Image
              source={{ uri: stylistImage }}
              className="rounded-full"
              style={{ width: wp(15), height: wp(15) }}
              resizeMode="cover"
            />
            <View style={{ marginLeft: wp(4) }}>
              <Text
                style={{
                  fontSize: rf(18),
                  fontWeight: '500',
                  color: '#000',
                }}
              >
                {stylistName}
              </Text>
              <Text style={{ fontSize: rf(13), color: Colors.gray[500] }}>
                {salonName}
              </Text>
            </View>
          </View>

          <View
            className="flex-row justify-between items-center"
            style={{ marginTop: hp(2) }}
          >
            <Text style={{ fontSize: rf(14), color: '#6B7280' }}>
              {serviceName}
            </Text>
            <Text style={{ fontSize: rf(16), fontWeight: '500', color: Colors.primary }}>
              ${servicePrice}
            </Text>
          </View>
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(4) }}
      >
        <TouchableOpacity
          onPress={handleBook}
          disabled={isBooking}
          className="items-center justify-center rounded-full"
          style={{
            backgroundColor: isBooking ? Colors.gray[300] : Colors.primary,
            paddingVertical: hp(2),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {isBooking ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text
              className="text-white font-medium"
              style={{ fontSize: rf(18) }}
            >
              Book
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AppointmentScreen() {
  return (
    <AuthGuard message="Please login to book an appointment with our stylists">
      <AppointmentContent />
    </AuthGuard>
  );
}
