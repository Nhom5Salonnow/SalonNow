import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="home" />
      <Stack.Screen name="edit-employee" />
      <Stack.Screen name="edit-category" />
    </Stack>
  );
}
