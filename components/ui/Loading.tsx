import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Colors } from '@/constants';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ message, fullScreen = true }: LoadingProps) {
  const content = (
    <>
      <ActivityIndicator size="large" color={Colors.primary} />
      {message && <Text className="text-gray-600 mt-4 text-center">{message}</Text>}
    </>
  );

  if (fullScreen) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        {content}
      </View>
    );
  }

  return <View className="py-8 justify-center items-center">{content}</View>;
}
