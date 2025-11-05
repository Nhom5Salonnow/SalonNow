import React from 'react';
import { View, Text } from 'react-native';
import { User } from 'lucide-react-native';
import { Colors } from '@/constants';

export default function ProfileScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-8">
      <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-6">
        <User size={48} color={Colors.gray[400]} strokeWidth={1.5} />
      </View>
      <Text className="text-gray-400 text-lg text-center">
        Tính năng profile đang được phát triển
      </Text>
    </View>
  );
}
