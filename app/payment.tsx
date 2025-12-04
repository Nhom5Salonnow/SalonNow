import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Menu, CreditCard } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

interface PaymentMethod {
  id: string;
  type: 'mastercard' | 'visa' | 'paypal';
  lastFour: string;
  isSelected: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'mastercard', lastFour: '9035', isSelected: true },
];

export default function PaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState('1');

  const servicePrice = 40;
  const tax = 2.5;
  const totalPrice = servicePrice + tax;

  const handleBookNow = () => {
    // Process payment and navigate
    router.push('/feedback' as any);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Pink decorative background */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(20),
          top: -hp(10),
          width: wp(80),
          height: wp(80),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.4,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: hp(6) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Menu size={rf(24)} color="#000" />
          </TouchableOpacity>
          <View style={{ width: wp(7) }} />
          <View
            className="rounded-full overflow-hidden"
            style={{ width: wp(14), height: wp(14) }}
          >
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Overview Section */}
        <View className="px-6" style={{ marginTop: hp(8) }}>
          <Text style={{ fontSize: rf(22), fontWeight: '500', color: '#000' }}>
            Overview
          </Text>

          {/* Price breakdown */}
          <View style={{ marginTop: hp(3) }}>
            <View className="flex-row justify-between mb-2">
              <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#000' }}>
                Hair Spa :
              </Text>
              <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#000' }}>
                ${servicePrice}
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <Text style={{ fontSize: rf(16), color: '#9CA3AF' }}>
                Tax :
              </Text>
              <Text style={{ fontSize: rf(16), color: '#9CA3AF' }}>
                ${tax}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ fontSize: rf(18), fontWeight: '600', color: Colors.primary }}>
                Total Price :
              </Text>
              <Text style={{ fontSize: rf(18), fontWeight: '600', color: Colors.primary }}>
                ${totalPrice}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            className="my-6"
            style={{ height: hp(0.15), backgroundColor: '#E5E7EB' }}
          />

          {/* Payment Section */}
          <Text style={{ fontSize: rf(20), fontWeight: '600', color: '#000' }}>
            Payment
          </Text>

          {/* Payment Methods */}
          <View style={{ marginTop: hp(3) }}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                className="flex-row items-center rounded-2xl p-4 mb-3"
                style={{
                  borderWidth: selectedMethod === method.id ? 2 : 1,
                  borderColor: selectedMethod === method.id ? Colors.primary : '#E5E7EB',
                  backgroundColor: '#FAFAFA',
                }}
              >
                {/* Card Logo */}
                <View
                  className="rounded-xl overflow-hidden items-center justify-center"
                  style={{ width: wp(25), height: wp(15), backgroundColor: '#FFF' }}
                >
                  {method.type === 'mastercard' && (
                    <View className="flex-row items-center">
                      <View
                        className="rounded-full"
                        style={{ width: wp(7.5), height: wp(7.5), backgroundColor: '#EB001B' }}
                      />
                      <View
                        className="rounded-full -ml-3"
                        style={{ width: wp(7.5), height: wp(7.5), backgroundColor: '#F79E1B' }}
                      />
                    </View>
                  )}
                </View>

                {/* Card Number */}
                <Text
                  style={{
                    fontSize: rf(16),
                    color: '#9CA3AF',
                    marginLeft: wp(4),
                  }}
                >
                  **** ****
                  <Text style={{ color: '#6B7280' }}>711 {method.lastFour}</Text>
                </Text>
              </TouchableOpacity>
            ))}

            {/* Add New Card */}
            <TouchableOpacity
              className="flex-row items-center justify-center rounded-2xl p-4"
              style={{ borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed' }}
            >
              <CreditCard size={rf(18)} color="#9CA3AF" />
              <Text style={{ fontSize: rf(14), color: '#9CA3AF', marginLeft: wp(2) }}>
                Add new card
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: hp(20) }} />
      </ScrollView>

      {/* Book Now Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(4), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={handleBookNow}
          className="rounded-full items-center justify-center"
          style={{ backgroundColor: Colors.primary, paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
            Book Now / ${totalPrice}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
