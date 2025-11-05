import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Salon } from '@/types';
import { SalonCard } from './SalonCard';
import { Loading } from '@/components/ui';

interface SalonListProps {
  salons: Salon[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function SalonList({ salons, isLoading, emptyMessage = 'Không tìm thấy salon nào' }: SalonListProps) {
  if (isLoading) {
    return <Loading fullScreen={false} />;
  }

  if (salons.length === 0) {
    return (
      <View className="py-12 items-center">
        <Text className="text-gray-500 text-center">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={salons}
      renderItem={({ item }) => <SalonCard salon={item} />}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}
