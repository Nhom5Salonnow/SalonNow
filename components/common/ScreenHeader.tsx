import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Menu, Bell, ChevronLeft, Search } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { Colors } from '@/constants';

interface ScreenHeaderProps {
  variant?: 'home' | 'back' | 'menu' | 'title';

  title?: string;
  greeting?: { line1: string; line2: string };

  showNotification?: boolean;
  showProfile?: boolean;
  showSearch?: boolean;
  profileImage?: string;
  notificationCount?: number;

  onMenuPress?: () => void;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  onSearchPress?: () => void;

  rightElement?: React.ReactNode;
}

const DEFAULT_PROFILE_IMAGE = 'https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114';

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  variant = 'home',
  title,
  greeting,
  showNotification = false,
  showProfile = false,
  showSearch = false,
  profileImage,
  notificationCount,
  onMenuPress,
  onBackPress,
  onNotificationPress,
  onProfilePress,
  onSearchPress,
  rightElement,
}) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleNotification = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/notifications' as any);
    }
  };

  const handleProfile = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/profile' as any);
    }
  };

  const renderLeftSection = () => {
    switch (variant) {
      case 'back':
        return (
          <TouchableOpacity onPress={handleBack}>
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>
        );
      case 'menu':
      case 'home':
      default:
        return (
          <View className="flex-row items-center" style={{ gap: wp(4) }}>
            <TouchableOpacity className="p-2" onPress={onMenuPress}>
              <Menu size={rf(28)} color={Colors.salon.dark} strokeWidth={2} />
            </TouchableOpacity>
            {greeting && (
              <View>
                <Text style={{ fontSize: rf(22), fontWeight: '400', color: 'rgba(0,0,0,0.8)' }}>
                  {greeting.line1}
                </Text>
                <Text style={{ fontSize: rf(26), fontWeight: '400', color: 'rgba(0,0,0,0.57)' }}>
                  {greeting.line2}
                </Text>
              </View>
            )}
          </View>
        );
    }
  };

  const renderCenterSection = () => {
    if (title) {
      return (
        <Text
          className="flex-1 text-center"
          style={{ fontSize: rf(20), fontWeight: '500', color: '#000' }}
        >
          {title}
        </Text>
      );
    }
    return null;
  };

  const renderRightSection = () => {
    if (rightElement) {
      return rightElement;
    }

    return (
      <View className="flex-row items-center" style={{ gap: wp(3) }}>
        {showSearch && (
          <TouchableOpacity onPress={onSearchPress}>
            <Search size={rf(24)} color="#000" />
          </TouchableOpacity>
        )}
        {showNotification && (
          <TouchableOpacity
            onPress={handleNotification}
            className="relative items-center justify-center rounded-lg border border-gray-200"
            style={{ width: wp(11), height: wp(11) }}
          >
            <Bell size={rf(20)} color="#0B0C15" strokeWidth={1.5} />
            {(notificationCount ?? 0) > 0 && (
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
            )}
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity
            onPress={handleProfile}
            className="rounded-full overflow-hidden"
            style={{ width: wp(14), height: wp(14) }}
          >
            <Image
              source={{ uri: profileImage || DEFAULT_PROFILE_IMAGE }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        {variant === 'back' && title && !showSearch && !showNotification && !showProfile && (
          <View style={{ width: wp(7) }} />
        )}
      </View>
    );
  };

  return (
    <View
      className="flex-row items-center justify-between relative z-10"
      style={{ paddingHorizontal: wp(6), paddingTop: hp(6) }}
    >
      {renderLeftSection()}
      {renderCenterSection()}
      {renderRightSection()}
    </View>
  );
};
