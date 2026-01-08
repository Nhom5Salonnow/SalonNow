import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { STORAGE_KEYS, getData } from '@/utils/asyncStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, rf } from '@/utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const insets = useSafeAreaInsets();

  const handleStart = async () => {
    try {
      const hasCompletedOnboarding = await getData(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);

      if (hasCompletedOnboarding !== 'true') {
        router.replace('/onboarding');
      } else {
        // Go directly to home, no login required
        router.replace('/home' as any);
      }
    } catch (error) {
      console.error('Error checking app status:', error);
      router.replace('/onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFF5F5', '#FFE4E6', '#FECDD3', '#FFE4E6', '#FFF5F5']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.gradient}
      >
        {/* Watercolor effect overlay */}
        <View style={[styles.watercolorOverlay, { height: hp(30) }]}>
          <LinearGradient
            colors={['transparent', '#FECDD3', '#FDA4AF']}
            style={styles.flex1}
          />
        </View>

        {/* Main content area with safe area padding */}
        <View style={[styles.contentContainer, { paddingTop: insets.top + hp(5) }]}>
          {/* Logo Text */}
          <View style={{ marginBottom: hp(5) }}>
            <Text style={styles.logoText}>
              Salon
            </Text>
            <Text style={[styles.logoText, { marginTop: -hp(2) }]}>
              Now
            </Text>
          </View>

          {/* Tagline */}
          <Text style={styles.tagline}>
            Step into a world of personalized{'\n'}services that enhance your beauty{'\n'}and well-being.
          </Text>
        </View>

        {/* Let's Start Button with safe area bottom padding */}
        <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom, hp(4)) + hp(4) }]}>
          <TouchableOpacity
            onPress={handleStart}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {"Let's Start"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  watercolorOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(8),
  },
  logoText: {
    fontFamily: 'serif',
    fontSize: rf(60),
    fontStyle: 'italic',
    color: '#1a1a1a',
    textAlign: 'center',
    lineHeight: rf(70),
  },
  tagline: {
    textAlign: 'center',
    color: '#374151',
    fontSize: rf(16),
    lineHeight: rf(24),
    paddingHorizontal: wp(5),
    marginTop: hp(8),
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(10),
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
    backgroundColor: '#F87171',
    paddingVertical: hp(2),
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: rf(18),
  },
});
