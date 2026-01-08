import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { LogIn, UserPlus } from "lucide-react-native";
import { Colors } from "@/constants";
import { hp, rf, wp } from "@/utils/responsive";

interface GuestPromptProps {
  message?: string;
  showButtons?: boolean;
  variant?: "horizontal" | "vertical";
  buttonSize?: "small" | "medium" | "large";
}

export const GuestPrompt: React.FC<GuestPromptProps> = ({
  message = "Sign in to access all features",
  showButtons = true,
  variant = "horizontal",
  buttonSize = "medium",
}) => {
  const handleLogin = () => {
    router.push("/auth/login" as any);
  };

  const handleRegister = () => {
    router.push("/auth/signup" as any);
  };

  const getButtonPadding = () => {
    switch (buttonSize) {
      case "small":
        return { vertical: hp(1), horizontal: wp(4) };
      case "large":
        return { vertical: hp(2), horizontal: wp(8) };
      default:
        return { vertical: hp(1.5), horizontal: wp(6) };
    }
  };

  const getFontSize = () => {
    switch (buttonSize) {
      case "small":
        return rf(13);
      case "large":
        return rf(16);
      default:
        return rf(15);
    }
  };

  const getIconSize = () => {
    switch (buttonSize) {
      case "small":
        return rf(14);
      case "large":
        return rf(20);
      default:
        return rf(18);
    }
  };

  const padding = getButtonPadding();
  const fontSize = getFontSize();
  const iconSize = getIconSize();

  return (
    <View>
      {message ? (
        <Text
          style={{
            fontSize: rf(14),
            color: Colors.gray[500],
            marginBottom: hp(2),
            textAlign: variant === "vertical" ? "center" : "left",
          }}
        >
          {message}
        </Text>
      ) : null}

      {showButtons && (
        <View
          style={[
            { flexDirection: variant === "horizontal" ? "row" : "column", alignItems: "center" },
            variant === "vertical" ? { gap: hp(1.5) } : undefined,
          ]}
        >
          <TouchableOpacity
            onPress={handleLogin}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 9999,
              backgroundColor: Colors.primary,
              paddingVertical: padding.vertical,
              paddingHorizontal: padding.horizontal,
              marginRight: variant === "horizontal" ? wp(3) : 0,
            }}
          >
            <LogIn size={iconSize} color="#FFF" />
            <Text
              style={{
                fontSize: fontSize,
                fontWeight: "600",
                color: "#FFF",
                marginLeft: wp(2),
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegister}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 9999,
              backgroundColor: "transparent",
              paddingVertical: padding.vertical,
              paddingHorizontal: padding.horizontal,
              borderWidth: 1,
              borderColor: Colors.primary,
            }}
          >
            <UserPlus size={iconSize} color={Colors.primary} />
            <Text
              style={{
                fontSize: fontSize,
                fontWeight: "600",
                color: Colors.primary,
                marginLeft: wp(2),
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
