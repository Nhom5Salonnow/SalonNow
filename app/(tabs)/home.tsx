import {
  HomeCategoryCard,
  PromoCard,
  SpecialistCard,
} from "@/components/salon";
import { DecorativeCircle } from "@/components";
import { Colors, HOME_CATEGORIES, SPECIALISTS } from "@/constants";
import { hp, rf, wp } from "@/utils/responsive";
import { router } from "expo-router";
import { Bell, Menu, ShoppingCart } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
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
                Hi
              </Text>
              <Text
                style={{ fontSize: rf(26), fontWeight: "400", color: "rgba(0,0,0,0.57)" }}
              >
                Doe John
              </Text>
            </View>
          </View>

          <View className="flex-row items-center" style={{ gap: wp(3) }}>
            {/* Notification */}
            <TouchableOpacity
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

            {/* Profile */}
            <TouchableOpacity
              onPress={handleProfilePress}
              className="rounded-full overflow-hidden"
              style={{ width: wp(14), height: wp(14) }}
            >
              <Image
                source={{
                  uri: "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
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
            <TouchableOpacity onPress={handlePromoPress} activeOpacity={0.9}>
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
