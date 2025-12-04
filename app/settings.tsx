import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Switch, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, ChevronLeft } from 'lucide-react-native';
import { STORAGE_KEYS, getData, removeData } from '@/utils/asyncStorage';
import { wp, hp, rf } from '@/utils/responsive';

interface SettingsItemProps {
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  textColor?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  onPress,
  showArrow = false,
  rightElement,
  textColor = '#000',
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between py-4 border-b border-gray-100"
    disabled={!onPress && !showArrow}
  >
    <Text style={{ fontSize: rf(18), color: textColor, fontWeight: '400' }}>
      {title}
    </Text>
    {showArrow && (
      <View className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center">
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    )}
    {rightElement}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await getData(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        setUserImage(user.avatar || null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await removeData(STORAGE_KEYS.AUTH_TOKEN);
      await removeData(STORAGE_KEYS.USER_DATA);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circle */}
      <View
        className="absolute rounded-full bg-salon-pink-light"
        style={{
          left: -wp(50),
          top: -hp(10),
          width: wp(80),
          height: wp(80),
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: hp(6), paddingBottom: hp(3) }}
        >
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <ChevronLeft size={28} color="#000" />
            </TouchableOpacity>
            <Text style={{ fontSize: rf(24), fontWeight: '400', color: '#000' }}>
              Settings
            </Text>
          </View>

          {/* Profile Avatar */}
          <View
            className="rounded-full overflow-hidden border-2 border-white"
            style={{
              width: wp(16),
              height: wp(16),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={{
                uri: userImage || 'https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114',
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Settings List */}
        <View className="px-6" style={{ marginTop: hp(4) }}>
          {/* Account Info */}
          <SettingsItem
            title="Account Info"
            showArrow
            onPress={() => {}}
          />

          {/* Language */}
          <SettingsItem
            title="Language"
            showArrow
            onPress={() => {}}
          />

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <Text style={{ fontSize: rf(18), color: '#000', fontWeight: '400' }}>
              Dark Mood
            </Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E7EB', true: '#9CA3AF' }}
              thumbColor={darkMode ? '#1F2937' : '#f4f3f4'}
              ios_backgroundColor="#E5E7EB"
            />
          </View>

          {/* Help Center */}
          <TouchableOpacity className="py-4">
            <Text style={{ fontSize: rf(16), color: '#6B7280', fontWeight: '400' }}>
              Help Center
            </Text>
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity className="py-2">
            <Text style={{ fontSize: rf(16), color: '#6B7280', fontWeight: '400' }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>

          {/* Recommendations */}
          <TouchableOpacity className="py-4">
            <Text style={{ fontSize: rf(16), color: '#6B7280', fontWeight: '400' }}>
              Recommendations
            </Text>
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            onPress={handleSignOut}
            style={{ marginTop: hp(4) }}
          >
            <Text style={{ fontSize: rf(18), color: '#EF4444', fontWeight: '400' }}>
              Sign-out
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}
