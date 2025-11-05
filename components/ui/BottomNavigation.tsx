import { Calendar, Home, List, User } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface BottomNavigationProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab = "home",
  onTabPress,
}) => {
  const tabs = [
    { id: "home", icon: Home },
    { id: "calendar", icon: Calendar },
    { id: "list", icon: List },
    { id: "profile", icon: User },
  ];

  return (
    <View className="h-16 bg-salon-pink-bg rounded-t-[30px] flex-row items-center justify-around px-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            className="p-3"
            onPress={() => onTabPress?.(tab.id)}
          >
            <Icon
              size={28}
              color={isActive ? "#FE697D" : "#2A2E3B"}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
