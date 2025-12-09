import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Star } from "lucide-react-native";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  color?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  color = "#F59E0B",
  interactive = false,
  onRatingChange,
}) => {
  const handlePress = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex);
    }
  };

  return (
    <View className="flex-row">
      {[...Array(maxStars)].map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= rating;

        if (interactive) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(starNumber)}
              style={{ marginRight: 2 }}
            >
              <Star
                size={size}
                color={color}
                fill={isFilled ? color : "transparent"}
              />
            </TouchableOpacity>
          );
        }

        return (
          <Star
            key={index}
            size={size}
            color={color}
            fill={isFilled ? color : "transparent"}
            style={{ marginRight: 2 }}
          />
        );
      })}
    </View>
  );
};
