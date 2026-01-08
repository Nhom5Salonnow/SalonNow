import { Colors } from "@/constants";
import { DecorativeCircle, GuestPrompt } from "@/components";
import { hp, rf, wp } from "@/utils/responsive";
import { router } from "expo-router";
import {
  Calendar,
  ChevronRight,
  Clock,
  CreditCard,
  Edit3,
  Heart,
  History,
  LogOut,
  Settings,
  Star,
  User,
  Award,
} from "lucide-react-native";
import { useState, useCallback, useEffect } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { userService, UserStats } from "@/api/userService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts";

const menuItems = [
  {
    id: "appointments",
    title: "Appointment History",
    icon: Calendar,
    route: "/appointment-history",
    requiresAuth: true,
  },
  {
    id: "waitlist",
    title: "My Waitlist",
    icon: Clock,
    route: "/waitlist",
    requiresAuth: true,
  },
  {
    id: "payment-history",
    title: "Payment History",
    icon: History,
    route: "/payment-history",
    requiresAuth: true,
  },
  {
    id: "payment-methods",
    title: "Payment Methods",
    icon: CreditCard,
    route: "/payment-methods",
    requiresAuth: true,
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    route: "/settings",
    requiresAuth: false,
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn, isLoading: authLoading, logout } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadStats = useCallback(async (userId: string) => {
    try {
      setIsLoadingStats(true);
      const res = await userService.getUserStats(userId);
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadStats(user.id);
    } else {
      setStats(null);
    }
  }, [isLoggedIn, user?.id, loadStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (isLoggedIn && user?.id) {
      await loadStats(user.id);
    }
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            setStats(null);
          },
        },
      ]
    );
  };

  const handleMenuPress = (route: string | null, requiresAuth: boolean) => {
    if (requiresAuth && !isLoggedIn) {
      router.push('/auth/login' as any);
      return;
    }
    if (route) {
      router.push(route as any);
    }
  };

  const handleEditProfile = () => {
    if (!isLoggedIn) {
      router.push('/auth/login' as any);
      return;
    }
    router.push("/edit-profile" as any);
  };

  const formatMemberSince = (dateStr?: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (authLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="xlarge" opacity={0.4} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-between"
          style={{
            paddingHorizontal: wp(5),
            paddingTop: insets.top + hp(1),
            paddingBottom: hp(2),
          }}
        >
          <Text style={{ fontSize: rf(24), fontWeight: '600', color: Colors.salon.dark }}>
            Profile
          </Text>
          {isLoggedIn && (
            <TouchableOpacity
              onPress={handleEditProfile}
              className="rounded-full items-center justify-center"
              style={{ width: wp(10), height: wp(10), backgroundColor: Colors.salon.pinkBg }}
            >
              <Edit3 size={rf(18)} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Section */}
        <View
          className="items-center"
          style={{
            paddingTop: hp(2),
            paddingBottom: hp(3),
          }}
        >
          {/* Profile Image */}
          <View
            className="rounded-full overflow-hidden items-center justify-center"
            style={{
              width: wp(28),
              height: wp(28),
              borderWidth: 3,
              borderColor: Colors.salon.pinkLight,
              backgroundColor: isLoggedIn ? "transparent" : Colors.salon.pinkBg,
            }}
          >
            {isLoggedIn ? (
              <Image
                source={{
                  uri: user?.avatar || "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=400",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <User size={rf(48)} color={Colors.primary} />
            )}
          </View>

          {/* User Name */}
          <Text
            style={{
              fontSize: rf(22),
              fontWeight: "bold",
              color: Colors.salon.dark,
              marginTop: hp(1.5),
            }}
          >
            {isLoggedIn ? (user?.name || "User") : "Guest"}
          </Text>

          {/* User Email or Guest Message */}
          <Text
            style={{
              fontSize: rf(14),
              color: Colors.gray[500],
              marginTop: hp(0.3),
            }}
          >
            {isLoggedIn ? (user?.email || "") : "Sign in to access all features"}
          </Text>

          {/* Member Since (only for logged in users) */}
          {isLoggedIn && stats?.memberSince && (
            <View className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
              <Award size={rf(14)} color={Colors.gray[400]} />
              <Text style={{ fontSize: rf(12), color: Colors.gray[400], marginLeft: wp(1) }}>
                Member since {formatMemberSince(stats.memberSince)}
              </Text>
            </View>
          )}

          {/* Login/Register buttons for guest */}
          {!isLoggedIn && (
            <View style={{ marginTop: hp(3) }}>
              <GuestPrompt showButtons={true} message="" />
            </View>
          )}
        </View>

        {/* Stats Cards (only for logged in users) */}
        {isLoggedIn && (
          <View
            className="flex-row"
            style={{ paddingHorizontal: wp(5), gap: wp(3), marginBottom: hp(3) }}
          >
            {/* Loyalty Points */}
            <View
              className="flex-1 rounded-2xl items-center py-4"
              style={{ backgroundColor: Colors.salon.pinkBg }}
            >
              <View
                className="rounded-full items-center justify-center"
                style={{ width: wp(10), height: wp(10), backgroundColor: Colors.primary }}
              >
                <Star size={rf(18)} color="#FFF" />
              </View>
              <Text style={{ fontSize: rf(20), fontWeight: 'bold', color: Colors.salon.dark, marginTop: hp(1) }}>
                {stats?.loyaltyPoints || 0}
              </Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Points</Text>
            </View>

            {/* Appointments */}
            <View
              className="flex-1 rounded-2xl items-center py-4"
              style={{ backgroundColor: '#F0F9FF' }}
            >
              <View
                className="rounded-full items-center justify-center"
                style={{ width: wp(10), height: wp(10), backgroundColor: '#3B82F6' }}
              >
                <Calendar size={rf(18)} color="#FFF" />
              </View>
              <Text style={{ fontSize: rf(20), fontWeight: 'bold', color: Colors.salon.dark, marginTop: hp(1) }}>
                {stats?.completedAppointments || 0}
              </Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Visits</Text>
            </View>

            {/* Reviews Given */}
            <View
              className="flex-1 rounded-2xl items-center py-4"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <View
                className="rounded-full items-center justify-center"
                style={{ width: wp(10), height: wp(10), backgroundColor: '#F59E0B' }}
              >
                <Heart size={rf(18)} color="#FFF" />
              </View>
              <Text style={{ fontSize: rf(20), fontWeight: 'bold', color: Colors.salon.dark, marginTop: hp(1) }}>
                {stats?.reviewsGiven || 0}
              </Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Reviews</Text>
            </View>
          </View>
        )}

        {/* Total Spent Section (only for logged in users) */}
        {isLoggedIn && stats && stats.totalSpent > 0 && (
          <View
            className="mx-5 rounded-2xl p-4 flex-row items-center justify-between"
            style={{ backgroundColor: '#ECFDF5', marginBottom: hp(3) }}
          >
            <View>
              <Text style={{ fontSize: rf(13), color: '#059669' }}>Total Spent</Text>
              <Text style={{ fontSize: rf(24), fontWeight: 'bold', color: '#047857' }}>
                ${stats.totalSpent.toFixed(2)}
              </Text>
            </View>
            <View className="items-end">
              <Text style={{ fontSize: rf(12), color: '#059669' }}>Avg Rating Given</Text>
              <View className="flex-row items-center">
                <Star size={rf(16)} color="#F59E0B" fill="#F59E0B" />
                <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#047857', marginLeft: wp(1) }}>
                  {stats.averageRating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Favorite Services (only for logged in users) */}
        {isLoggedIn && stats && stats.favoriteServices.length > 0 && (
          <View style={{ paddingHorizontal: wp(5), marginBottom: hp(3) }}>
            <Text style={{ fontSize: rf(16), fontWeight: '600', color: Colors.salon.dark, marginBottom: hp(1.5) }}>
              Your Favorites
            </Text>
            <View className="flex-row flex-wrap" style={{ gap: wp(2) }}>
              {stats.favoriteServices.map((service, index) => (
                <View
                  key={service.serviceId}
                  className="rounded-full px-4 py-2 flex-row items-center"
                  style={{ backgroundColor: Colors.gray[100] }}
                >
                  <Text style={{ fontSize: rf(13), color: Colors.gray[600] }}>
                    {service.serviceName}
                  </Text>
                  <View
                    className="rounded-full ml-2 items-center justify-center"
                    style={{ width: wp(5), height: wp(5), backgroundColor: Colors.primary }}
                  >
                    <Text style={{ fontSize: rf(10), color: '#FFF', fontWeight: '600' }}>
                      {service.count}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View
          style={{
            paddingHorizontal: wp(5),
          }}
        >
          <Text style={{ fontSize: rf(16), fontWeight: '600', color: Colors.salon.dark, marginBottom: hp(1.5) }}>
            Quick Access
          </Text>

          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleMenuPress(item.route, item.requiresAuth)}
              className="flex-row items-center justify-between bg-white rounded-xl"
              style={{
                paddingVertical: hp(1.8),
                paddingHorizontal: wp(4),
                marginBottom: hp(1.2),
                borderWidth: 1,
                borderColor: Colors.gray[200],
                opacity: item.requiresAuth && !isLoggedIn ? 0.6 : 1,
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="rounded-full items-center justify-center"
                  style={{
                    width: wp(9),
                    height: wp(9),
                    backgroundColor: Colors.salon.pinkBg,
                    marginRight: wp(3),
                  }}
                >
                  <item.icon size={18} color={Colors.primary} />
                </View>
                <Text
                  style={{
                    fontSize: rf(15),
                    color: Colors.salon.dark,
                    fontWeight: "500",
                  }}
                >
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.gray[400]} />
            </TouchableOpacity>
          ))}

          {/* Logout Button (only for logged in users) */}
          {isLoggedIn && (
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center justify-center rounded-xl"
              style={{
                paddingVertical: hp(1.8),
                marginTop: hp(2),
                backgroundColor: '#FEF2F2',
              }}
            >
              <LogOut size={18} color="#EF4444" />
              <Text
                style={{
                  fontSize: rf(15),
                  color: "#EF4444",
                  fontWeight: "600",
                  marginLeft: wp(2),
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: hp(12) }} />
      </ScrollView>
    </View>
  );
}
