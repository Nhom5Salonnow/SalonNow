import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Menu, Search, Users, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors, SPECIALISTS } from '@/constants';
import { DecorativeCircle, QuoteBanner } from '@/components';
import { stylistApi } from '@/api';

interface Stylist {
  id: string;
  name: string;
  role: string;
  image: string;
  isTopRated: boolean;
}

const HARDCODED_STYLISTS: Stylist[] = SPECIALISTS.map(s => ({
  id: s.id,
  name: s.name,
  role: s.role || 'Hair Stylist',
  image: s.imageUrl,
  isTopRated: s.isTopRated || false,
}));

const mergeStylists = (apiData: Stylist[], hardcodedData: Stylist[]): Stylist[] => {
  const merged = new Map<string, Stylist>();
  hardcodedData.forEach(item => merged.set(item.id, item));
  apiData.forEach(item => merged.set(item.id, item));
  return Array.from(merged.values());
};

type StylistOption = 'any' | 'multiple' | string;

export default function ChooseStylistScreen() {
  const params = useLocalSearchParams<{ salonId?: string; serviceId?: string }>();
  const [selectedOption, setSelectedOption] = useState<StylistOption>('any');
  const [stylists, setStylists] = useState<Stylist[]>(HARDCODED_STYLISTS);

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const response = params.salonId
          ? await stylistApi.getStylistsBySalon(params.salonId)
          : await stylistApi.getStylists();

        if (response.success && response.data && response.data.length > 0) {
          const apiStylists = response.data.map((sty: any) => ({
            id: sty.id || sty._id,
            name: sty.name,
            role: sty.specialty || sty.role || 'Hair Stylist',
            image: sty.avatar || sty.imageUrl || HARDCODED_STYLISTS[0]?.image,
            isTopRated: sty.rating >= 4.5 || sty.isTopRated || false,
          }));
          setStylists(mergeStylists(apiStylists, HARDCODED_STYLISTS));
        }
      } catch (error) {
        console.error('Error fetching stylists:', error);
      }
    };
    fetchStylists();
  }, [params.salonId]);

  const handleDone = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.5} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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

        <View className="mx-4 mt-4">
          <QuoteBanner
            quote='"Crafting Confidence,\nOne Cut at a Time."'
            imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298"
          />
        </View>

        <Text
          className="px-6 mt-6"
          style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}
        >
          Menu
        </Text>

        <View className="px-6 mt-4">
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

          {stylists.map((stylist) => (
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
                    Top Rated
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

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
