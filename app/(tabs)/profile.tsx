import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { STORAGE_KEYS, getData, removeData } from "@/utils/asyncStorage";
import { hp, rf, wp } from "@/utils/responsive";
import { router } from "expo-router";
import {
  Calendar,
  ChevronRight,
  CreditCard,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserData {
  name: string;
  email: string;
  phone: string;
}

const menuItems = [
  {
    id: "account",
    title: "Account Info",
    icon: User,
    route: "/settings",
  },
  {
    id: "appointments",
    title: "My Appointments",
    icon: Calendar,
    route: "/my-appointments",
  },
  {
    id: "payment",
    title: "Payment",
    icon: CreditCard,
    route: "/payment",
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    route: "/settings",
  },
];

export default function ProfileScreen() {
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

  const handleLogout = async () => {
    await removeData(STORAGE_KEYS.AUTH_TOKEN);
    await removeData(STORAGE_KEYS.USER_DATA);
    router.replace("/auth/login");
  };

  const handleMenuPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="xlarge" opacity={0.4} />
      <DecorativeCircle position="bottomRight" size="large" opacity={0.3} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Menu */}
        <View
          style={{
            paddingHorizontal: wp(5),
            paddingTop: hp(6),
          }}
        >
          <TouchableOpacity className="p-2" style={{ alignSelf: "flex-start" }}>
            <Menu size={28} color={Colors.salon.dark} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View
          className="items-center"
          style={{
            paddingTop: hp(2),
            paddingBottom: hp(4),
          }}
        >
          {/* Profile Image */}
          <View
            className="rounded-full overflow-hidden"
            style={{
              width: wp(40),
              height: wp(40),
              borderWidth: 4,
              borderColor: Colors.salon.pinkLight,
            }}
          >
            <Image
              source={{
                uri: "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=400",
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          {/* User Name */}
          <Text
            style={{
              fontSize: rf(24),
              fontWeight: "bold",
              color: Colors.salon.dark,
              marginTop: hp(2),
            }}
          >
            {userData?.name || "Doe John"}
          </Text>

          {/* User Email */}
          <Text
            style={{
              fontSize: rf(14),
              color: Colors.gray[500],
              marginTop: hp(0.5),
            }}
          >
            {userData?.email || "doejohn@example.com"}
          </Text>
        </View>

        {/* Menu Items */}
        <View
          style={{
            paddingHorizontal: wp(5),
            paddingTop: hp(2),
          }}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuPress(item.route)}
              className="flex-row items-center justify-between bg-white rounded-xl"
              style={{
                paddingVertical: hp(2),
                paddingHorizontal: wp(4),
                marginBottom: hp(1.5),
                borderWidth: 1,
                borderColor: Colors.salon.pinkLight,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="rounded-full items-center justify-center"
                  style={{
                    width: wp(10),
                    height: wp(10),
                    backgroundColor: Colors.salon.pinkBg,
                    marginRight: wp(3),
                  }}
                >
                  <item.icon size={20} color={Colors.primary} />
                </View>
                <Text
                  style={{
                    fontSize: rf(16),
                    color: Colors.salon.dark,
                    fontWeight: "500",
                  }}
                >
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.gray[400]} />
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center justify-center rounded-xl"
            style={{
              paddingVertical: hp(2),
              marginTop: hp(2),
              backgroundColor: Colors.salon.pinkBg,
            }}
          >
            <LogOut size={20} color={Colors.primary} />
            <Text
              style={{
                fontSize: rf(16),
                color: Colors.primary,
                fontWeight: "600",
                marginLeft: wp(2),
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}
