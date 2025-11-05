import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface HomeCategoryCardProps {
  name: string;
  imageUrl: string;
  onPress?: () => void;
}

export const HomeCategoryCard: React.FC<HomeCategoryCardProps> = ({
  name,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="relative h-[90px] rounded-md overflow-hidden"
    >
      <Image
        source={{ uri: imageUrl }}
        className="absolute inset-0 w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-white/45 rounded-md" />
      <View className="flex-1 items-center justify-center px-2">
        <Text
          className="text-[20px] text-black text-center leading-tight"
          style={{ fontWeight: "400" }}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
