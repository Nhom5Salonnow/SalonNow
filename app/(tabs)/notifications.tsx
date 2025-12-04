import { Colors, NOTIFICATIONS, DEFAULT_USER, NotificationItem } from "@/constants";
import { hp, rf, wp } from "@/utils/responsive";
import { NotificationCard } from "@/components/ui";
import { ChevronDown } from "lucide-react-native";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function NotificationsScreen() {
  const handleNotificationPress = (item: NotificationItem) => {
    // Navigate based on notification type
    switch (item.type) {
      case "appointment_confirm":
      case "appointment_update":
        router.push("/my-appointments" as any);
        break;
      case "feedback":
        router.push("/feedback" as any);
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circle */}
      <View
        className="absolute rounded-full"
        style={{
          left: -150,
          top: -100,
          width: 300,
          height: 300,
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: wp(5),
          paddingTop: hp(6),
          paddingBottom: hp(2),
        }}
      >
        <Text
          style={{
            fontSize: rf(24),
            fontWeight: "600",
            color: Colors.salon.dark,
          }}
        >
          Notification
        </Text>

        {/* Profile Avatar */}
        <TouchableOpacity
          onPress={() => router.push("/profile" as any)}
          className="rounded-full overflow-hidden"
          style={{ width: wp(12), height: wp(12) }}
        >
          <Image
            source={{ uri: DEFAULT_USER.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: wp(5),
          paddingVertical: hp(1.5),
        }}
      >
        <Text
          style={{
            fontSize: rf(16),
            fontWeight: "500",
            color: Colors.salon.dark,
          }}
        >
          Latest notification
        </Text>

        <TouchableOpacity className="flex-row items-center">
          <Text
            style={{
              fontSize: rf(14),
              color: Colors.gray[600],
              marginRight: wp(1),
            }}
          >
            Sort By
          </Text>
          <ChevronDown size={16} color={Colors.gray[600]} />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <FlatList
        data={NOTIFICATIONS}
        renderItem={({ item }) => (
          <NotificationCard item={item} onPress={handleNotificationPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: wp(5),
          paddingBottom: hp(10),
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
