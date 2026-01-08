import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Search, Pencil, Plus, Star } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';
import { DecorativeCircle, AdminBottomNav } from '@/components';

interface ServiceItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
}

const SERVICES: ServiceItem[] = [
  {
    id: '1',
    name: 'Face Massage',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240',
    rating: 3,
    price: 50,
  },
  {
    id: '2',
    name: 'Facial',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240',
    rating: 2,
    price: 50,
  },
  {
    id: '3',
    name: 'Neck Massage',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240',
    rating: 3,
    price: 50,
  },
];

export default function EditCategoryScreen() {
  const categoryName = 'Facial & Neck Care';
  const categoryQuote = '"Nourish Your Skin\nRenew Your Soul"';

  const handleEditService = (serviceId: string) => {
    // Edit service
    console.log('Edit service:', serviceId);
  };

  const handleAddService = () => {
    // Add new service
    console.log('Add new service');
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.5} />
      <DecorativeCircle position="topRight" size="medium" opacity={0.3} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
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

        {/* Banner - Editable */}
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
          {/* Edit banner button */}
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

        {/* Menu Section */}
        <View style={{ paddingHorizontal: wp(6), marginTop: hp(4) }}>
          <Text
            className="text-center"
            style={{ fontSize: rf(20), fontWeight: '500', color: '#000', marginBottom: hp(2) }}
          >
            Menu
          </Text>

          {/* Service Items */}
          {SERVICES.map((service) => (
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
              {/* Edit service button */}
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

          {/* Add Service Button */}
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
