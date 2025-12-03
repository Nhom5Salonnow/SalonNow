import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Pencil, Home, Grid, MessageSquare, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditEmployeeScreen() {
  const [fullName, setFullName] = useState('Doe John');
  const [age, setAge] = useState('22');
  const [phone, setPhone] = useState('11111.99999');
  const [email, setEmail] = useState('Do22@gmail.com');

  const handleSave = () => {
    // Save employee data
    console.log('Saving employee:', { fullName, age, phone, email });
    router.back();
  };

  const handleDelete = () => {
    // Delete employee
    console.log('Deleting employee');
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={[Colors.primary, Colors.primary, '#FF8A8A']}
          style={{
            paddingTop: hp(6),
            paddingBottom: hp(4),
            borderBottomLeftRadius: wp(8),
            borderBottomRightRadius: wp(8),
          }}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingHorizontal: wp(6) }}
          >
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>

          {/* Profile Image */}
          <View className="items-center" style={{ marginTop: hp(2) }}>
            <View className="relative">
              <View
                className="rounded-full overflow-hidden"
                style={{
                  width: wp(40),
                  height: wp(40),
                  borderWidth: wp(1),
                  borderColor: '#F97316',
                }}
              >
                <Image
                  source={{
                    uri: 'https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240',
                  }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              {/* Edit photo button */}
              <TouchableOpacity
                className="absolute rounded-full items-center justify-center bg-white"
                style={{
                  top: wp(1),
                  right: wp(1),
                  width: wp(8),
                  height: wp(8),
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Pencil size={rf(14)} color="#000" />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontSize: rf(24),
                fontWeight: '600',
                color: '#000',
                marginTop: hp(2),
              }}
            >
              {fullName}
            </Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View
          className="bg-white rounded-3xl mx-4 -mt-4"
          style={{
            padding: wp(6),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Full Name */}
          <View className="flex-row items-center" style={{ marginBottom: hp(3) }}>
            <Text style={{ fontSize: rf(16), color: '#000', width: wp(25) }}>
              Full Name
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              className="flex-1 rounded-full bg-gray-50 px-4"
              style={{
                paddingVertical: hp(1.5),
                fontSize: rf(14),
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            />
          </View>

          {/* Age */}
          <View className="flex-row items-center" style={{ marginBottom: hp(3) }}>
            <Text style={{ fontSize: rf(16), color: '#000', width: wp(25) }}>
              Age
            </Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              className="flex-1 rounded-full bg-gray-50 px-4"
              style={{
                paddingVertical: hp(1.5),
                fontSize: rf(14),
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            />
          </View>

          {/* Phone */}
          <View className="flex-row items-center" style={{ marginBottom: hp(3) }}>
            <Text style={{ fontSize: rf(16), color: '#000', width: wp(25) }}>
              Phone
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              className="flex-1 rounded-full bg-gray-50 px-4"
              style={{
                paddingVertical: hp(1.5),
                fontSize: rf(14),
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            />
          </View>

          {/* Email */}
          <View className="flex-row items-center" style={{ marginBottom: hp(3) }}>
            <Text style={{ fontSize: rf(16), color: '#000', width: wp(25) }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              className="flex-1 rounded-full bg-gray-50 px-4"
              style={{
                paddingVertical: hp(1.5),
                fontSize: rf(14),
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View
          className="flex-row justify-center"
          style={{ marginTop: hp(4), paddingHorizontal: wp(6), gap: wp(4) }}
        >
          <TouchableOpacity
            onPress={handleDelete}
            className="rounded-full items-center justify-center"
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: hp(2),
              paddingHorizontal: wp(10),
            }}
          >
            <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#fff' }}>
              Delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            className="rounded-full items-center justify-center"
            style={{
              backgroundColor: '#60A5FA',
              paddingVertical: hp(2),
              paddingHorizontal: wp(12),
            }}
          >
            <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#fff' }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around"
        style={{
          paddingVertical: hp(2),
          paddingBottom: hp(3),
          backgroundColor: Colors.salon.pinkBg,
          borderTopLeftRadius: wp(6),
          borderTopRightRadius: wp(6),
        }}
      >
        <TouchableOpacity
          onPress={() => router.push('/admin/home' as any)}
          className="items-center"
        >
          <Home size={rf(24)} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/admin/dashboard' as any)}
          className="items-center"
        >
          <Grid size={rf(24)} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <MessageSquare size={rf(24)} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <User size={rf(24)} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
