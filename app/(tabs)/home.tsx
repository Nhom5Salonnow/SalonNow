import {
  HomeCategoryCard,
  PromoCard,
  SpecialistCard,
} from "@/components/salon";
import { DecorativeCircle } from "@/components";
import { Colors, HOME_CATEGORIES, SPECIALISTS, DEFAULT_AVATAR } from "@/constants";
import { hp, rf, wp } from "@/utils/responsive";
import { router } from "expo-router";
import { Menu, ShoppingCart, User } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts";
import { useState, useEffect } from "react";
import { categoryApi, stylistApi } from "@/api";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

interface Stylist {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  phone: string;
}

const mergeCategories = (apiData: Category[], hardcodedData: Category[]): Category[] => {
  const merged = new Map<string, Category>();

  hardcodedData.forEach(item => merged.set(item.id, item));

  apiData.forEach(item => merged.set(item.id, item));

  return Array.from(merged.values());
};

const mergeSpecialists = (apiData: Stylist[], hardcodedData: Stylist[]): Stylist[] => {
  const merged = new Map<string, Stylist>();

  hardcodedData.forEach(item => merged.set(item.id, item));

  apiData.forEach(item => merged.set(item.id, item));

  return Array.from(merged.values());
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn } = useAuth();

  const [categories, setCategories] = useState<Category[]>(HOME_CATEGORIES);
  const [specialists, setSpecialists] = useState<Stylist[]>(SPECIALISTS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await categoryApi.getCategories();
        if (categoryResponse.success && categoryResponse.data && categoryResponse.data.length > 0) {
          const apiCategories = categoryResponse.data.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
            imageUrl: cat.image || cat.imageUrl || HOME_CATEGORIES[0]?.imageUrl,
          }));
          setCategories(mergeCategories(apiCategories, HOME_CATEGORIES));
        }

        const stylistResponse = await stylistApi.getStylists();
        if (stylistResponse.success && stylistResponse.data && stylistResponse.data.length > 0) {
          const apiSpecialists = stylistResponse.data.map((sty: any) => ({
            id: sty.id || sty._id,
            name: sty.name,
            imageUrl: sty.avatar || sty.imageUrl || SPECIALISTS[0]?.imageUrl,
            rating: sty.rating || 4.5,
            phone: sty.phone || '',
          }));
          setSpecialists(mergeSpecialists(apiSpecialists, SPECIALISTS));
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };

    fetchData();
  }, []);

  const isGuest = !isLoggedIn;
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/service/${categoryId}` as any);
  };

  const handleSpecialistPress = () => {
    router.push("/book-appointment" as any);
  };

  const handleProfilePress = () => {
    router.push("/profile" as any);
  };

  const handlePromoPress = () => {
    router.push("/service/hair-design" as any);
  };

  const handleCartPress = () => {
    router.push("/payment" as any);
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="xlarge" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View
          className="flex-row items-center justify-between relative z-10"
          style={{ paddingHorizontal: wp(6), marginTop: insets.top + hp(1) }}
        >
          <View className="flex-row items-center" style={{ gap: wp(4) }}>
            <TouchableOpacity
              className="p-2"
              onPress={() => router.push("/settings" as any)}
            >
              <Menu size={rf(28)} color={Colors.salon.dark} strokeWidth={2} />
            </TouchableOpacity>

            <View>
              <Text
                style={{ fontSize: rf(22), fontWeight: "400", color: "rgba(0,0,0,0.8)" }}
              >
                {isGuest ? "Welcome" : "Hi"}
              </Text>
              <Text
                style={{ fontSize: rf(26), fontWeight: "400", color: "rgba(0,0,0,0.57)" }}
              >
                {isGuest ? "Guest" : user?.name || "User"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            testID="profile-button"
            onPress={isGuest ? () => router.push("/auth/login") : handleProfilePress}
            className="rounded-full overflow-hidden items-center justify-center"
            style={{
              width: wp(14),
              height: wp(14),
              backgroundColor: isGuest ? Colors.salon.pinkLight : "transparent",
              borderWidth: 3,
              borderColor: Colors.salon.pinkLight,
            }}
          >
            {isGuest ? (
              <User size={rf(24)} color={Colors.primary} />
            ) : (
              <Image
                source={{ uri: user?.avatar || DEFAULT_AVATAR }}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>

        <View className="relative z-10" style={{ marginTop: hp(2) }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled={false}
            snapToInterval={wp(80) + wp(4)}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: wp(6),
            }}
          >
            <TouchableOpacity
              testID="promo-button"
              onPress={handlePromoPress}
              activeOpacity={0.9}
              style={{ marginRight: wp(4) }}
            >
              <PromoCard
                title="Look Awesome &
Save Some"
                subtitle="Get Upto 50% off"
                imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298"
                backgroundColor="#FFB5C2"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePromoPress}
              activeOpacity={0.9}
              style={{ marginRight: wp(4) }}
            >
              <PromoCard
                title=""
                imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=298"
                backgroundColor="#C19A6B"
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View className="relative z-10" style={{ paddingHorizontal: wp(6), marginTop: hp(3) }}>
          <View className="flex-row items-center justify-between" style={{ marginBottom: hp(1.5) }}>
            <Text
              style={{ fontSize: rf(18), fontWeight: "400", color: Colors.salon.dark }}
            >
              Categories
            </Text>
            <TouchableOpacity
              testID="cart-button"
              onPress={handleCartPress}
            >
              <ShoppingCart size={rf(22)} color="#1E1E1E" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap" style={{ gap: wp(3) }}>
            {categories.map((category) => (
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
            {specialists.map((specialist) => (
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

        <View style={{ height: hp(4) }} />
      </ScrollView>
    </View>
  );
}
