import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Menu, Bell, X, Plus, Pencil } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors, HOME_CATEGORIES, SPECIALISTS } from '@/constants';
import { DecorativeCircle, AdminBottomNav } from '@/components';

const PROMO_BANNERS = [
  {
    id: '1',
    imageUrl: 'https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298',
  },
];

export default function AdminHomeScreen() {
  const handleEditCategory = (categoryId: string) => {
    router.push(`/admin/edit-category?id=${categoryId}` as any);
  };

  const handleEditEmployee = (employeeId: string) => {
    router.push(`/admin/edit-employee?id=${employeeId}` as any);
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="xlarge" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between relative z-10"
          style={{ paddingHorizontal: wp(6), marginTop: hp(6) }}
        >
          <View className="flex-row items-center" style={{ gap: wp(4) }}>
            <TouchableOpacity className="p-2">
              <Menu size={rf(28)} color={Colors.salon.dark} strokeWidth={2} />
            </TouchableOpacity>
            <View>
              <Text style={{ fontSize: rf(18), fontWeight: '400', color: 'rgba(0,0,0,0.8)' }}>
                Hi
              </Text>
              <Text style={{ fontSize: rf(22), fontWeight: '400', fontStyle: 'italic', color: 'rgba(0,0,0,0.6)' }}>
                Doe John
              </Text>
            </View>
          </View>

          <View className="flex-row items-center" style={{ gap: wp(3) }}>
            <TouchableOpacity
              className="relative items-center justify-center rounded-lg border border-gray-200"
              style={{ width: wp(11), height: wp(11) }}
            >
              <Bell size={rf(20)} color="#0B0C15" strokeWidth={1.5} />
            </TouchableOpacity>
            <TouchableOpacity
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
            </TouchableOpacity>
          </View>
        </View>

        {/* Promotional Banners - Editable */}
        <View className="relative z-10" style={{ marginTop: hp(3) }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: wp(4) }}
            contentContainerStyle={{ gap: wp(4) }}
          >
            {PROMO_BANNERS.map((banner) => (
              <View key={banner.id} className="relative">
                <View
                  className="rounded-3xl overflow-hidden"
                  style={{
                    width: wp(55),
                    height: hp(20),
                    backgroundColor: Colors.primary,
                  }}
                >
                  <Image
                    source={{ uri: banner.imageUrl }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                {/* Delete button */}
                <TouchableOpacity
                  className="absolute rounded-full items-center justify-center"
                  style={{
                    top: -wp(2),
                    right: -wp(2),
                    width: wp(7),
                    height: wp(7),
                    backgroundColor: Colors.primary,
                  }}
                >
                  <X size={rf(14)} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add new banner */}
            <TouchableOpacity
              className="rounded-3xl items-center justify-center"
              style={{
                width: wp(40),
                height: hp(20),
                backgroundColor: '#E5E7EB',
              }}
            >
              <Plus size={rf(32)} color="#6B7280" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Categories - Editable */}
        <View className="relative z-10" style={{ paddingHorizontal: wp(6), marginTop: hp(4) }}>
          <Text style={{ fontSize: rf(18), fontWeight: '500', color: Colors.salon.dark, marginBottom: hp(2) }}>
            Categories
          </Text>

          <View className="flex-row flex-wrap" style={{ gap: wp(3) }}>
            {HOME_CATEGORIES.slice(0, 5).map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleEditCategory(category.id)}
                className="relative rounded-2xl overflow-hidden"
                style={{ width: '30%', aspectRatio: 1 }}
              >
                <Image
                  source={{ uri: category.imageUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <View
                  className="absolute inset-0 items-center justify-center"
                  style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                  <Text
                    className="text-center"
                    style={{ fontSize: rf(12), fontWeight: '600', color: '#fff' }}
                  >
                    {category.name}
                  </Text>
                </View>
                {/* Edit icon */}
                <TouchableOpacity
                  className="absolute rounded-full items-center justify-center bg-white"
                  style={{
                    top: wp(1),
                    right: wp(1),
                    width: wp(6),
                    height: wp(6),
                  }}
                >
                  <Pencil size={rf(12)} color="#000" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {/* Add new category */}
            <TouchableOpacity
              className="rounded-2xl items-center justify-center"
              style={{
                width: '30%',
                aspectRatio: 1,
                backgroundColor: '#E5E7EB',
              }}
            >
              <Plus size={rf(28)} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hair Specialist - Editable */}
        <View className="relative z-10" style={{ marginTop: hp(4) }}>
          <Text
            style={{
              fontSize: rf(18),
              fontWeight: '500',
              color: Colors.salon.dark,
              marginBottom: hp(2),
              paddingHorizontal: wp(6),
            }}
          >
            Hair Specialist
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: wp(6) }}
            contentContainerStyle={{ gap: wp(3) }}
          >
            {SPECIALISTS.map((specialist) => (
              <TouchableOpacity
                key={specialist.id}
                onPress={() => handleEditEmployee(specialist.id)}
                className="relative"
              >
                <View
                  className="rounded-2xl overflow-hidden bg-white"
                  style={{
                    width: wp(40),
                    padding: wp(3),
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <Image
                    source={{ uri: specialist.imageUrl }}
                    className="rounded-xl"
                    style={{ width: '100%', aspectRatio: 1 }}
                    resizeMode="cover"
                  />
                  <Text
                    style={{
                      fontSize: rf(14),
                      fontWeight: '600',
                      color: '#000',
                      marginTop: hp(1),
                    }}
                  >
                    {specialist.name}
                  </Text>
                  <View className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
                    <Text style={{ fontSize: rf(12), color: '#F59E0B' }}>★★</Text>
                    <Text style={{ fontSize: rf(12), color: '#D1D5DB' }}>★</Text>
                  </View>
                  <Text style={{ fontSize: rf(12), color: '#6B7280', marginTop: hp(0.5) }}>
                    {specialist.phone}
                  </Text>
                </View>
                {/* Edit icon */}
                <TouchableOpacity
                  className="absolute rounded-full items-center justify-center bg-white"
                  style={{
                    top: wp(1),
                    right: wp(1),
                    width: wp(6),
                    height: wp(6),
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <Pencil size={rf(12)} color="#000" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: hp(15) }} />
      </ScrollView>

      <AdminBottomNav activeTab="home" />
    </View>
  );
}
