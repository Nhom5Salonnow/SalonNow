import { Colors, APPOINTMENT_HISTORY, DEFAULT_USER } from "@/constants";
import { STORAGE_KEYS, getData } from "@/utils/asyncStorage";
import { hp, rf, wp } from "@/utils/responsive";
import { AppointmentCard } from "@/components/ui";
import { router } from "expo-router";
import { Menu } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

interface UserData {
  name: string;
  email: string;
  phone: string;
}

export default function BookingsScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getData(STORAGE_KEYS.USER_DATA);
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleReviewPress = (item: typeof APPOINTMENT_HISTORY[0]) => {
    if (item.hasReview) {
      router.push("/review" as any);
    } else {
      router.push("/feedback" as any);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circles */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(25),
          top: -hp(6),
          width: wp(75),
          height: wp(75),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.4,
        }}
      />
      <View
        className="absolute rounded-full"
        style={{
          right: -wp(20),
          bottom: hp(6),
          width: wp(50),
          height: wp(50),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.3,
        }}
      />

      {/* Header with Menu */}
      <View style={{ paddingHorizontal: wp(5), paddingTop: hp(6) }}>
        <TouchableOpacity className="p-2" style={{ alignSelf: "flex-start" }}>
          <Menu size={28} color={Colors.salon.dark} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View className="items-center" style={{ paddingBottom: hp(3) }}>
        <View
          className="rounded-full overflow-hidden"
          style={{
            width: wp(30),
            height: wp(30),
            borderWidth: wp(0.8),
            borderColor: Colors.salon.pinkLight,
          }}
        >
          <Image
            source={{ uri: DEFAULT_USER.avatar }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text
          style={{
            fontSize: rf(22),
            fontWeight: "bold",
            color: Colors.salon.dark,
            marginTop: hp(1.5),
          }}
        >
          {userData?.name || DEFAULT_USER.name}
        </Text>
      </View>

      {/* Appointment History Title */}
      <View
        style={{
          paddingHorizontal: wp(5),
          paddingTop: hp(2),
          paddingBottom: hp(1),
        }}
      >
        <Text
          style={{
            fontSize: rf(20),
            fontWeight: "500",
            color: Colors.salon.dark,
          }}
        >
          Appointment History
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
      />
    </View>
  );
}
