import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Menu, Search, Star, ShoppingCart } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { DecorativeCircle, QuoteBanner } from '@/components';

interface ServiceItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  reviews: number;
}

const SERVICES: ServiceItem[] = [
  {
    id: '1',
    name: 'Basic Haircut',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240',
    rating: 3,
    price: 60,
    reviews: 24,
  },
  {
    id: '2',
    name: 'Layered Haircut',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240',
    rating: 2,
    price: 65,
    reviews: 18,
  },
  {
    id: '3',
    name: 'Bob Haircut',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240',
    rating: 3,
    price: 65,
    reviews: 31,
  },
];

export default function ServiceDetailScreen() {
  const params = useLocalSearchParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Get category name based on ID
  const getCategoryInfo = (id: string) => {
    const categories: Record<string, { name: string; quote: string }> = {
      'hair-design': { name: 'Hair Design & Cut', quote: '"Crafting Confidence,\nOne Cut at a Time."' },
      'color-shine': { name: 'Color & Shine', quote: '"Shine Bright,\nColor Your World."' },
      'texture-volume': { name: 'Texture & Volume', quote: '"Volume That Speaks,\nTexture That Inspires."' },
      'scalp-spa': { name: 'Scalp & Head Spa', quote: '"Relax & Rejuvenate,\nFrom Root to Soul."' },
      'facial-neck': { name: 'Facial & Neck Care', quote: '"Glow From Within,\nCare That Shows."' },
      'bridal-vip': { name: 'Bridal & VIP Styling', quote: '"Your Special Day,\nPerfectly Styled."' },
    };
    return categories[id] || { name: 'Services', quote: '"Beauty Awaits."' };
  };

  const { name: categoryName, quote: categoryQuote } = getCategoryInfo(params.id as string);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      onPress={() => toggleService(item.id)}
      className="flex-row items-center bg-white rounded-2xl mb-3 p-3"
      style={{
        borderWidth: selectedServices.includes(item.id) ? 2 : 1,
        borderColor: selectedServices.includes(item.id) ? Colors.primary : '#E5E7EB',
      }}
    >
      <Image
        source={{ uri: item.image }}
        className="rounded-xl"
        style={{ width: wp(18), height: wp(18) }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
          <Text style={{ fontSize: rf(14), color: '#000', marginLeft: 4 }}>
            {item.rating}
          </Text>
          <Text style={{ fontSize: rf(14), color: '#6B7280', marginLeft: 12 }}>
            €{item.price}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text style={{ fontSize: rf(12), color: '#9CA3AF' }}>per 1</Text>
        <TouchableOpacity onPress={() => router.push('/review' as any)}>
          <Text style={{ fontSize: rf(12), color: Colors.primary, marginTop: 4 }}>
            review
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.5} />

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
            {categoryName}
          </Text>
          <TouchableOpacity>
            <Search size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View className="mx-4 mt-4">
          <QuoteBanner
            quote={categoryQuote}
            imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298"
          />
        </View>

        {/* Menu Section */}
        <View className="px-6 mt-6">
          <Text
            className="text-center mb-4"
            style={{ fontSize: rf(22), fontWeight: '500', color: '#000' }}
          >
            Menu
          </Text>

          <FlatList
            data={SERVICES}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Stylist Section */}
        <View className="px-6 mt-6">
          <Text
            className="text-center mb-4"
            style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}
          >
            Stylist
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/service/choose-stylist' as any)}
            className="self-center rounded-full px-8 py-3"
            style={{ backgroundColor: Colors.salon.pinkLight }}
          >
            <Text style={{ fontSize: rf(16), color: '#000', fontWeight: '500' }}>
              Choose stylist
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between px-6"
        style={{ paddingBottom: hp(12), paddingTop: hp(2), backgroundColor: 'white' }}
      >
        <TouchableOpacity
          onPress={() => router.push('/appointment' as any)}
          className="flex-1 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: Colors.primary, paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
            Book Appointment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-full p-3"
          style={{ backgroundColor: Colors.salon.pinkLight }}
        >
          <ShoppingCart size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
