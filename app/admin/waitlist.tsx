import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import {
  ChevronLeft,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Phone,
  Calendar,
  Play,
} from "lucide-react-native";
import { waitlistService } from "@/api/waitlistService";
import { WaitlistEntry } from "@/api/mockServer/types";

type FilterType = "all" | "waiting" | "slot_available" | "confirmed" | "expired";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "waiting", label: "Waiting" },
  { value: "slot_available", label: "Available" },
  { value: "confirmed", label: "Confirmed" },
  { value: "expired", label: "Expired" },
];

const STATUS_CONFIG = {
  waiting: {
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    icon: Clock,
  },
  slot_available: {
    color: "#10B981",
    bgColor: "#ECFDF5",
    icon: CheckCircle,
  },
  confirmed: {
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    icon: CheckCircle,
  },
  expired: {
    color: "#6B7280",
    bgColor: "#F3F4F6",
    icon: XCircle,
  },
  cancelled: {
    color: "#EF4444",
    bgColor: "#FEF2F2",
    icon: XCircle,
  },
};

export default function AdminWaitlistScreen() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<WaitlistEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalWaiting: 0,
    avgWaitTime: 0,
    conversionRate: 0,
    byService: [] as { serviceId: string; serviceName: string; count: number }[],
  });

  const loadWaitlist = useCallback(async () => {
    try {
      const [entriesRes, statsRes] = await Promise.all([
        waitlistService.getAdminWaitlist("salon-1"),
        waitlistService.getWaitlistStats("salon-1", new Date().toISOString().split("T")[0]),
      ]);

      if (entriesRes.success) {
        setEntries(entriesRes.data);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error("Error loading waitlist:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWaitlist();
  }, [loadWaitlist]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter((e) => e.status === selectedFilter));
    }
  }, [selectedFilter, entries]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWaitlist();
  };

  const handleTriggerSlot = (entry: WaitlistEntry) => {
    Alert.alert(
      "Trigger Slot Available",
      `Send slot available notification to ${entry.serviceName} waitlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            try {
              const today = new Date();
              const slotDate = today.toISOString().split("T")[0];
              const slotTime = entry.preferredTimeSlots[0] || "10:00 AM";

              await waitlistService.simulateSlotAvailable(entry.id, slotDate, slotTime);
              Alert.alert("Success", "Slot available notification sent!");
              loadWaitlist();
            } catch (error) {
              console.error("Error triggering slot:", error);
              Alert.alert("Error", "Failed to send notification");
            }
          },
        },
      ]
    );
  };

  const handleContactCustomer = (entry: WaitlistEntry) => {
    Alert.alert(
      "Contact Customer",
      "Call or message this customer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Call customer") },
        { text: "Message", onPress: () => console.log("Message customer") },
      ]
    );
  };

  const renderWaitlistItem = ({ item }: { item: WaitlistEntry }) => {
    const config = STATUS_CONFIG[item.status];
    const StatusIcon = config.icon;

    return (
      <View
        className="rounded-xl"
        style={{
          backgroundColor: "#fff",
          marginBottom: hp(2),
          padding: wp(4),
          borderWidth: 1,
          borderColor: item.status === "waiting" ? Colors.primary : "#F3F4F6",
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
              {item.serviceName}
            </Text>
            <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.3) }}>
              Customer #{item.userId.slice(-4)}
            </Text>
          </View>

          {/* Status Badge */}
          <View
            className="flex-row items-center rounded-full"
            style={{
              backgroundColor: config.bgColor,
              paddingHorizontal: wp(3),
              paddingVertical: hp(0.5),
            }}
          >
            <StatusIcon size={rf(12)} color={config.color} />
            <Text
              style={{
                fontSize: rf(11),
                color: config.color,
                fontWeight: "600",
                marginLeft: wp(1),
              }}
            >
              {item.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View className="flex-row flex-wrap" style={{ marginTop: hp(1.5), gap: wp(3) }}>
          <View className="flex-row items-center">
            <Calendar size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
              {item.preferredDate}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
              {item.preferredTimeSlots[0]}
            </Text>
          </View>
          {item.staffName && (
            <View className="flex-row items-center">
              <Users size={rf(14)} color={Colors.gray[400]} />
              <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
                {item.staffName}
              </Text>
            </View>
          )}
        </View>

        {/* Position & Wait Info */}
        {item.status === "waiting" && (
          <View
            className="flex-row items-center justify-between rounded-lg"
            style={{ marginTop: hp(2), backgroundColor: "#F9FAFB", padding: wp(3) }}
          >
            <View>
              <Text style={{ fontSize: rf(11), color: Colors.gray[500] }}>Position</Text>
              <Text style={{ fontSize: rf(18), fontWeight: "700", color: Colors.primary }}>
                #{item.position}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: rf(11), color: Colors.gray[500] }}>Wait Time</Text>
              <Text style={{ fontSize: rf(14), fontWeight: "600", color: "#000" }}>
                {Math.floor((Date.now() - new Date(item.joinedAt).getTime()) / 60000)} min
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: rf(11), color: Colors.gray[500] }}>Joined</Text>
              <Text style={{ fontSize: rf(14), fontWeight: "600", color: "#000" }}>
                {new Date(item.joinedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {item.status === "waiting" && (
          <View className="flex-row" style={{ marginTop: hp(2), gap: wp(2) }}>
            <TouchableOpacity
              onPress={() => handleTriggerSlot(item)}
              className="flex-1 flex-row items-center justify-center rounded-xl"
              style={{ backgroundColor: Colors.primary, paddingVertical: hp(1.2) }}
            >
              <Play size={rf(16)} color="#fff" />
              <Text
                style={{ fontSize: rf(14), fontWeight: "600", color: "#fff", marginLeft: wp(1) }}
              >
                Trigger Slot
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleContactCustomer(item)}
              className="flex-row items-center justify-center rounded-xl"
              style={{
                backgroundColor: "#F3F4F6",
                paddingVertical: hp(1.2),
                paddingHorizontal: wp(4),
              }}
            >
              <Phone size={rf(16)} color={Colors.gray[600]} />
            </TouchableOpacity>
          </View>
        )}

        {/* Available Slot Info */}
        {item.status === "slot_available" && item.availableSlot && (
          <View
            className="rounded-lg"
            style={{ marginTop: hp(2), backgroundColor: "#ECFDF5", padding: wp(3) }}
          >
            <Text style={{ fontSize: rf(12), color: "#065F46" }}>
              Slot offered: {item.availableSlot.date} at {item.availableSlot.time}
            </Text>
            <Text style={{ fontSize: rf(11), color: "#065F46", marginTop: hp(0.5) }}>
              Expires: {new Date(item.availableSlot.expiresAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center" style={{ paddingTop: hp(10) }}>
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: wp(24),
          height: wp(24),
          backgroundColor: Colors.salon.pinkLight,
          marginBottom: hp(2),
        }}
      >
        <Users size={rf(40)} color={Colors.primary} />
      </View>
      <Text style={{ fontSize: rf(18), fontWeight: "600", color: "#000" }}>
        No Waitlist Entries
      </Text>
      <Text
        style={{
          fontSize: rf(14),
          color: Colors.gray[500],
          textAlign: "center",
          marginTop: hp(1),
          paddingHorizontal: wp(10),
        }}
      >
        When customers join the waitlist for fully booked slots, they'll appear here.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      {/* Header */}
      <View
        className="flex-row items-center"
        style={{ paddingTop: hp(6), paddingHorizontal: wp(4), paddingBottom: hp(2) }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: wp(2) }}>
          <ChevronLeft size={rf(28)} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: rf(22), fontWeight: "600", color: "#000", marginLeft: wp(2) }}>
          Waitlist Management
        </Text>
      </View>

      {/* Stats Cards */}
      <View
        className="flex-row"
        style={{ paddingHorizontal: wp(4), marginBottom: hp(2), gap: wp(2) }}
      >
        <View
          className="flex-1 rounded-xl items-center"
          style={{ backgroundColor: "#FFFBEB", paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#F59E0B" }}>
            {stats.totalWaiting}
          </Text>
          <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Waiting</Text>
        </View>
        <View
          className="flex-1 rounded-xl items-center"
          style={{ backgroundColor: "#ECFDF5", paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#10B981" }}>
            {entries.filter(e => e.status === "slot_available").length}
          </Text>
          <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Slots Open</Text>
        </View>
        <View
          className="flex-1 rounded-xl items-center"
          style={{ backgroundColor: "#EFF6FF", paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#3B82F6" }}>
            {Math.round(stats.conversionRate)}%
          </Text>
          <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Conversion</Text>
        </View>
        <View
          className="flex-1 rounded-xl items-center"
          style={{ backgroundColor: "#F3F4F6", paddingVertical: hp(2) }}
        >
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: Colors.gray[600] }}>
            {stats.avgWaitTime}m
          </Text>
          <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Avg Wait</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={{ paddingHorizontal: wp(4), marginBottom: hp(2) }}>
        <FlatList
          horizontal
          data={FILTERS}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ gap: wp(2) }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedFilter(item.value)}
              className="rounded-full"
              style={{
                paddingHorizontal: wp(4),
                paddingVertical: hp(1),
                backgroundColor: selectedFilter === item.value ? Colors.primary : "#F3F4F6",
              }}
            >
              <Text
                style={{
                  fontSize: rf(14),
                  color: selectedFilter === item.value ? "#fff" : Colors.gray[600],
                  fontWeight: selectedFilter === item.value ? "600" : "400",
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        renderItem={renderWaitlistItem}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
    </View>
  );
}
