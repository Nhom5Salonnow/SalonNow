import React from 'react';
import { View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colors } from '@/constants';

export default function NotificationsScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-8">
      <Bell size={80} color={Colors.gray[300]} strokeWidth={1.5} />
      <Text className="text-gray-400 text-lg text-center mt-6">
        Chưa có thông báo nào
      </Text>
    </View>
  );
}
