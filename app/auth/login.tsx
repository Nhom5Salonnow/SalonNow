import { Colors } from "@/constants";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { authService } from "@/api/authService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.login({ email, password });
      router.replace("/home" as any);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

            {/* Error Message */}
            {error && (
              <View
                className="rounded-xl"
                style={{
                  backgroundColor: "#FEE2E2",
                  padding: hp(1.5),
                  marginBottom: hp(2),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    color: "#DC2626",
                    textAlign: "center",
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

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
              disabled={isLoading}
              className="rounded-2xl items-center justify-center"
              style={{
                backgroundColor: isLoading ? Colors.gray[400] : Colors.primary,
                paddingVertical: hp(2),
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    fontSize: rf(18),
                    fontWeight: "bold",
                    color: "#fff",
                  }}
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>

            {/* Demo accounts info */}
            <View style={{ marginTop: hp(3) }}>
              <Text
                style={{
                  fontSize: rf(12),
                  color: Colors.gray[500],
                  textAlign: "center",
                  marginBottom: hp(0.5),
                }}
              >
                Demo accounts:
              </Text>
              <Text
                style={{
                  fontSize: rf(11),
                  color: Colors.gray[400],
                  textAlign: "center",
                }}
              >
                doejohn@example.com / 123456{"\n"}
                test@test.com / test
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
