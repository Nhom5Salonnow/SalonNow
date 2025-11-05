import { Battery, Signal, Wifi } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface StatusBarProps {
  time?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = "9:41" }) => {
  return (
    <View className="w-full flex-row justify-between items-center px-6 pt-4 pb-2">
      <Text className="text-sm font-semibold text-black">{time}</Text>
      <View className="flex-row gap-1 items-center">
        <Signal size={16} color="black" />
        <Wifi size={16} color="black" />
        <Battery size={24} color="black" />
      </View>
    </View>
  );
};
