import {
  HomeCategoryCard,
  PromoCard,
  SpecialistCard,
} from "@/components/salon";
import { DecorativeCircle } from "@/components";
import { Colors, HOME_CATEGORIES, SPECIALISTS, GUEST_USER } from "@/constants";
import { hp, rf, wp } from "@/utils/responsive";
import { STORAGE_KEYS, getData } from "@/utils/asyncStorage";
import { router } from "expo-router";
import { Bell, Menu, ShoppingCart, User } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { User as UserType } from "@/types";

export default function HomeScreen() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const userData = await getData(STORAGE_KEYS.USER_DATA);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isGuest = !user;
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/service/${categoryId}` as any);
  };

  const handleSpecialistPress = () => {
    router.push("/appointment" as any);
  };

  const handleNotificationPress = () => {
    router.push("/notifications" as any);
  };

  const handleProfilePress = () => {
    router.push("/profile" as any);
  };

  const handlePromoPress = () => {
    // Navigate to promotions or specific service
    router.push("/service/hair-design" as any);
  };

  const handleCartPress = () => {
    router.push("/payment" as any);
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="xlarge" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between relative z-10"
          style={{ paddingHorizontal: wp(6), marginTop: hp(2) }}
        >
          <View className="flex-row items-center" style={{ gap: wp(4) }}>
            {/* Menu Icon */}
            <TouchableOpacity className="p-2">
              <Menu size={rf(28)} color={Colors.salon.dark} strokeWidth={2} />
            </TouchableOpacity>

            {/* Greeting */}
            <View>
              <Text
                style={{ fontSize: rf(22), fontWeight: "400", color: "rgba(0,0,0,0.8)" }}
              >
                {isGuest ? "Welcome" : "Hi"}
              </Text>
              <Text
                style={{ fontSize: rf(26), fontWeight: "400", color: "rgba(0,0,0,0.57)" }}
              >
                {isGuest ? GUEST_USER.name : user?.name || "User"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center" style={{ gap: wp(3) }}>
            {/* Notification - only show for logged in users */}
            {!isGuest && (
              <TouchableOpacity
                testID="notification-button"
                onPress={handleNotificationPress}
                className="relative items-center justify-center rounded-lg border border-gray-200"
                style={{ width: wp(11), height: wp(11) }}
              >
                <Bell size={rf(20)} color="#0B0C15" strokeWidth={1.5} />
                <View
                  className="absolute rounded-full"
                  style={{
                    top: wp(2),
                    right: wp(2),
                    width: wp(2),
                    height: wp(2),
                    backgroundColor: Colors.primary,
                  }}
                />
              </TouchableOpacity>
            )}

            {/* Profile / Login Button */}
            <TouchableOpacity
              testID="profile-button"
              onPress={isGuest ? () => router.push("/auth/login") : handleProfilePress}
              className="rounded-full overflow-hidden items-center justify-center"
              style={{
                width: wp(14),
                height: wp(14),
                backgroundColor: isGuest ? Colors.salon.pinkLight : "transparent",
              }}
            >
              {isGuest ? (
                <User size={rf(24)} color={Colors.primary} />
              ) : (
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Promotional Banners */}
        <View className="relative z-10" style={{ marginTop: hp(2) }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: wp(2) }}
            contentContainerStyle={{ gap: wp(4) }}
          >
            <TouchableOpacity testID="promo-button" onPress={handlePromoPress} activeOpacity={0.9}>
              <PromoCard
                title="Look Awesome &
Save Some"
                subtitle="Get Upto 50% off"
                imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298"
                backgroundColor="#FFB5C2"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePromoPress} activeOpacity={0.9}>
              <PromoCard
                title=""
                imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=298"
                backgroundColor="#C19A6B"
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Shopping Cart */}
        <TouchableOpacity
          testID="cart-button"
          onPress={handleCartPress}
          className="absolute z-30"
          style={{ top: hp(35), right: wp(9) }}
        >
          <ShoppingCart size={rf(22)} color="#1E1E1E" strokeWidth={2} />
        </TouchableOpacity>

        {/* Categories */}
        <View className="relative z-10" style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
          <Text
            style={{ fontSize: rf(18), fontWeight: "400", color: Colors.salon.dark, marginBottom: hp(1.5) }}
          >
            Categories
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: wp(3) }}>
            {HOME_CATEGORIES.map((category) => (
              <View key={category.id} className="w-[30%]">
                <HomeCategoryCard
                  name={category.name}
                  imageUrl={category.imageUrl}
                  onPress={() => handleCategoryPress(category.id)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Hair Specialist */}
        <View className="relative z-10" style={{ marginTop: hp(5) }}>
          <Text
            style={{
              fontSize: rf(18),
              fontWeight: "400",
              color: Colors.salon.dark,
              marginBottom: hp(1.5),
              paddingHorizontal: wp(6),
            }}
          >
            Hair Specialist
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: wp(6) }}
            contentContainerStyle={{ gap: wp(3) }}
          >
            {SPECIALISTS.map((specialist) => (
              <SpecialistCard
                key={specialist.id}
                name={specialist.name}
                imageUrl={specialist.imageUrl}
                rating={specialist.rating}
                phone={specialist.phone}
                onPress={handleSpecialistPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for navigation */}
        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
}
