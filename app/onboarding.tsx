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

// Responsive helpers
const isSmallDevice = SCREEN_WIDTH <= 375; // iPhone SE, iPhone 8
const isMediumDevice = SCREEN_WIDTH > 375 && SCREEN_WIDTH < 414; // iPhone 12/13, Galaxy S8

// Responsive values
const RESPONSIVE = {
  headerPaddingVertical: isSmallDevice ? 0 : isMediumDevice ? 32 : 48,
  logoFontSize: isSmallDevice ? 30 : isMediumDevice ? 36 : 48,

  contentGap: isSmallDevice ? 6 : 8,

  titleFontSize: isSmallDevice ? 22 : isMediumDevice ? 26 : 28,
  titleLineHeight: isSmallDevice ? 30 : isMediumDevice ? 36 : 42,
  subtitleFontSize: isSmallDevice ? 14 : isMediumDevice ? 16 : 17,
  subtitleLineHeight: isSmallDevice ? 20 : isMediumDevice ? 23 : 25,

  buttonPaddingY: isSmallDevice ? 12 : isMediumDevice ? 14 : 16,
  buttonPaddingX: isSmallDevice ? 32 : isMediumDevice ? 40 : 48,
  buttonFontSize: isSmallDevice ? 18 : isMediumDevice ? 20 : 21,

  skipFontSize: isSmallDevice ? 14 : isMediumDevice ? 16 : 18,
  footerGap: isSmallDevice ? 12 : isMediumDevice ? 14 : 16,
};

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
        <View className="w-full max-w-md">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-full aspect-square"
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View
          className="items-center px-4 max-w-md"
          style={{ gap: RESPONSIVE.contentGap }}
        >
          <Text
            className="font-bold text-center text-salon-dark"
            style={{
              fontSize: RESPONSIVE.titleFontSize,
              lineHeight: RESPONSIVE.titleLineHeight,
            }}
          >
            {item.title}
          </Text>
          <Text
            className="text-center text-salon-gray-light max-w-[280px]"
            style={{
              fontSize: RESPONSIVE.subtitleFontSize,
              lineHeight: RESPONSIVE.subtitleLineHeight,
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
    <View className="flex-1 bg-white py-6">
      {/* Fixed Header - Logo */}
      <View
        className="items-center"
        style={{paddingVertical: RESPONSIVE.headerPaddingVertical}}
      >
        <Text
          className="text-black font-semibold"
          style={{ fontSize: RESPONSIVE.logoFontSize }}
        >
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
      <View
        className="px-6 items-center"
        style={{gap: RESPONSIVE.footerGap}}
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
          className="justify-center items-center rounded-xl bg-salon-primary w-full max-w-md"
          style={{
            paddingVertical: RESPONSIVE.buttonPaddingY,
            paddingHorizontal: RESPONSIVE.buttonPaddingX,
          }}
        >
          <Text
            className="text-white font-bold tracking-wider capitalize"
            style={{ fontSize: RESPONSIVE.buttonFontSize }}
          >
            {currentIndex === ONBOARDING_SLIDES.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>

        {/* Skip Button - Always takes space */}
        <View className="h-10 justify-center">
          {currentIndex < ONBOARDING_SLIDES.length - 1 ? (
            <TouchableOpacity onPress={handleSkip}>
              <Text
                className="text-salon-gray-light"
                style={{ fontSize: RESPONSIVE.skipFontSize }}
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
