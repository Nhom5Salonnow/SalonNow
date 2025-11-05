import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { Colors } from '@/constants';

export default function BookingsScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-8">
      <Calendar size={80} color={Colors.gray[300]} strokeWidth={1.5} />
      <Text className="text-gray-400 text-lg text-center mt-6">
        Tính năng đặt lịch đang được phát triển
      </Text>
    </View>
  );
}
