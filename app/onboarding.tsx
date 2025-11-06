import { PaginationDots } from "@/components/ui";
import { ONBOARDING_SLIDES } from "@/constants";
import { STORAGE_KEYS, storeData } from "@/utils/asyncStorage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
        className="items-center justify-center px-6"
        style={{ width: SCREEN_WIDTH }}
      >
        {/* Illustration */}
        <View className="w-full max-w-md mb-8">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full aspect-square"
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View className="items-center gap-2 px-4 max-w-md">
          <Text className="text-3xl font-bold text-center leading-[42px] text-salon-dark">
            {item.title}
          </Text>
          <Text className="text-lg text-center leading-[25px] text-salon-gray-light max-w-[280px]">
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
    <View className="flex-1 bg-white">
      {/* Fixed Header - Logo */}
      <View className="pt-20 pb-8 items-center">
        <Text className="text-5xl text-black font-semibold">
          Salon Now
        </Text>
      </View>

      {/* Scrollable Content Area */}
      <View className="flex-1 justify-center">
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
      <View className="pb-8 px-6 gap-4 items-center">
        {/* Pagination Dots - Clickable */}
        <PaginationDots
          length={ONBOARDING_SLIDES.length}
          currentIndex={currentIndex}
          onDotPress={scrollToIndex}
        />

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="py-4 px-12 justify-center items-center rounded-xl bg-salon-primary w-full max-w-md"
        >
          <Text className="text-white text-2xl font-bold tracking-wider capitalize">
            {currentIndex === ONBOARDING_SLIDES.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Skip Button - Always takes space */}
        <View className="h-10 justify-center">
          {currentIndex < ONBOARDING_SLIDES.length - 1 ? (
            <TouchableOpacity onPress={handleSkip}>
              <Text className="text-salon-gray-light text-lg">
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
