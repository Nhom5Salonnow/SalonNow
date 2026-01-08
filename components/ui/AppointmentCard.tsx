import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Colors } from "@/constants";
import { rf, hp, wp } from "@/utils/responsive";
import { AppointmentItem } from "@/constants/mockData";
import { Calendar, Clock, User, Star } from "lucide-react-native";

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
        backgroundColor: '#fff',
        borderRadius: wp(4),
        marginBottom: hp(1.5),
        padding: wp(4),
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
        ...Platform.select({
          android: {
            elevation: 3,
          },
        }),
      }}
    >
      {/* Service Name & Price */}
      <View className="flex-row justify-between items-start">
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: rf(17),
              fontWeight: "600",
              color: Colors.salon.dark,
            }}
          >
            {item.service}
          </Text>
          <View className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
            <User size={rf(14)} color={Colors.gray[400]} />
            <Text
              style={{
                fontSize: rf(13),
                color: Colors.gray[500],
                marginLeft: wp(1.5),
              }}
            >
              {item.stylist}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: rf(18),
            fontWeight: "700",
            color: Colors.primary,
          }}
        >
          ${item.price}
        </Text>
      </View>

      {/* Date & Time Row */}
      <View
        className="flex-row items-center justify-between"
        style={{
          marginTop: hp(1.5),
          paddingTop: hp(1.5),
          borderTopWidth: 1,
          borderTopColor: Colors.gray[100],
        }}
      >
        <View className="flex-row items-center">
          <View className="flex-row items-center" style={{ marginRight: wp(4) }}>
            <Calendar size={rf(14)} color={Colors.gray[400]} />
            <Text
              style={{
                fontSize: rf(13),
                color: Colors.gray[600],
                marginLeft: wp(1.5),
              }}
            >
              {item.date}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={rf(14)} color={Colors.gray[400]} />
            <Text
              style={{
                fontSize: rf(13),
                color: Colors.gray[600],
                marginLeft: wp(1.5),
              }}
            >
              {item.time}
            </Text>
          </View>
        </View>

        {/* Review Button */}
        <TouchableOpacity
          onPress={() => onReviewPress?.(item)}
          className="flex-row items-center rounded-full"
          style={{
            backgroundColor: item.hasReview ? Colors.salon.pinkLight : '#ECFDF5',
            paddingHorizontal: wp(3),
            paddingVertical: hp(0.6),
          }}
        >
          <Star
            size={rf(12)}
            color={item.hasReview ? Colors.primary : "#22C55E"}
            fill={item.hasReview ? Colors.primary : "transparent"}
          />
          <Text
            style={{
              fontSize: rf(12),
              color: item.hasReview ? Colors.primary : "#22C55E",
              fontWeight: "600",
              marginLeft: wp(1),
            }}
          >
            {item.hasReview ? "View Review" : "Add Review"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
