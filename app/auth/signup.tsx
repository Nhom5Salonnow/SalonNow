import { Colors } from "@/constants";
import { STORAGE_KEYS, storeData } from "@/utils/asyncStorage";
import { hp, rf, wp } from "@/utils/responsive";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("signup");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignup = async () => {
    // TODO: Implement actual signup logic with API
    // For now, save a mock token to simulate signup
    await storeData(STORAGE_KEYS.AUTH_TOKEN, "mock_token_123");
    await storeData(STORAGE_KEYS.USER_DATA, JSON.stringify({
      name: name || "New User",
      email: email || "user@example.com",
      phone: phone || "+732 0000 000",
    }));
    router.replace("/home" as any);
  };

  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab);
    if (tab === "login") {
      router.back();
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
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingHorizontal: wp(5),
              paddingVertical: hp(3),
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Signup Card */}
            <View
              className="bg-white/90 rounded-3xl w-full"
              style={{
                paddingHorizontal: wp(5),
                paddingVertical: hp(4),
                maxWidth: wp(90),
                alignSelf: "center",
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
                    borderWidth: activeTab === "login" ? 0 : 1,
                    borderColor: Colors.primary,
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

              {/* Name Input */}
              <View
                className="bg-white rounded-xl border"
                style={{
                  borderColor: Colors.salon.coral,
                  marginBottom: hp(2),
                }}
              >
                <TextInput
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  className="px-4"
                  style={{
                    paddingVertical: hp(1.8),
                    fontSize: rf(15),
                  }}
                  placeholderTextColor={Colors.gray[400]}
                />
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

              {/* Phone Input */}
              <View
                className="bg-white rounded-xl border"
                style={{
                  borderColor: Colors.salon.coral,
                  marginBottom: hp(2),
                }}
              >
                <TextInput
                  placeholder="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
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
                  marginBottom: hp(2),
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

              {/* Confirm Password Input */}
              <View
                className="bg-white rounded-xl border"
                style={{
                  borderColor: Colors.salon.coral,
                  marginBottom: hp(3),
                }}
              >
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  className="px-4"
                  style={{
                    paddingVertical: hp(1.8),
                    fontSize: rf(15),
                  }}
                  placeholderTextColor={Colors.gray[400]}
                />
              </View>

              {/* Sign up Button */}
              <TouchableOpacity
                onPress={handleSignup}
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
                  Sign-up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Remember Me Checkbox */}
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center justify-center"
              style={{ marginTop: hp(3) }}
            >
              <View
                className="items-center justify-center rounded"
                style={{
                  width: wp(5),
                  height: wp(5),
                  borderWidth: wp(0.5),
                  borderColor: Colors.gray[500],
                  backgroundColor: rememberMe ? Colors.gray[500] : "transparent",
                  marginRight: wp(2),
                }}
              >
                {rememberMe && (
                  <Text style={{ color: "#fff", fontSize: rf(10) }}>✓</Text>
                )}
              </View>
              <Text
                style={{
                  fontSize: rf(14),
                  color: Colors.gray[600],
                  textDecorationLine: "underline",
                }}
              >
                Remember Me ?
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
