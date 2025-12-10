// import { Stack } from 'expo-router';
import { Slot } from 'expo-router';
import '../global.css';
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';

const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: 'https://0db2571590ab2555645a136be7f84a3b@o4510503114506240.ingest.us.sentry.io/4510505800105984',  // Thay bằng DSN của bạn
  tracePropagationTargets: ["https://myproject.org", /^\/api\//],
  debug: true,// Bật để xem logs khi test


  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% transactions khi test
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 5000,


  // User Interaction Tracking
  enableUserInteractionTracing: true,


  // Profiling
  // profilesSampleRate: 1.0,  // Chưa cần thêm liền
  //
  // // Session Replay
  // replaysSessionSampleRate: 1.0, // Ghi lại 100% session khi test // Chưa cần thêm liền
  // replaysOnErrorSampleRate: 1.0, // Ghi lại 100% khi có error // Chưa cần thêm liền

  // Integrations
  integrations: [
    // Mobile replay integration with minimal configuration
    // See: https://docs.sentry.io/platforms/react-native/session-replay/configuration/
    // Sentry.mobileReplayIntegration({
    //     maskAllText: true,
    //     maskAllImages: true,
    // }), // Chưa cần thêm liền
    // navigationIntegration,
    // Sentry.hermesProfilingIntegration({
    //     platformProfilers: true,
    // }), // Chưa cần thêm liền
  ],

  // Privacy
  sendDefaultPii: false, // Không gửi thông tin cá nhân mặc định
  maxBreadcrumbs: 150,

  // Enable native crash handling
  enableNative: true,
  enableNativeCrashHandling: true,
  enableAutoPerformanceTracing: true,

  // Debug configuration
  // _experiments: {
  //     captureFailedRequests: true,
  // }, // Chưa cần thêm liền
});


export default Sentry.wrap(function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);
  // Thiết lập user context cho analytics
  useEffect(() => {
    Sentry.setUser({
      id: "nhom5",
      email: "govovanhieu@gmail.com",
      username: "nhom5",
    });
    Sentry.setTag("group", "nhom5");
  }, []);

  return (
      // <Stack>
      //   <Stack.Screen name="index" options={{ title: 'Home' }} />
      //   <Stack.Screen name="(example-code)/nav" options={{ title: 'Nav' }} />
      //   <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      // </Stack>
      <Slot></Slot>
  );
});