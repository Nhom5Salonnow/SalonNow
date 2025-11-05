import React from "react";
import { View } from "react-native";

interface PaginationDotsProps {
  length: number;
  currentIndex: number;
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({
  length,
  currentIndex,
}) => {
  return (
    <View className="flex-row gap-1 my-4">
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          className="w-4 h-4 rounded-full items-center justify-center"
          style={{
            backgroundColor: index === currentIndex ? "#FE697D" : "#FFCCD3",
          }}
        >
          {/* Inner dollar sign icon placeholder - simplified */}
          <View
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: index === currentIndex ? "white" : "#FE697D",
            }}
          />
        </View>
      ))}
    </View>
  );
};
