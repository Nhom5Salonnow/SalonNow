import { Colors } from "@/constants";
import { STORAGE_KEYS, storeData } from "@/utils/asyncStorage";
import { hp, rf, wp } from "@/utils/responsive";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const handleLogin = async () => {
    // TODO: Implement actual login logic with API
    // For now, save a mock token to simulate login
    await storeData(STORAGE_KEYS.AUTH_TOKEN, "mock_token_123");
    await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify({
      name: "Doe John",
      email: email || "doejohn@example.com",
      phone: "+732 8888 111",
    }));
    router.replace("/home" as any);
  };

  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab);
    if (tab === "signup") {
      router.push("/auth/signup");
    }
  };

  return (
    <View className="flex-1">
      {/* Background Image with blur effect */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        }}
        className="flex-1"
        resizeMode="cover"
        blurRadius={3}
      >
        {/* Overlay */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center"
          style={{ paddingHorizontal: wp(5) }}
        >
          {/* Login Card */}
          <View
            className="bg-white/90 rounded-3xl w-full"
            style={{
              paddingHorizontal: wp(5),
              paddingVertical: hp(4),
              maxWidth: wp(90),
            }}
          >
            {/* Tab Switcher */}
            <View className="flex-row mb-6">
              <TouchableOpacity
                onPress={() => handleTabChange("login")}
                className="flex-1 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    activeTab === "login" ? Colors.primary : "transparent",
                  paddingVertical: hp(2),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(16),
                    fontWeight: "500",
                    color: activeTab === "login" ? "#fff" : Colors.primary,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleTabChange("signup")}
                className="flex-1 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    activeTab === "signup" ? Colors.primary : "transparent",
                  paddingVertical: hp(2),
                  borderWidth: activeTab === "signup" ? 0 : 1,
                  borderColor: Colors.primary,
                }}
              >
                <Text
                  style={{
                    fontSize: rf(16),
                    fontWeight: "500",
                    color: activeTab === "signup" ? "#fff" : Colors.primary,
                  }}
                >
                  Sign-up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email Input */}
            <View
              className="bg-white rounded-xl border"
              style={{
                borderColor: Colors.salon.coral,
                marginBottom: hp(2),
              }}
            >
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="px-4"
                style={{
                  paddingVertical: hp(1.8),
                  fontSize: rf(15),
                }}
                placeholderTextColor={Colors.gray[400]}
              />
            </View>

            {/* Password Input */}
            <View
              className="bg-white rounded-xl border"
              style={{
                borderColor: Colors.salon.coral,
                marginBottom: hp(1.5),
              }}
            >
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="px-4"
                style={{
                  paddingVertical: hp(1.8),
                  fontSize: rf(15),
                }}
                placeholderTextColor={Colors.gray[400]}
              />
            </View>

            {/* Forget Password */}
            <TouchableOpacity className="items-center" style={{ marginBottom: hp(3) }}>
              <Text
                style={{
                  fontSize: rf(14),
                  color: Colors.gray[500],
                  textDecorationLine: "underline",
                }}
              >
                Forget Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="rounded-2xl items-center justify-center"
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: hp(2),
              }}
            >
              <Text
                style={{
                  fontSize: rf(18),
                  fontWeight: "bold",
                  color: "#fff",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
