import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Users, User } from "lucide-react-native";
import { Colors } from "@/constants";
import { rf, wp } from "@/utils/responsive";
import { Specialist } from "@/constants/mockData";

interface BaseStylistOptionProps {
  isSelected: boolean;
  onPress: () => void;
}

interface AnyStylistOptionProps extends BaseStylistOptionProps {
  type: "any";
}

interface MultipleStylistOptionProps extends BaseStylistOptionProps {
  type: "multiple";
}

interface IndividualStylistOptionProps extends BaseStylistOptionProps {
  type: "individual";
  stylist: Specialist;
}

type StylistOptionProps =
  | AnyStylistOptionProps
  | MultipleStylistOptionProps
  | IndividualStylistOptionProps;

export const StylistOption: React.FC<StylistOptionProps> = (props) => {
  const { isSelected, onPress, type } = props;

  const renderContent = () => {
    if (type === "any") {
      return (
        <>
          <View
            className="rounded-xl items-center justify-center"
            style={{
              width: wp(14),
              height: wp(14),
              backgroundColor: "#E9D5FF",
            }}
          >
            <Users size={24} color="#7C3AED" />
          </View>
          <View className="ml-4">
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
              Any Stylist
            </Text>
            <Text style={{ fontSize: rf(13), color: "#6B7280", marginTop: 2 }}>
              Next available stylist
            </Text>
          </View>
        </>
      );
    }

    if (type === "multiple") {
      return (
        <>
          <View
            className="rounded-xl items-center justify-center"
            style={{
              width: wp(14),
              height: wp(14),
              backgroundColor: "#E9D5FF",
            }}
          >
            <User size={24} color="#3B82F6" />
          </View>
          <View className="ml-4">
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
              Multiple Stylists
            </Text>
            <Text style={{ fontSize: rf(13), color: "#6B7280", marginTop: 2 }}>
              Choose per service
            </Text>
          </View>
        </>
      );
    }

    const { stylist } = props as IndividualStylistOptionProps;
    return (
      <>
        <Image
          source={{ uri: stylist.imageUrl }}
          className="rounded-xl"
          style={{ width: wp(14), height: wp(14) }}
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
            {stylist.name}
          </Text>
          <Text style={{ fontSize: rf(13), color: "#6B7280", marginTop: 2 }}>
            {stylist.role}
          </Text>
        </View>
        {stylist.isTopRated && (
          <View
            className="rounded-full px-3 py-1 flex-row items-center"
            style={{ backgroundColor: "#FEF3C7" }}
          >
            <Text style={{ fontSize: rf(12), color: "#92400E" }}>
              🏆 Top Rated
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white rounded-2xl mb-3 p-4"
      style={{
        borderWidth: isSelected ? 2 : 1,
        borderColor: isSelected ? Colors.primary : "#E5E7EB",
      }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
