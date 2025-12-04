import {
  HomeCategoryCard,
  PromoCard,
  SpecialistCard,
} from "@/components/salon";
import { HOME_CATEGORIES } from "@/constants";
import { Bell, Menu, ShoppingCart } from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// Mock data for specialists
const specialists = [
  {
    id: "1",
    name: "Doe John",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240",
    rating: 2,
    phone: "+732 8888 111",
  },
  {
    id: "2",
    name: "Lucy",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
    rating: 2,
    phone: "+732 8888 111",
  },
  {
    id: "3",
    name: "Laila",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240",
    rating: 0,
    phone: "+732 8888 111",
  },
];

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circle */}
      <View
        className="absolute rounded-full bg-salon-pink-light"
        style={{
          left: -197,
          top: -223,
          width: 440,
          height: 438,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Status Bar */}
        {/* <StatusBar time="12:24" /> */}

        {/* Header */}
        <View className="px-6 mt-4 flex-row items-center justify-between relative z-10">
          <View className="flex-row items-center gap-4">
            {/* Menu Icon */}
            <TouchableOpacity className="p-2">
              <Menu size={32} color="#2A2E3B" strokeWidth={2} />
            </TouchableOpacity>

            {/* Greeting */}
            <View>
              <Text
                className="text-[25px] text-black/80"
                style={{ fontWeight: "400" }}
              >
                Hi
              </Text>
              <Text
                className="text-[30px] text-black/57"
                style={{ fontWeight: "400" }}
              >
                Doe John
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            {/* Notification */}
            <TouchableOpacity className="relative w-11 h-11 items-center justify-center rounded-lg border border-gray-200">
              <Bell size={24} color="#0B0C15" strokeWidth={1.5} />
              <View className="absolute top-2 right-2 w-2 h-2 bg-salon-primary rounded-full" />
            </TouchableOpacity>

            {/* Profile */}
            <View className="w-14 h-14 rounded-full overflow-hidden">
              <Image
                source={{
                  uri: "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Promotional Banners */}
        <View className="mt-4 relative z-10">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-2"
            contentContainerStyle={{ gap: 16 }}
          >
            <PromoCard
              title="Look Awesome &
Save Some"
              subtitle="Get Upto 50% off"
              imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ecb938fe586592c9eaf8a05b9a2510da712412e7?width=298"
              backgroundColor="#FFB5C2"
            />
            <PromoCard
              title=""
              imageUrl="https://api.builder.io/api/v1/image/assets/TEMP/ad33659c33381eac40061641b81f19d65a13ad9f?width=298"
              backgroundColor="#C19A6B"
            />
          </ScrollView>
        </View>

        {/* Shopping Cart */}
        <TouchableOpacity
          className="absolute right-9 z-30"
          style={{ top: 280 }}
        >
          <ShoppingCart size={25} color="#1E1E1E" strokeWidth={2} />
        </TouchableOpacity>

        {/* Categories */}
        <View className="px-6 mt-6 relative z-10">
          <Text
            className="text-[20px] text-salon-dark mb-3"
            style={{ fontWeight: "400" }}
          >
            Categories
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {HOME_CATEGORIES.map((category) => (
              <View key={category.id} className="w-[30%]">
                <HomeCategoryCard
                  name={category.name}
                  imageUrl={category.imageUrl}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Hair Specialist */}
        <View className="mt-10 relative z-10">
          <Text
            className="text-[20px] text-salon-dark mb-3 px-6"
            style={{ fontWeight: "400" }}
          >
            Hair Specialist
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
            contentContainerStyle={{ gap: 12 }}
          >
            {specialists.map((specialist) => (
              <SpecialistCard
                key={specialist.id}
                name={specialist.name}
                imageUrl={specialist.imageUrl}
                rating={specialist.rating}
                phone={specialist.phone}
              />
            ))}
          </ScrollView>
        </View>

        {/* Bottom spacing for navigation */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
