import { PaginationDots } from "@/components/ui";
import { ONBOARDING_SLIDES } from "@/constants";
import { STORAGE_KEYS, storeData } from "@/utils/asyncStorage";
import { hp, rf, SCREEN_WIDTH, wp } from "@/utils/responsive";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleDone = async () => {
    await storeData(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, "true");
    router.replace("/home" as any);
  };

  const handleSkip = async () => {
    await storeData(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, "true");
    router.replace("/home" as any);
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      handleDone();
    }
  };

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: SCREEN_WIDTH * index,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderSlide = ({ item }: { item: (typeof ONBOARDING_SLIDES)[0] }) => {
    return (
      <View
        className="items-center justify-center"
        style={{ width: SCREEN_WIDTH, paddingHorizontal: wp(5) }}
      >
        {/* Illustration */}
        <View style={{ width: wp(85) }}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", aspectRatio: 1 }}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View
          className="items-center"
          style={{ gap: hp(1), paddingHorizontal: wp(5) }}
        >
          <Text
            className="font-bold text-center text-salon-dark"
            style={{
              fontSize: rf(26),
              lineHeight: rf(38),
            }}
          >
            {item.title}
          </Text>
          <Text
            className="text-center text-salon-gray-light"
            style={{
              fontSize: rf(15),
              lineHeight: rf(22),
              maxWidth: wp(75),
            }}
          >
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };

  const getItemLayout = (_data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <View className="flex-1 bg-white" style={{ paddingVertical: hp(3) }}>
      {/* Fixed Header - Logo */}
      <View
        className="items-center"
        style={{ paddingVertical: hp(4) }}
      >
        <Text
          className="text-black font-semibold"
          style={{ fontSize: rf(38) }}
        >
          Salon Now
        </Text>
      </View>

      {/* Scrollable Content Area - Uses flex for adaptive height */}
      <View style={{ flex: 1, justifyContent: "center" }}>
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={getItemLayout}
          scrollEnabled={true}
        />
      </View>

      {/* Fixed Footer */}
      <View
        className="items-center"
        style={{ gap: hp(2), paddingHorizontal: wp(5) }}
      >
        {/* Pagination Dots - Clickable */}
        <PaginationDots
          length={ONBOARDING_SLIDES.length}
          currentIndex={currentIndex}
          onDotPress={scrollToIndex}
        />

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="justify-center items-center rounded-xl bg-salon-primary"
          style={{
            width: wp(90),
            paddingVertical: hp(2),
          }}
        >
          <Text
            className="text-white font-bold tracking-wider capitalize"
            style={{ fontSize: rf(18) }}
          >
            {currentIndex === ONBOARDING_SLIDES.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Skip Button - Always takes space */}
        <View style={{ height: hp(4) }} className="justify-center">
          {currentIndex < ONBOARDING_SLIDES.length - 1 ? (
            <TouchableOpacity onPress={handleSkip}>
              <Text
                className="text-salon-gray-light"
                style={{ fontSize: rf(15) }}
              >
                Skip!
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
}
