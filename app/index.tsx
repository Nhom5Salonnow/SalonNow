import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { STORAGE_KEYS, getData } from '@/utils/asyncStorage';
import { Colors } from '@/constants';

export default function Index() {
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const hasCompletedOnboarding = await getData(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);

      if (hasCompletedOnboarding === 'true') {
        // User has completed onboarding, go to tabs (home)
        router.replace('/home' as any);
      } else {
        // First time user, show onboarding
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if error
      router.replace('/onboarding');
    }
  };

  // Show loading spinner while checking
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}
