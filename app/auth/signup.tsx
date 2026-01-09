import { Colors } from "@/constants";
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
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useAuth } from "@/contexts";

export default function SignupScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await register(name, email, password, phone);

      if (result.success) {
        router.replace("/home" as any);
        return;
      }

      setError(result.message || "Registration failed. Please try again.");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: "login" | "signup") => {
    if (tab === "login") {
      router.replace("/auth/login" as any);
    }
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800",
        }}
        className="flex-1"
        resizeMode="cover"
        blurRadius={3}
      >
        <View
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />

        <SafeAreaView className="flex-1">
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
              <Text
                style={{
                  fontSize: rf(32),
                  fontWeight: "bold",
                  color: Colors.salon.dark,
                  textAlign: "center",
                  marginBottom: hp(1),
                }}
              >
                Salon Now
              </Text>

              <Text
                style={{
                  fontSize: rf(14),
                  color: Colors.gray[600],
                  textAlign: "center",
                  marginBottom: hp(3),
                  paddingHorizontal: wp(5),
                }}
              >
                Register to unlock a seamless beauty experience tailored just for you.
              </Text>

            <View
              className="bg-white/90 rounded-3xl w-full"
              style={{
                paddingHorizontal: wp(5),
                paddingVertical: hp(4),
                maxWidth: wp(90),
                alignSelf: "center",
              }}
            >
              <View className="flex-row items-center" style={{ marginBottom: hp(3) }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleTabChange("login")}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                    paddingVertical: hp(2),
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: Colors.primary,
                    marginRight: wp(2),
                  }}
                >
                  <Text
                    style={{
                      fontSize: rf(16),
                      fontWeight: "500",
                      color: Colors.primary,
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
                    backgroundColor: Colors.primary,
                    paddingVertical: hp(2),
                    borderRadius: 16,
                  }}
                >
                  <Text
                    style={{
                      fontSize: rf(16),
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

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

              <View
                className="bg-white rounded-xl border"
                style={{
                  borderColor: Colors.salon.coral,
                  marginBottom: hp(2),
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

              <TouchableOpacity
                onPress={handleSignup}
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
                    Register
                  </Text>
                )}
              </TouchableOpacity>
            </View>

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
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
