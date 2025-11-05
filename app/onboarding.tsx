import { PaginationDots } from "@/components/ui";
import { ONBOARDING_SLIDES } from "@/constants";
import { STORAGE_KEYS, storeData } from "@/utils/asyncStorage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

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
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({
        offset: SCREEN_WIDTH * nextIndex,
        animated: true,
      });
    } else {
      handleDone();
    }
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
        className="bg-white items-center justify-between py-8 px-6"
        style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      >
        {/* Status Bar */}
        {/* <StatusBar /> */}

        {/* Logo */}
        <Text
          className="text-[40px] text-black mt-8"
          style={{ fontWeight: "400" }}
        >
          Salon Now
        </Text>

        {/* Illustration */}
        <View className="flex-1 items-center justify-center w-full max-w-md">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full h-full max-w-[426px]"
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View className="items-center gap-2 px-4 max-w-md">
          <Text className="text-[28px] font-bold text-center leading-[42px] text-salon-dark">
            {item.title}
          </Text>
          <Text className="text-[17px] text-center leading-[25px] text-salon-gray-light max-w-[280px]">
            {item.subtitle}
          </Text>
        </View>

        {/* Pagination Dots */}
        <PaginationDots
          length={ONBOARDING_SLIDES.length}
          currentIndex={currentIndex}
        />

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="h-[58px] px-12 justify-center items-center rounded-xl bg-salon-primary"
        >
          <Text className="text-white text-[21px] font-bold tracking-wider capitalize">
            {currentIndex === ONBOARDING_SLIDES.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Skip Button */}
        {currentIndex < ONBOARDING_SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleSkip} className="mt-2">
            <Text className="text-salon-gray-light text-[13px] leading-9">
              Skip!
            </Text>
          </TouchableOpacity>
        )}
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
  );
}
