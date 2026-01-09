import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Menu, Search, Star, ShoppingCart, Clock, AlertCircle } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors, SERVICES_MENU, CATEGORY_INFO } from '@/constants';
import { DecorativeCircle, QuoteBanner } from '@/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { serviceApi } from '@/api';

interface ServiceItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  reviews: number;
}

const HARDCODED_SERVICES: ServiceItem[] = SERVICES_MENU.map(s => ({
  id: s.id,
  name: s.name,
  image: s.image,
  rating: s.rating,
  price: s.price,
  reviews: s.reviews,
}));

const mergeServices = (apiData: ServiceItem[], hardcodedData: ServiceItem[]): ServiceItem[] => {
  const merged = new Map<string, ServiceItem>();
  hardcodedData.forEach(item => merged.set(item.id, item));
  apiData.forEach(item => merged.set(item.id, item));
  return Array.from(merged.values());
};

export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [slotsAvailable, setSlotsAvailable] = useState<number>(0);
  const [isFullyBooked, setIsFullyBooked] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>(HARDCODED_SERVICES);

  const categoryInfo = CATEGORY_INFO[params.id as string] || { name: 'Services', quote: '"Beauty Awaits."' };
  const { name: categoryName, quote: categoryQuote } = categoryInfo;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceApi.getServices({ categoryId: params.id as string });
        if (response.success && response.data && response.data.length > 0) {
          const apiServices = response.data.map((svc: any) => ({
            id: svc.id || svc._id,
            name: svc.name,
            image: svc.image || HARDCODED_SERVICES[0]?.image,
            rating: svc.rating || 3,
            price: svc.price || 50,
            reviews: svc.reviewCount || 0,
          }));
          setServices(mergeServices(apiServices, HARDCODED_SERVICES));
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }

      const availableSlots = Math.floor(Math.random() * 5);
      setSlotsAvailable(availableSlots);
      setIsFullyBooked(availableSlots === 0);
    };

    fetchServices();
  }, [params.id]);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleJoinWaitlist = () => {
    const selectedService = services.find(s => selectedServices.includes(s.id));
    router.push({
      pathname: '/waitlist/join',
      params: {
        serviceId: selectedService?.id || 'service-1',
        serviceName: selectedService?.name || categoryName,
        salonId: 'salon-1',
        salonName: 'Salon Now',
      },
    } as any);
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
            ${item.price}
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
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: insets.top + hp(1) }}
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

        <View className="mx-4 mt-4">
          <QuoteBanner
            quote={categoryQuote}
            imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298"
          />
        </View>

        <View className="px-6 mt-6">
          <Text
            className="text-center mb-4"
            style={{ fontSize: rf(22), fontWeight: '500', color: '#000' }}
          >
            Menu
          </Text>

          <FlatList
            data={services}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

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

      {isFullyBooked && (
        <View
          className="absolute left-0 right-0 flex-row items-center justify-center"
          style={{
            bottom: hp(22),
            backgroundColor: '#FFFBEB',
            paddingVertical: hp(1.5),
            paddingHorizontal: wp(4),
          }}
        >
          <AlertCircle size={rf(18)} color="#F59E0B" />
          <Text style={{ fontSize: rf(14), color: '#92400E', marginLeft: wp(2), fontWeight: '500' }}>
            Fully booked today - Join the waitlist!
          </Text>
        </View>
      )}

      {!isFullyBooked && slotsAvailable <= 3 && slotsAvailable > 0 && (
        <View
          className="absolute left-0 right-0 flex-row items-center justify-center"
          style={{
            bottom: hp(22),
            backgroundColor: '#ECFDF5',
            paddingVertical: hp(1.5),
            paddingHorizontal: wp(4),
          }}
        >
          <Clock size={rf(18)} color="#10B981" />
          <Text style={{ fontSize: rf(14), color: '#065F46', marginLeft: wp(2), fontWeight: '500' }}>
            Only {slotsAvailable} slot{slotsAvailable > 1 ? 's' : ''} left today!
          </Text>
        </View>
      )}

      <View
        className="absolute bottom-0 left-0 right-0 px-6"
        style={{ paddingBottom: hp(12), paddingTop: hp(2), backgroundColor: 'white' }}
      >
        {isFullyBooked ? (
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleJoinWaitlist}
              className="flex-1 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: Colors.primary, paddingVertical: hp(2) }}
            >
              <Text style={{ fontSize: rf(16), color: '#fff', fontWeight: '600' }}>
                Join Waitlist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-full p-3"
              style={{ backgroundColor: Colors.salon.pinkLight }}
            >
              <ShoppingCart size={24} color="#000" />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.push('/book-appointment' as any)}
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
        )}
      </View>
    </View>
  );
}
