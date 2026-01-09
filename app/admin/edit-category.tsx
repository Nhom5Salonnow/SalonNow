import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Search, Pencil, Plus, Star } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors, SERVICES_MENU, CATEGORY_INFO } from '@/constants';
import { DecorativeCircle, AdminBottomNav } from '@/components';
import { serviceApi, categoryApi } from '@/api';

interface ServiceItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
}

const HARDCODED_SERVICES: ServiceItem[] = SERVICES_MENU.map(s => ({
  id: s.id,
  name: s.name,
  image: s.image,
  rating: s.rating,
  price: s.price,
}));

const mergeServices = (apiData: ServiceItem[], hardcodedData: ServiceItem[]): ServiceItem[] => {
  const merged = new Map<string, ServiceItem>();
  hardcodedData.forEach(item => merged.set(item.id, item));
  apiData.forEach(item => merged.set(item.id, item));
  return Array.from(merged.values());
};

export default function EditCategoryScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  const hardcodedInfo = params.id ? CATEGORY_INFO[params.id] : null;

  const [categoryName, setCategoryName] = useState(hardcodedInfo?.name || 'Category');
  const [categoryQuote, setCategoryQuote] = useState(hardcodedInfo?.quote || '"Nourish Your Skin\nRenew Your Soul"');
  const [services, setServices] = useState<ServiceItem[]>(HARDCODED_SERVICES);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (params.id) {
          const catResponse = await categoryApi.getCategoryById(params.id);
          if (catResponse.success && catResponse.data) {
            setCategoryName(catResponse.data.name || hardcodedInfo?.name || 'Category');
            setCategoryQuote(catResponse.data.quote || hardcodedInfo?.quote || '"Beauty Awaits"');
          }

          const svcResponse = await serviceApi.getServices({ categoryId: params.id });
          if (svcResponse.success && svcResponse.data && svcResponse.data.length > 0) {
            const apiServices = svcResponse.data.map((svc: any) => ({
              id: svc.id || svc._id,
              name: svc.name,
              image: svc.image || svc.imageUrl || HARDCODED_SERVICES[0]?.image,
              rating: svc.rating || 0,
              price: svc.price || 0,
            }));
            setServices(mergeServices(apiServices, HARDCODED_SERVICES));
          }
        }
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };
    fetchData();
  }, [params.id, hardcodedInfo]);

  const handleEditService = (serviceId: string) => {
    console.log('Edit service:', serviceId);
  };

  const handleAddService = () => {
    console.log('Add new service');
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.5} />
      <DecorativeCircle position="topRight" size="medium" opacity={0.3} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: wp(6), paddingTop: hp(6) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(18), fontWeight: '500', color: '#000' }}>
            {categoryName}
          </Text>
          <TouchableOpacity>
            <Search size={rf(24)} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="relative" style={{ marginTop: hp(3), paddingHorizontal: wp(4) }}>
          <View
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: Colors.primary, height: hp(18) }}
          >
            <View className="flex-row h-full">
              <View className="flex-1 justify-center" style={{ paddingLeft: wp(5) }}>
                <Text
                  style={{
                    fontSize: rf(16),
                    fontStyle: 'italic',
                    color: '#000',
                    lineHeight: rf(24),
                  }}
                >
                  {categoryQuote}
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
          <TouchableOpacity
            className="absolute rounded-full items-center justify-center bg-white"
            style={{
              top: -wp(2),
              right: wp(2),
              width: wp(8),
              height: wp(8),
              borderWidth: 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Pencil size={rf(14)} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: wp(6), marginTop: hp(4) }}>
          <Text
            className="text-center"
            style={{ fontSize: rf(20), fontWeight: '500', color: '#000', marginBottom: hp(2) }}
          >
            Menu
          </Text>

          {services.map((service) => (
            <View
              key={service.id}
              className="flex-row items-center bg-white rounded-2xl mb-3 p-3"
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
                elevation: 1,
              }}
            >
              <Image
                source={{ uri: service.image }}
                className="rounded-xl"
                style={{ width: wp(18), height: wp(18) }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text style={{ fontSize: rf(16), fontWeight: '600', color: '#000' }}>
                  {service.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Star size={rf(14)} color="#F59E0B" fill="#F59E0B" />
                  <Text style={{ fontSize: rf(14), color: '#000', marginLeft: wp(1) }}>
                    {service.rating}
                  </Text>
                  <Text style={{ fontSize: rf(14), color: '#6B7280', marginLeft: wp(4) }}>
                    €{service.price}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text style={{ fontSize: rf(12), color: '#9CA3AF' }}>per 1</Text>
                <TouchableOpacity className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
                  <Plus size={rf(14)} color="#6B7280" />
                  <Text style={{ fontSize: rf(12), color: '#6B7280', marginLeft: wp(1) }}>
                    review
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => handleEditService(service.id)}
                className="absolute rounded-full items-center justify-center bg-white"
                style={{
                  top: -wp(1),
                  right: -wp(1),
                  width: wp(6),
                  height: wp(6),
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}
              >
                <Pencil size={rf(10)} color="#000" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            onPress={handleAddService}
            className="rounded-2xl items-center justify-center"
            style={{
              backgroundColor: '#E5E7EB',
              paddingVertical: hp(3),
              marginTop: hp(1),
            }}
          >
            <Plus size={rf(28)} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      <AdminBottomNav />
    </View>
  );
}
