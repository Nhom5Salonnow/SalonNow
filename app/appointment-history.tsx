import { Colors, APPOINTMENT_HISTORY, DEFAULT_AVATAR } from "@/constants";
import { DecorativeCircle, AuthGuard } from "@/components";
import { hp, rf, wp } from "@/utils/responsive";
import { AppointmentCard } from "@/components/ui";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts";

function AppointmentHistoryContent() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleReviewPress = (item: typeof APPOINTMENT_HISTORY[0]) => {
    if (item.hasReview) {
      router.push("/review" as any);
    } else {
      router.push("/feedback" as any);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />
      <DecorativeCircle position="bottomRight" size="medium" opacity={0.3} />

      {/* Header */}
      <View
        className="flex-row items-center"
        style={{
          paddingHorizontal: wp(5),
          paddingTop: insets.top + hp(1),
          paddingBottom: hp(2),
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: wp(2) }}
        >
          <ChevronLeft size={rf(28)} color={Colors.salon.dark} />
        </TouchableOpacity>

        <Text
          className="flex-1 text-center"
          style={{
            fontSize: rf(20),
            fontWeight: "600",
            color: Colors.salon.dark,
            marginRight: wp(10), // Balance the back button
          }}
        >
          Appointment History
        </Text>
      </View>

      {/* User Info */}
      <View className="items-center" style={{ paddingBottom: hp(2) }}>
        <View
          className="rounded-full overflow-hidden"
          style={{
            width: wp(20),
            height: wp(20),
            borderWidth: 2,
            borderColor: Colors.salon.pinkLight,
          }}
        >
          <Image
            source={{ uri: user?.avatar || DEFAULT_AVATAR }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          style={{
            fontSize: rf(18),
            fontWeight: "600",
            color: Colors.salon.dark,
            marginTop: hp(1),
          }}
        >
          {user?.name || "User"}
        </Text>
      </View>

      {/* History Title */}
      <View
        style={{
          paddingHorizontal: wp(5),
          paddingTop: hp(1),
          paddingBottom: hp(1),
        }}
      >
        <Text
          style={{
            fontSize: rf(16),
            fontWeight: "500",
            color: Colors.gray[600],
          }}
        >
          Your completed appointments
        </Text>
      </View>

      {/* Appointments List */}
      <FlatList
        data={APPOINTMENT_HISTORY}
        renderItem={({ item }) => (
          <AppointmentCard item={item} onReviewPress={handleReviewPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: wp(5),
          paddingBottom: hp(10),
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center" style={{ paddingTop: hp(10) }}>
            <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>
              No appointment history yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default function AppointmentHistoryScreen() {
  return (
    <AuthGuard message="Please login to view your appointment history">
      <AppointmentHistoryContent />
    </AuthGuard>
  );
}
