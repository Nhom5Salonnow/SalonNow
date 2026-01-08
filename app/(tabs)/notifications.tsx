import { Colors, NotificationItem, DEFAULT_AVATAR } from "@/constants";
import { hp, rf, wp } from "@/utils/responsive";
import { NotificationCard } from "@/components/ui";
import { Menu, User, Bell, Check, Trash2 } from "lucide-react-native";
import { FlatList, Image, Text, TouchableOpacity, View, RefreshControl, Alert } from "react-native";
import { router } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/contexts";
import { notificationApi } from "@/api";

// Guest welcome notification
const GUEST_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "welcome",
    type: "feedback",
    title: "Welcome!",
    description: "We're so glad you're using our app. Log in to book appointments and get personalized recommendations!",
    time: "Just now",
    read: false,
  },
];

const getTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async (_userId: string) => {
    try {
      // Call real API
      const [apiNotifRes, apiCountRes] = await Promise.all([
        notificationApi.getNotifications(),
        notificationApi.getUnreadCount(),
      ]);

      if (apiNotifRes.success && apiNotifRes.data) {
        // Use API data
        setNotifications(apiNotifRes.data.map((n: any) => ({
          id: n.id || n._id,
          type: n.type as NotificationItem['type'],
          title: n.title,
          description: n.message || n.body,
          time: getTimeAgo(n.createdAt || n.created_at || new Date().toISOString()),
          read: n.read || n.is_read || false,
        })));
        setUnreadCount(apiCountRes.data?.count || 0);
      } else {
        // API returned no data - show empty
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      // On error - show empty
      setNotifications([]);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (isLoggedIn && user) {
        await loadNotifications(user.id || 'user-1');
      } else {
        setNotifications(GUEST_NOTIFICATIONS);
        setUnreadCount(0);
      }
      setIsLoading(false);
    };
    init();
  }, [isLoggedIn, user, loadNotifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (isLoggedIn && user) {
      await loadNotifications(user.id || 'user-1');
    }
    setIsRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    // Call real API
    const apiRes = await notificationApi.markAllAsRead();
    if (apiRes.success) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } else {
      Alert.alert('Error', apiRes.message || 'Failed to mark notifications as read');
    }
  };

  const handleClearAll = () => {
    if (!user) return;
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to delete all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            // Call real API
            const res = await notificationApi.deleteAllNotifications();
            if (res.success) {
              setNotifications([]);
              setUnreadCount(0);
            } else {
              Alert.alert('Error', res.message || 'Failed to clear notifications');
            }
          },
        },
      ]
    );
  };

  const isGuest = !isLoggedIn;
  const displayNotifications = isGuest ? GUEST_NOTIFICATIONS : notifications;

  const handleNotificationPress = (item: NotificationItem) => {
    // Navigate based on notification type
    switch (item.type) {
      case "appointment_confirm":
      case "appointment_update":
        router.push("/my-appointments" as any);
        break;
      case "feedback":
        router.push("/feedback" as any);
        break;
      default:
        break;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Decorative pink circle */}
      <View
        className="absolute rounded-full"
        style={{
          left: -150,
          top: -100,
          width: 300,
          height: 300,
          backgroundColor: Colors.salon.pinkLight,
          opacity: 0.5,
        }}
      />

      {/* Header */}
      <View
        className="flex-row items-center justify-between"
        style={{
          paddingHorizontal: wp(5),
          paddingTop: insets.top + hp(1),
          paddingBottom: hp(1),
        }}
      >
        {/* Left: Menu + Title */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/settings" as any)}
            style={{ padding: wp(2), marginLeft: -wp(2) }}
          >
            <Menu size={rf(24)} color={Colors.salon.dark} />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: rf(22),
              fontWeight: "600",
              color: Colors.salon.dark,
              marginLeft: wp(2),
            }}
          >
            Notifications
            {!isGuest && unreadCount > 0 && (
              <Text style={{ fontSize: rf(14), color: Colors.primary }}> ({unreadCount})</Text>
            )}
          </Text>
        </View>

        {/* Profile Avatar */}
        <TouchableOpacity
          onPress={() => router.push(isGuest ? "/auth/login" : "/profile" as any)}
          className="rounded-full overflow-hidden items-center justify-center"
          style={{
            width: wp(10),
            height: wp(10),
            backgroundColor: isGuest ? Colors.gray[200] : "transparent",
            borderWidth: 2,
            borderColor: Colors.salon.pinkLight,
          }}
        >
          {isGuest ? (
            <User size={rf(18)} color={Colors.gray[500]} />
          ) : (
            <Image
              source={{ uri: user?.avatar || DEFAULT_AVATAR }}
              className="w-full h-full"
              resizeMode="cover"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Action Bar - only show when logged in and has notifications */}
      {!isGuest && displayNotifications.length > 0 && (
        <View
          className="flex-row items-center justify-end"
          style={{
            paddingHorizontal: wp(5),
            paddingVertical: hp(1),
          }}
        >
          <View className="flex-row items-center" style={{ gap: wp(4) }}>
            <TouchableOpacity onPress={handleMarkAllRead} className="flex-row items-center">
              <Check size={rf(16)} color={Colors.primary} />
              <Text style={{ fontSize: rf(13), color: Colors.primary, marginLeft: wp(1) }}>
                Mark all read
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClearAll}>
              <Trash2 size={rf(18)} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Notification List */}
      <FlatList
        data={displayNotifications}
        renderItem={({ item }) => (
          <NotificationCard item={item} onPress={handleNotificationPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: wp(5),
          paddingBottom: hp(10),
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          !isGuest ? (
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          ) : undefined
        }
        ListEmptyComponent={
          !isGuest && !isLoading ? (
            <View className="items-center justify-center" style={{ paddingTop: hp(10) }}>
              <Bell size={rf(60)} color={Colors.gray[300]} />
              <Text style={{ fontSize: rf(18), fontWeight: '600', color: '#000', marginTop: hp(2) }}>
                No Notifications
              </Text>
              <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(1), textAlign: 'center' }}>
                You're all caught up! We'll notify you when something important happens.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isGuest ? (
            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
              className="items-center justify-center rounded-2xl"
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: hp(1.5),
                marginTop: hp(2),
              }}
            >
              <Text style={{ fontSize: rf(16), color: "#fff", fontWeight: "600" }}>
                Login Now
              </Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
