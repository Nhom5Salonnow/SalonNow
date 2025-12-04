import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Scissors, Sparkles, User, Heart } from 'lucide-react-native';
import { ServiceCategory } from '@/types';

interface CategoryCardProps {
  category: ServiceCategory;
  onPress?: () => void;
}

const iconMap: Record<string, any> = {
  scissors: Scissors,
  sparkles: Sparkles,
  user: User,
  heart: Heart,
};

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  const IconComponent = iconMap[category.icon] || Scissors;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-50 rounded-2xl p-4 mb-4 items-center"
      style={{ width: '47%' }}
    >
      <View className="bg-white rounded-full p-4 mb-3 shadow-sm">
        <IconComponent size={32} color={category.color} strokeWidth={1.5} />
      </View>
      <Text className="text-gray-800 font-semibold text-center">{category.name}</Text>
    </TouchableOpacity>
  );
}
