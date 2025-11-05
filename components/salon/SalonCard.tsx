import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Salon } from '@/types';
import { Card } from '@/components/ui';

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  const handlePress = () => {
    // TODO: Navigate to salon detail when route is created
    // router.push(`/salon/${salon.id}` as any);
    console.log('Navigate to salon:', salon.id);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Card variant="outlined" className="mb-3">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 mb-1">{salon.name}</Text>
            <Text className="text-gray-600 text-sm">{salon.address}</Text>
          </View>
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 font-bold">⭐ {salon.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-2">
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-600 text-xs">{salon.distance.toFixed(1)} km</Text>
          </View>
          <View className="bg-green-50 px-3 py-1 rounded-full ml-2">
            <Text className="text-green-600 text-xs font-medium">Còn chỗ</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
