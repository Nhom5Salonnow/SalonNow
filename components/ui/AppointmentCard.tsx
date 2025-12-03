import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "@/constants";
import { rf, hp, wp } from "@/utils/responsive";
import { AppointmentItem } from "@/constants/mockData";

interface AppointmentCardProps {
  item: AppointmentItem;
  onReviewPress?: (item: AppointmentItem) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  item,
  onReviewPress,
}) => {
  return (
    <View
      style={{
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[100],
        borderLeftWidth: 4,
        borderLeftColor: Colors.primary,
        paddingLeft: wp(4),
      }}
    >
      <View className="flex-row justify-between items-start">
        {/* Left Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: rf(18),
              fontWeight: "bold",
              color: Colors.salon.dark,
            }}
          >
            {item.service}
          </Text>
          <Text
            style={{
              fontSize: rf(13),
              color: Colors.gray[500],
              marginTop: hp(0.3),
            }}
          >
            Hair stylish : {item.stylist}
          </Text>
          <Text
            style={{
              fontSize: rf(14),
              color: Colors.primary,
              marginTop: hp(1),
            }}
          >
            Price of Service : ${item.price}
          </Text>
        </View>

        {/* Right Content */}
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              fontSize: rf(13),
              color: Colors.gray[400],
            }}
          >
            {item.date}
          </Text>
          <Text
            style={{
              fontSize: rf(13),
              color: Colors.gray[600],
              marginTop: hp(0.3),
            }}
          >
            {item.dayTime}{" "}
            <Text style={{ color: Colors.primary }}>at {item.time}</Text>
          </Text>
          <TouchableOpacity
            style={{ marginTop: hp(1) }}
            onPress={() => onReviewPress?.(item)}
          >
            <Text
              style={{
                fontSize: rf(14),
                color: item.hasReview ? Colors.primary : "#22C55E",
                fontWeight: "500",
              }}
            >
              {item.hasReview ? "View review" : "Review"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
