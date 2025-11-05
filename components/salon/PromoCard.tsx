import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface PromoCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  backgroundColor: string;
  onPress?: () => void;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  title,
  subtitle,
  imageUrl,
  backgroundColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-shrink-0 w-[345px] h-[134px] rounded-[20px] shadow-lg overflow-hidden"
      style={{ backgroundColor }}
    >
      <View className="flex-1 flex-row items-center justify-between px-4">
        <View className="flex-1 gap-3">
          <Text
            className="text-[20px] text-black/54 leading-tight"
            style={{ fontWeight: "400" }}
          >
            {title}
          </Text>
          {subtitle && (
            <View className="self-start h-8 px-4 items-center justify-center rounded-[20px] bg-white/60">
              <Text className="text-[13px] text-black">{subtitle}</Text>
            </View>
          )}
        </View>
        <Image
          source={{ uri: imageUrl }}
          className="w-[149px] h-[132px]"
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );
};
