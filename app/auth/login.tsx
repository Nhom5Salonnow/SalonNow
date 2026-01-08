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
  SafeAreaView,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useAuth } from "@/contexts";

export default function LoginScreen() {
  const { login, loginWithCredentials } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      // Call real API
      const result = await loginWithCredentials(email, password);

      if (result.success) {
        router.replace("/home" as any);
        return;
      }

      // API failed - show error
      setError(result.message || "Login failed. Please try again.");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: "login" | "signup") => {
    if (tab === "signup") {
      router.replace("/auth/signup" as any);
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

        <SafeAreaView className="flex-1">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: hp(6),
              left: wp(5),
              zIndex: 10,
              padding: wp(2),
            }}
          >
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center"
            style={{ paddingHorizontal: wp(5) }}
          >
            {/* Title */}
            <Text
              style={{
                fontSize: rf(36),
                fontWeight: "bold",
                fontStyle: "italic",
                color: Colors.salon.dark,
                marginBottom: hp(1.5),
              }}
            >
              Salon Now
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                fontSize: rf(14),
                color: Colors.gray[600],
                textAlign: "center",
                marginBottom: hp(4),
                paddingHorizontal: wp(8),
                lineHeight: rf(20),
              }}
            >
              Login to unlock a seamless beauty experience tailored just for you.
            </Text>

            {/* Login Card */}
          <View
            className="bg-white/90 rounded-3xl w-full"
            style={{
              paddingHorizontal: wp(6),
              paddingVertical: hp(3),
              maxWidth: wp(90),
            }}
          >
            {/* Tab Switcher */}
            <View className="flex-row items-center" style={{ marginBottom: hp(2.5) }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleTabChange("login")}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: Colors.primary,
                  paddingVertical: hp(2),
                  borderRadius: 16,
                  marginRight: wp(2),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(16),
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleTabChange("signup")}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  paddingVertical: hp(2),
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: Colors.primary,
                }}
              >
                <Text
                  style={{
                    fontSize: rf(16),
                    fontWeight: "500",
                    color: Colors.primary,
                  }}
                >
                  Register
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
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
