import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Pencil } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { FormField, AdminBottomNav } from '@/components';

export default function EditEmployeeScreen() {
  const [fullName, setFullName] = useState('Doe John');
  const [age, setAge] = useState('22');
  const [phone, setPhone] = useState('11111.99999');
  const [email, setEmail] = useState('Do22@gmail.com');

  const handleSave = () => {
    console.log('Saving employee:', { fullName, age, phone, email });
    router.back();
  };

  const handleDelete = () => {
    console.log('Deleting employee');
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[Colors.primary, Colors.primary, '#FF8A8A']}
          style={{
            paddingTop: hp(6),
            paddingBottom: hp(4),
            borderBottomLeftRadius: wp(8),
            borderBottomRightRadius: wp(8),
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ paddingHorizontal: wp(6) }}
          >
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>

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

        <View
          className="bg-white rounded-3xl mx-4 -mt-4"
          style={{
            padding: wp(6),
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            elevation: 4,
          }}
        >
          <FormField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <FormField
            label="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
          <FormField
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

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

      <AdminBottomNav />
    </View>
  );
}
