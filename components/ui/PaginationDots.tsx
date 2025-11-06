import React from "react";
import { View, TouchableOpacity } from "react-native";

interface PaginationDotsProps {
  length: number;
  currentIndex: number;
  onDotPress?: (index: number) => void;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  length,
  currentIndex,
  onDotPress,
}) => {
  return (
    <View className="flex-row gap-1 my-4">
      {Array.from({ length }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onDotPress?.(index)}
          activeOpacity={0.7}
          className="w-4 h-4 rounded-full items-center justify-center"
          style={{
            backgroundColor: index === currentIndex ? "#FE697D" : "#FFCCD3",
          }}
        >
          {/* Inner dot */}
          <View
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: index === currentIndex ? "white" : "#FE697D",
            }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
