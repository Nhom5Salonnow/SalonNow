import { Stack } from 'expo-router';
import '../global.css';
import * as Sentry from '@sentry/react-native';
import { useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts';

const navigationIntegration = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: 'https://0db2571590ab2555645a136be7f84a3b@o4510503114506240.ingest.us.sentry.io/4510505800105984',
  tracePropagationTargets: ["https://myproject.org", /^\/api\//],
  debug: true,

  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 5000,

  enableUserInteractionTracing: true,

  integrations: [
  ],

  sendDefaultPii: false,
  maxBreadcrumbs: 150,

  enableNative: true,
  enableNativeCrashHandling: true,
  enableAutoPerformanceTracing: true,
});


export default Sentry.wrap(function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    Sentry.setUser({
      id: "nhom5",
      email: "govovanhieu@gmail.com",
      username: "nhom5",
    });
    Sentry.setTag("group", "nhom5");
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </SafeAreaProvider>
  );
});
