import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MoreVertical } from "lucide-react-native";
import { rf, hp, wp } from "@/utils/responsive";
import { StarRating } from "./StarRating";
import { ReviewItem } from "@/constants/mockData";

interface ReviewCardProps {
  item: ReviewItem;
  onOptionsPress?: (item: ReviewItem) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  item,
  onOptionsPress,
}) => {
  return (
    <View
      className="py-4"
      style={{ borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.userImage }}
            className="rounded-full"
            style={{ width: wp(12), height: wp(12) }}
          />
          <View className="ml-3">
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
              {item.userName}
            </Text>
            <View className="flex-row items-center mt-1">
              <StarRating rating={item.rating} size={14} />
              <Text
                style={{ fontSize: rf(12), color: "#9CA3AF", marginLeft: 8 }}
              >
                {item.timeAgo}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => onOptionsPress?.(item)}>
          <MoreVertical size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <Text
        style={{ fontSize: rf(14), color: "#374151", marginTop: hp(1.5) }}
      >
        {item.comment}
      </Text>
    </View>
  );
};
