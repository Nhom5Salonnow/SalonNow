import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants";
import { rf, wp } from "@/utils/responsive";
import { StarRating } from "@/components/ui/StarRating";
import { ServiceItem } from "@/constants/mockData";

interface ServiceMenuItemProps {
  item: ServiceItem;
  isSelected?: boolean;
  onPress?: (item: ServiceItem) => void;
  onReviewPress?: (item: ServiceItem) => void;
}

export const ServiceMenuItem: React.FC<ServiceMenuItemProps> = ({
  item,
  isSelected = false,
  onPress,
  onReviewPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      className="flex-row items-center bg-white rounded-2xl mb-3 p-3"
      style={{
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? Colors.primary : "#E5E7EB",
      }}
    >
      <Image
        source={{ uri: item.image }}
        className="rounded-xl"
        style={{ width: wp(18), height: wp(18) }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-3">
        <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
          {item.name}
        </Text>
        <View className="flex-row items-center mt-1">
          <StarRating rating={item.rating} size={14} maxStars={3} />
          <Text style={{ fontSize: rf(14), color: "#6B7280", marginLeft: 12 }}>
            €{item.price}
          </Text>
        </View>
      </View>
      <View className="items-end">
        <Text style={{ fontSize: rf(12), color: "#9CA3AF" }}>per 1</Text>
        <TouchableOpacity onPress={() => onReviewPress?.(item)}>
          <Text style={{ fontSize: rf(12), color: Colors.primary, marginTop: 4 }}>
            review
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
