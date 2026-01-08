import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import {
  Store,
  Clock,
  MapPin,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  ChevronRight,
  Edit2,
  Camera,
} from "lucide-react-native";
import { useAuth } from "@/contexts";

interface SettingItem {
  id: string;
  icon: any;
  label: string;
  description?: string;
  type: "navigate" | "toggle" | "info";
  value?: string | boolean;
}

const SALON_INFO = {
  name: "Salon Now",
  address: "123 Beauty Street, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  website: "www.salonnow.com",
  logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200",
  openingHours: "Mon-Sat: 9AM - 8PM, Sun: 10AM - 6PM",
};

const SETTINGS_SECTIONS = [
  {
    title: "Salon Profile",
    items: [
      { id: "salon-info", icon: Store, label: "Salon Information", description: "Edit name, address, contact", type: "navigate" as const },
      { id: "hours", icon: Clock, label: "Operating Hours", description: "Set your business hours", type: "navigate" as const },
      { id: "location", icon: MapPin, label: "Location & Map", description: "Update salon location", type: "navigate" as const },
    ],
  },
  {
    title: "Notifications",
    items: [
      { id: "push", icon: Bell, label: "Push Notifications", type: "toggle" as const, value: true },
      { id: "email", icon: Bell, label: "Email Notifications", type: "toggle" as const, value: true },
      { id: "sms", icon: Bell, label: "SMS Notifications", type: "toggle" as const, value: false },
    ],
  },
  {
    title: "Business",
    items: [
      { id: "payment", icon: CreditCard, label: "Payment Settings", description: "Manage payment methods", type: "navigate" as const },
      { id: "security", icon: Shield, label: "Security", description: "Password & access control", type: "navigate" as const },
    ],
  },
];

export default function AdminSettingsScreen() {
  const { logout } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
  });

  const handleToggle = (id: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [id]: !prev[id as keyof typeof prev],
    }));
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderSettingItem = (item: SettingItem) => {
    const IconComponent = item.icon;

    return (
      <TouchableOpacity
        key={item.id}
        className="flex-row items-center"
        style={{
          backgroundColor: "#fff",
          paddingVertical: hp(1.8),
          paddingHorizontal: wp(4),
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
        onPress={() => {
          if (item.type === "navigate") {
            // Handle navigation
          }
        }}
        disabled={item.type === "toggle"}
      >
        <View
          className="items-center justify-center rounded-full"
          style={{ width: wp(10), height: wp(10), backgroundColor: Colors.salon.pinkLight }}
        >
          <IconComponent size={rf(18)} color={Colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: wp(3) }}>
          <Text style={{ fontSize: rf(15), fontWeight: "500", color: "#000" }}>
            {item.label}
          </Text>
          {item.description && (
            <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginTop: hp(0.3) }}>
              {item.description}
            </Text>
          )}
        </View>
        {item.type === "navigate" && (
          <ChevronRight size={rf(20)} color={Colors.gray[400]} />
        )}
        {item.type === "toggle" && (
          <Switch
            value={notificationSettings[item.id as keyof typeof notificationSettings]}
            onValueChange={() => handleToggle(item.id)}
            trackColor={{ false: Colors.gray[300], true: Colors.salon.pinkLight }}
            thumbColor={notificationSettings[item.id as keyof typeof notificationSettings] ? Colors.primary : "#fff"}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: hp(6), paddingHorizontal: wp(6) }}>
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#000" }}>
            Settings
          </Text>
        </View>

        {/* Salon Profile Card */}
        <View
          className="rounded-2xl"
          style={{
            marginHorizontal: wp(6),
            marginTop: hp(3),
            backgroundColor: Colors.salon.pinkLight,
            padding: wp(4),
          }}
        >
          <View className="flex-row items-center">
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: SALON_INFO.logo }}
                style={{ width: wp(18), height: wp(18), borderRadius: wp(9) }}
              />
              <TouchableOpacity
                className="absolute items-center justify-center rounded-full"
                style={{
                  bottom: 0,
                  right: 0,
                  width: wp(7),
                  height: wp(7),
                  backgroundColor: Colors.primary,
                }}
              >
                <Camera size={rf(12)} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: wp(4) }}>
              <Text style={{ fontSize: rf(20), fontWeight: "700", color: "#000" }}>
                {SALON_INFO.name}
              </Text>
              <View className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
                <MapPin size={rf(14)} color={Colors.gray[600]} />
                <Text
                  style={{ fontSize: rf(12), color: Colors.gray[600], marginLeft: wp(1), flex: 1 }}
                  numberOfLines={1}
                >
                  {SALON_INFO.address}
                </Text>
              </View>
              <View className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
                <Clock size={rf(14)} color={Colors.gray[600]} />
                <Text style={{ fontSize: rf(12), color: Colors.gray[600], marginLeft: wp(1) }}>
                  {SALON_INFO.openingHours}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl"
            style={{ backgroundColor: "#fff", paddingVertical: hp(1.2), marginTop: hp(2) }}
          >
            <Edit2 size={rf(16)} color={Colors.primary} />
            <Text style={{ fontSize: rf(14), color: Colors.primary, fontWeight: "500", marginLeft: wp(2) }}>
              Edit Salon Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={{ marginTop: hp(3) }}>
            <Text
              style={{
                fontSize: rf(14),
                fontWeight: "600",
                color: Colors.gray[500],
                paddingHorizontal: wp(6),
                marginBottom: hp(1),
              }}
            >
              {section.title}
            </Text>
            <View
              className="rounded-xl overflow-hidden"
              style={{ marginHorizontal: wp(6), borderWidth: 1, borderColor: "#F3F4F6" }}
            >
              {section.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center rounded-xl"
          style={{
            marginHorizontal: wp(6),
            marginTop: hp(4),
            marginBottom: hp(4),
            backgroundColor: "#FEF2F2",
            paddingVertical: hp(1.8),
          }}
        >
          <LogOut size={rf(18)} color="#EF4444" />
          <Text style={{ fontSize: rf(16), color: "#EF4444", fontWeight: "600", marginLeft: wp(2) }}>
            Log Out
          </Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text
          style={{
            fontSize: rf(12),
            color: Colors.gray[400],
            textAlign: "center",
            marginBottom: hp(4),
          }}
        >
          Salon Now Admin v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
