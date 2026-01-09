import { Colors } from "@/constants";
import { Tabs } from "expo-router";
import { Bell, Calendar, Home, User } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#2A2E3B",
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#FFF0F3",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 0,
          elevation: 0,
          boxShadow: 'none',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Home size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Calendar size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Bell size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <User size={28} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}
