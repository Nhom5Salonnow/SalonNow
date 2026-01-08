import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Switch, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, ChevronLeft, User } from 'lucide-react-native';
import { wp, hp, rf } from '@/utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, DEFAULT_AVATAR } from '@/constants';
import { useAuth } from '@/contexts';
import { GuestPrompt } from '@/components';

interface SettingsItemProps {
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  textColor?: string;
  disabled?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  onPress,
  showArrow = false,
  rightElement,
  textColor = '#000',
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between py-4 border-b border-gray-100"
    disabled={disabled || (!onPress && !showArrow)}
    style={{ opacity: disabled ? 0.5 : 1 }}
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
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  const handleSignOut = async () => {
    // On web, use window.confirm instead of Alert.alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to sign out?');
      if (confirmed) {
        await logout();
      }
      return;
    }

    // On native, use Alert.alert
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circle */}
      <View
        className="absolute rounded-full"
        style={{
          left: -wp(50),
          top: -hp(10),
          width: wp(80),
          height: wp(80),
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.5,
        }}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingTop: insets.top + hp(1), paddingBottom: hp(3) }}
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
          <TouchableOpacity
            onPress={() => router.push(isLoggedIn ? '/profile' : '/auth/login' as any)}
            className="rounded-full overflow-hidden items-center justify-center"
            style={{
              width: wp(14),
              height: wp(14),
              borderWidth: 2,
              borderColor: Colors.salon.pinkLight,
              backgroundColor: isLoggedIn ? 'transparent' : Colors.gray[200],
            }}
          >
            {isLoggedIn ? (
              <Image
                source={{ uri: user?.avatar || DEFAULT_AVATAR }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <User size={rf(20)} color={Colors.gray[500]} />
            )}
          </TouchableOpacity>
        </View>

        {/* Guest Login/Register Section */}
        {!isLoggedIn && (
          <View className="px-6" style={{ marginBottom: hp(3) }}>
            <GuestPrompt message="Sign in to access all settings and features" />
          </View>
        )}

        {/* Settings List */}
        <View className="px-6" style={{ marginTop: isLoggedIn ? hp(4) : hp(2) }}>
          {/* Account Info - only for logged in users */}
          {isLoggedIn && (
            <SettingsItem
              title="Account Info"
              showArrow
              onPress={() => router.push('/edit-profile' as any)}
            />
          )}

          {/* Change Password - only for logged in users */}
          {isLoggedIn && (
            <SettingsItem
              title="Change Password"
              showArrow
              onPress={() => router.push('/change-password' as any)}
            />
          )}

          {/* Language */}
          <SettingsItem
            title="Language"
            showArrow
            onPress={() => {}}
          />

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
            <Text style={{ fontSize: rf(18), color: '#000', fontWeight: '400' }}>
              Dark Mode
            </Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E5E7EB', true: Colors.primary }}
              thumbColor={darkMode ? '#FFF' : '#f4f3f4'}
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

          {/* Sign Out - only for logged in users */}
          {isLoggedIn && (
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={handleSignOut}
              className="items-center justify-center rounded-xl"
              style={{
                marginTop: hp(3),
                paddingVertical: hp(1.8),
                backgroundColor: '#FEF2F2',
              }}
            >
              <Text style={{ fontSize: rf(16), color: '#EF4444', fontWeight: '600' }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: hp(10) }} />
      </ScrollView>
    </View>
  );
}
