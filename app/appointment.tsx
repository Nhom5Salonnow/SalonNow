import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { LinearGradient } from 'expo-linear-gradient';
import { WeekCalendar, generateWeekDays, AuthGuard } from '@/components';

function AppointmentContent() {
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedHour] = useState('2:00');
  const [selectedPeriod] = useState('P.M');
  const currentMonth = 'April';

  // Generate week days using helper
  const weekDays = generateWeekDays(10, selectedDate);

  const handleBook = () => {
    // Handle booking logic
    console.log('Booking:', { selectedDate, selectedHour, selectedPeriod });
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Pink gradient header background */}
      <LinearGradient
        colors={['#FECDD3', '#FFF5F5', '#FFFFFF']}
        locations={[0, 0.4, 0.7]}
        className="absolute top-0 left-0 right-0"
        style={{ height: hp(45) }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center px-6"
          style={{ paddingTop: hp(6) }}
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

        {/* Week Calendar */}
        <View style={{ marginTop: hp(2) }}>
          <WeekCalendar
            month={currentMonth}
            weekDays={weekDays}
            onSelectDate={setSelectedDate}
          />
        </View>

        {/* Time Picker */}
        <View
          className="flex-row justify-center items-center"
          style={{ marginTop: hp(4), gap: wp(4) }}
        >
          {/* Hour Picker */}
          <View
            className="rounded-full border border-gray-300 px-6 py-3"
            style={{ minWidth: wp(25) }}
          >
            <Text
              className="text-center"
              style={{ fontSize: rf(16), color: '#000' }}
            >
              {selectedHour}
            </Text>
          </View>

          {/* Period Picker */}
          <View
            className="rounded-full border border-gray-300 px-6 py-3"
            style={{ minWidth: wp(20) }}
          >
            <Text
              className="text-center"
              style={{ fontSize: rf(16), color: '#000' }}
            >
              {selectedPeriod}
            </Text>
          </View>
        </View>

        {/* Service Card */}
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
          {/* Service Type */}
          <Text
            style={{
              fontSize: rf(16),
              color: '#6B7280',
              marginBottom: hp(2),
            }}
          >
            Hair Design & Cut
          </Text>

          {/* Stylist Info */}
          <View className="flex-row items-center">
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240',
              }}
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
                Doe John
              </Text>
            </View>
          </View>

          {/* Service Details */}
          <View
            className="flex-row justify-between items-center"
            style={{ marginTop: hp(2) }}
          >
            <Text style={{ fontSize: rf(14), color: '#6B7280' }}>
              Basic Haircut
            </Text>
            <Text style={{ fontSize: rf(16), fontWeight: '500', color: '#000' }}>
              €50
            </Text>
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: hp(15) }} />
      </ScrollView>

      {/* Book Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(4) }}
      >
        <TouchableOpacity
          onPress={handleBook}
          className="items-center justify-center rounded-full"
          style={{
            backgroundColor: '#F87171',
            paddingVertical: hp(2),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text
            className="text-white font-medium"
            style={{ fontSize: rf(18) }}
          >
            Book
          </Text>
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
