import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { STORAGE_KEYS, getData } from '@/utils/asyncStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, rf } from '@/utils/responsive';

export default function SplashScreen() {

  const handleStart = async () => {
    try {
      const hasCompletedOnboarding = await getData(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
      const authToken = await getData(STORAGE_KEYS.AUTH_TOKEN);

      if (hasCompletedOnboarding !== 'true') {
        router.replace('/onboarding');
      } else if (!authToken) {
        router.replace('/auth/login');
      } else {
        router.replace('/home' as any);
      }
    } catch (error) {
      console.error('Error checking app status:', error);
      router.replace('/onboarding');
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#FFF5F5', '#FFE4E6', '#FECDD3', '#FFE4E6', '#FFF5F5']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        className="flex-1"
      >
        {/* Watercolor effect overlay */}
        <View
          className="absolute bottom-0 left-0 right-0 opacity-30"
          style={{ height: hp(30) }}
        >
          <LinearGradient
            colors={['transparent', '#FECDD3', '#FDA4AF']}
            className="flex-1"
          />
        </View>

        <View className="flex-1 justify-center items-center px-8">
          {/* Logo Text */}
          <View style={{ marginBottom: hp(5) }}>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: rf(60),
                fontStyle: 'italic',
                color: '#1a1a1a',
                textAlign: 'center',
                lineHeight: rf(70),
              }}
            >
              Salon
            </Text>
            <Text
              style={{
                fontFamily: 'serif',
                fontSize: rf(60),
                fontStyle: 'italic',
                color: '#1a1a1a',
                textAlign: 'center',
                lineHeight: rf(70),
                marginTop: -hp(2),
              }}
            >
              Now
            </Text>
          </View>

          {/* Tagline */}
          <Text
            className="text-center text-gray-700"
            style={{
              fontSize: rf(16),
              lineHeight: rf(24),
              paddingHorizontal: wp(5),
              marginTop: hp(8),
            }}
          >
            Step into a world of personalized{'\n'}services that enhance your beauty{'\n'}and well-being.
          </Text>
        </View>

        {/* Let's Start Button */}
        <View
          className="items-center"
          style={{ paddingBottom: hp(8), paddingHorizontal: wp(10) }}
        >
          <TouchableOpacity
            onPress={handleStart}
            className="w-full items-center justify-center rounded-full"
            style={{
              backgroundColor: '#F87171',
              paddingVertical: hp(2),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text
              className="text-white font-medium"
              style={{ fontSize: rf(18) }}
            >
              {"Let's Start"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
