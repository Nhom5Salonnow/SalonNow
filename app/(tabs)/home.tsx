import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search, User } from 'lucide-react-native';
import { useSalons } from '@/hooks';
import { SalonCard, CategoryCard } from '@/components/salon';
import { SERVICE_CATEGORIES } from '@/constants';
import { Loading } from '@/components/ui';

export default function HomeScreen() {
  const { salons, isLoading, searchSalons } = useSalons();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      searchSalons(query);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-6 px-6 rounded-b-3xl">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-lg">Xin chào!</Text>
            <Text className="text-white text-2xl font-bold">Tìm salon của bạn</Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-3 rounded-full">
            <User size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-2xl flex-row items-center px-4 py-3">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm salon, dịch vụ..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Categories */}
      <View className="px-6 py-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Dịch Vụ</Text>
        <View className="flex-row flex-wrap justify-between">
          {SERVICE_CATEGORIES.slice(0, 4).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </View>
      </View>

      {/* Popular Salons */}
      <View className="px-6 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Salon Phổ Biến</Text>
          <TouchableOpacity>
            <Text className="text-blue-500 font-medium">Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Loading fullScreen={false} message="Đang tải salon..." />
        ) : (
          salons.map((salon) => <SalonCard key={salon.id} salon={salon} />)
        )}
      </View>
    </ScrollView>
  );
}
