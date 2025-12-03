import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Menu, Search, Users, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

interface Stylist {
  id: string;
  name: string;
  role: string;
  image: string;
  isTopRated: boolean;
}

const STYLISTS: Stylist[] = [
  {
    id: '1',
    name: 'Praveen',
    role: 'Hair Specialist',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240',
    isTopRated: true,
  },
  {
    id: '2',
    name: 'Thinu',
    role: 'Hair Dresser',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240',
    isTopRated: true,
  },
  {
    id: '3',
    name: 'Lisa',
    role: 'Hair Stylist',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240',
    isTopRated: false,
  },
];

type StylistOption = 'any' | 'multiple' | string;

export default function ChooseStylistScreen() {
  const [selectedOption, setSelectedOption] = useState<StylistOption>('any');

  const handleDone = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Pink decorative background */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(30),
          top: -hp(5),
          width: wp(70),
          height: wp(70),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.5,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: hp(6) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Menu size={28} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}>
            Hair Design & Cut
          </Text>
          <TouchableOpacity>
            <Search size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View
          className="mx-4 mt-4 rounded-3xl overflow-hidden"
          style={{ backgroundColor: Colors.primary, height: hp(20) }}
        >
          <View className="flex-row h-full">
            <View className="flex-1 justify-center pl-5">
              <Text
                style={{
                  fontSize: rf(18),
                  fontStyle: 'italic',
                  color: '#000',
                  lineHeight: rf(26),
                }}
              >
                {'"Crafting Confidence,\nOne Cut at a Time."'}
              </Text>
            </View>
            <Image
              source={{
                uri: 'https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298',
              }}
              style={{ width: wp(40), height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Menu Title */}
        <Text
          className="px-6 mt-6"
          style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}
        >
          Menu
        </Text>

        {/* Stylist Options */}
        <View className="px-6 mt-4">
          {/* Any Stylist */}
          <TouchableOpacity
            onPress={() => setSelectedOption('any')}
            className="flex-row items-center bg-white rounded-2xl mb-3 p-4"
            style={{
              borderWidth: selectedOption === 'any' ? 2 : 1,
              borderColor: selectedOption === 'any' ? Colors.primary : '#E5E7EB',
            }}
          >
            <View
              className="rounded-xl items-center justify-center"
              style={{
                width: wp(14),
                height: wp(14),
                backgroundColor: '#E9D5FF',
              }}
            >
              <Users size={24} color="#7C3AED" />
            </View>
            <View className="ml-4">
              <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
                Any Stylist
              </Text>
              <Text style={{ fontSize: rf(13), color: '#6B7280', marginTop: 2 }}>
                Next available stylist
              </Text>
            </View>
          </TouchableOpacity>

          {/* Multiple Stylists */}
          <TouchableOpacity
            onPress={() => setSelectedOption('multiple')}
            className="flex-row items-center bg-white rounded-2xl mb-3 p-4"
            style={{
              borderWidth: selectedOption === 'multiple' ? 2 : 1,
              borderColor: selectedOption === 'multiple' ? Colors.primary : '#E5E7EB',
            }}
          >
            <View
              className="rounded-xl items-center justify-center"
              style={{
                width: wp(14),
                height: wp(14),
                backgroundColor: '#E9D5FF',
              }}
            >
              <User size={24} color="#3B82F6" />
            </View>
            <View className="ml-4">
              <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
                Multiple Stylists
              </Text>
              <Text style={{ fontSize: rf(13), color: '#6B7280', marginTop: 2 }}>
                Choose per service
              </Text>
            </View>
          </TouchableOpacity>

          {/* Individual Stylists */}
          {STYLISTS.map((stylist) => (
            <TouchableOpacity
              key={stylist.id}
              onPress={() => setSelectedOption(stylist.id)}
              className="flex-row items-center bg-white rounded-2xl mb-3 p-4"
              style={{
                borderWidth: selectedOption === stylist.id ? 2 : 1,
                borderColor: selectedOption === stylist.id ? Colors.primary : '#E5E7EB',
              }}
            >
              <Image
                source={{ uri: stylist.image }}
                className="rounded-xl"
                style={{ width: wp(14), height: wp(14) }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-4">
                <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
                  {stylist.name}
                </Text>
                <Text style={{ fontSize: rf(13), color: '#6B7280', marginTop: 2 }}>
                  {stylist.role}
                </Text>
              </View>
              {stylist.isTopRated && (
                <View
                  className="rounded-full px-3 py-1 flex-row items-center"
                  style={{ backgroundColor: '#FEF3C7' }}
                >
                  <Text style={{ fontSize: rf(12), color: '#92400E' }}>
                    🏆 Top Rated
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      {/* Done Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(12), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={handleDone}
          className="rounded-full items-center justify-center"
          style={{
            backgroundColor: Colors.salon.pinkLight,
            paddingVertical: hp(1.5),
            width: wp(30),
          }}
        >
          <Text style={{ fontSize: rf(16), color: '#000', fontWeight: '500' }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
