import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import { STORAGE_KEYS, storeData } from '@/utils/asyncStorage';
import { Scissors, Calendar, MapPin } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  iconColor: string;
  IconComponent: typeof Scissors;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Tìm Salon Yêu Thích',
    subtitle: 'Khám phá hàng ngàn salon chất lượng gần bạn với đầy đủ dịch vụ làm đẹp',
    backgroundColor: '#E6F4FE',
    iconColor: '#3B82F6',
    IconComponent: Scissors,
  },
  {
    id: '2',
    title: 'Đặt Lịch Dễ Dàng',
    subtitle: 'Chọn thời gian phù hợp và đặt lịch hẹn chỉ với vài thao tác đơn giản',
    backgroundColor: '#FEF3E6',
    iconColor: '#F59E0B',
    IconComponent: Calendar,
  },
  {
    id: '3',
    title: 'Theo Dõi Lịch Hẹn',
    subtitle: 'Quản lý và nhận thông báo nhắc nhở về các lịch hẹn của bạn',
    backgroundColor: '#F0FDF4',
    iconColor: '#10B981',
    IconComponent: MapPin,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleDone = async () => {
    await storeData(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
    router.replace('/home' as any);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
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

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    const Icon = item.IconComponent;
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.iconContainer}>
          <Icon size={120} color={item.iconColor} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    );
  };

  const getItemLayout = (_data: any, index: number) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
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

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? '#3B82F6' : '#D1D5DB',
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleDone} style={styles.skipButton}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentIndex === slides.length - 1 ? 'Bắt đầu' : 'Tiếp'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#6B7280',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
