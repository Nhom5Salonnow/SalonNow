import { Phone, Star } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface SpecialistCardProps {
  name: string;
  imageUrl: string;
  rating?: number;
  phone: string;
  onPress?: () => void;
}

export const SpecialistCard: React.FC<SpecialistCardProps> = ({
  name,
  imageUrl,
  rating = 0,
  phone,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-shrink-0 w-[142px] rounded-md border border-black/23 bg-white/45 shadow-lg p-3"
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-[102px] rounded-md mb-2"
        resizeMode="cover"
      />
      <Text className="text-[17px] text-black" style={{ fontWeight: "400" }}>
        {name}
      </Text>

      {/* Rating */}
      {rating > 0 && (
        <View className="flex-row gap-1 mt-1">
          {[...Array(3)].map((_, i) => (
            <Star
              key={i}
              size={10}
              color="#2A2E3B"
              fill={i < rating ? "#FF5B5B" : "none"}
            />
          ))}
        </View>
      )}

      {/* Phone */}
      <View className="flex-row items-center gap-1 mt-2">
        <Phone size={10} color="#2A2E3B" />
        <Text className="text-[12px] text-salon-dark">{phone}</Text>
      </View>
    </TouchableOpacity>
  );
};
