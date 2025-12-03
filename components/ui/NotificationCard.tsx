import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar, Star, MessageSquare } from "lucide-react-native";
import { Colors } from "@/constants";
import { rf, hp, wp } from "@/utils/responsive";
import { NotificationItem } from "@/constants/mockData";

interface NotificationCardProps {
  item: NotificationItem;
  onPress?: (item: NotificationItem) => void;
}

const NotificationIcon = ({ type }: { type: string }) => {
  const iconColor = Colors.gray[600];
  const size = 20;

  switch (type) {
    case "appointment_confirm":
    case "appointment_update":
      return <Calendar size={size} color={iconColor} />;
    case "feedback":
      return <Star size={size} color={iconColor} />;
    default:
      return <MessageSquare size={size} color={iconColor} />;
  }
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}
      className="flex-row"
      style={{
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[100],
      }}
    >
      {/* Unread dot */}
      <View style={{ width: wp(4), paddingTop: hp(0.5) }}>
        {!item.read && (
          <View
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: Colors.primary,
            }}
          />
        )}
      </View>

      {/* Icon */}
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: wp(12),
          height: wp(12),
          backgroundColor: Colors.gray[100],
          marginRight: wp(3),
        }}
      >
        <NotificationIcon type={item.type} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: rf(15),
            fontWeight: "600",
            color: Colors.salon.dark,
            marginBottom: hp(0.5),
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: rf(13),
            color: Colors.gray[600],
            lineHeight: rf(20),
          }}
        >
          {item.description}
        </Text>
        <Text
          style={{
            fontSize: rf(12),
            color: Colors.primary,
            marginTop: hp(0.5),
          }}
        >
          {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
