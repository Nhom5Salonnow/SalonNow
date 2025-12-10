import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { WeekCalendar, generateWeekDays, AuthGuard } from '@/components';

interface Appointment {
  id: string;
  time: string;
  category: string;
  service: string;
  stylistName: string;
  stylistImage: string;
  customerName: string;
  customerImage: string;
  price: number;
  status: 'confirmed' | 'pending';
}

const APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    time: '2:00 PM',
    category: 'Hair Design & Cut',
    service: 'Basic Haircut',
    stylistName: 'Lisa',
    stylistImage: 'https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240',
    customerName: 'You',
    customerImage: 'https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114',
    price: 50,
    status: 'confirmed',
  },
  {
    id: '2',
    time: '5:00 PM',
    category: 'Color & Shine',
    service: 'Hair dying',
    stylistName: 'Lisa',
    stylistImage: 'https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240',
    customerName: 'Doe John',
    customerImage: 'https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240',
    price: 29,
    status: 'pending',
  },
];

function MyAppointmentsContent() {
  const [selectedDate, setSelectedDate] = useState(12);
  const currentMonth = 'April';

  // Generate week days with appointments using helper
  const weekDays = generateWeekDays(10, selectedDate, [12, 14]);

  const getStatusColor = (status: string) => {
    return status === 'confirmed' ? '#86EFAC' : Colors.primary;
  };

  return (
    <View className="flex-1 bg-white">
      {/* Pink gradient header */}
      <LinearGradient
        colors={['#FECDD3', '#FFF5F5', '#FFFFFF']}
        locations={[0, 0.5, 0.8]}
        className="absolute top-0 left-0 right-0"
        style={{ height: hp(35) }}
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
            showAppointmentIndicator
          />
        </View>

        {/* Appointments List */}
        <View className="px-6" style={{ marginTop: hp(4) }}>
          {APPOINTMENTS.map((appointment) => (
            <View key={appointment.id} className="mb-6">
              {/* Time with left border */}
              <View className="flex-row items-center">
                <View
                  className="rounded-full px-4 py-2"
                  style={{ borderWidth: 1, borderColor: Colors.primary }}
                >
                  <Text style={{ fontSize: rf(14), color: '#000' }}>
                    {appointment.time}
                  </Text>
                </View>
              </View>

              {/* Appointment Card */}
              <View className="flex-row mt-3">
                {/* Left border line */}
                <View
                  style={{
                    width: wp(0.8),
                    backgroundColor: Colors.primary,
                    marginRight: wp(4),
                    borderRadius: wp(0.5),
                  }}
                />

                {/* Card content */}
                <View
                  className="flex-1 rounded-2xl p-4"
                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                >
                  <View className="flex-row justify-between">
                    {/* Left side - Category & Stylist */}
                    <View className="items-center">
                      <Text style={{ fontSize: rf(14), fontWeight: '600', color: '#000' }}>
                        {appointment.category}
                      </Text>
                      <Image
                        source={{ uri: appointment.stylistImage }}
                        className="rounded-full mt-2"
                        style={{ width: wp(12), height: wp(12) }}
                      />
                      <Text style={{ fontSize: rf(14), color: '#000', marginTop: hp(0.5) }}>
                        {appointment.stylistName}
                      </Text>
                    </View>

                    {/* Right side - Service & Customer */}
                    <View className="items-center">
                      <Text style={{ fontSize: rf(14), fontWeight: '600', color: '#000' }}>
                        {appointment.service}
                      </Text>
                      <Image
                        source={{ uri: appointment.customerImage }}
                        className="rounded-full mt-2"
                        style={{ width: wp(12), height: wp(12) }}
                      />
                      <Text style={{ fontSize: rf(14), color: '#000', marginTop: hp(0.5) }}>
                        {appointment.customerName}
                      </Text>
                    </View>
                  </View>

                  {/* Price */}
                  <Text
                    className="text-center mt-3"
                    style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}
                  >
                    €{appointment.price}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      {/* Book Appointment Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(4), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={() => router.push('/appointment' as any)}
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
