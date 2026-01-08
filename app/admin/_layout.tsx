import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="edit-employee" />
      <Stack.Screen name="edit-category" />
    </Stack>
  );
}
