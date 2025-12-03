import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { router } from "expo-router";
import { Menu, ChevronLeft, Star } from "lucide-react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors, REVIEWS, RATING_DISTRIBUTION } from "@/constants";
import { ReviewCard, StarRating } from "@/components/ui";

export default function ReviewScreen() {
  const averageRating = 4.0;
  const totalReviews = 52;

  return (
    <View className="flex-1 bg-white">
      {/* Pink decorative background */}
      <View
        className="absolute rounded-full"
        style={{
          right: -wp(20),
          bottom: hp(10),
          width: wp(60),
          height: wp(60),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.3,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: hp(6) }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Menu size={28} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(20), fontWeight: "500", color: "#000" }}>
            Review
          </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Rating Summary Card */}
        <View
          className="mx-6 mt-6 rounded-2xl bg-white p-5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row">
            {/* Rating bars */}
            <View className="flex-1">
              {RATING_DISTRIBUTION.map((item) => (
                <View key={item.stars} className="flex-row items-center mb-2">
                  <Text style={{ fontSize: rf(12), color: "#000", width: wp(4) }}>
                    {item.stars}
                  </Text>
                  <Star size={12} color="#F59E0B" fill="#F59E0B" />
                  <View
                    className="flex-1 h-2 rounded-full ml-2"
                    style={{ backgroundColor: "#E5E7EB" }}
                  >
                    <View
                      className="h-2 rounded-full"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: Colors.primary,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Average rating */}
            <View className="items-center justify-center ml-6">
              <Text style={{ fontSize: rf(40), fontWeight: "700", color: "#000" }}>
                {averageRating.toFixed(1)}
              </Text>
              <StarRating rating={Math.round(averageRating)} size={16} />
              <Text style={{ fontSize: rf(12), color: "#6B7280", marginTop: hp(0.5) }}>
                {totalReviews} Reviews
              </Text>
            </View>
          </View>
        </View>

        {/* Reviews List */}
        <View className="px-6 mt-4">
          <FlatList
            data={REVIEWS}
            renderItem={({ item }) => <ReviewCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}
