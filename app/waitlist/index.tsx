import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { router } from "expo-router";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { WaitlistCard, SlotAvailableModal } from "@/components/waitlist";
import { ChevronLeft, Clock, Plus } from "lucide-react-native";
import { waitlistService } from "@/api/waitlistService";
import { WaitlistEntry } from "@/api/mockServer/types";
import { useAuth } from "@/contexts";

type FilterType = "all" | "waiting" | "slot_available" | "confirmed" | "expired";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "waiting", label: "Waiting" },
  { value: "slot_available", label: "Available" },
  { value: "confirmed", label: "Confirmed" },
  { value: "expired", label: "Expired" },
];

export default function WaitlistScreen() {
  const { user } = useAuth();
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<WaitlistEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal state
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [showSlotModal, setShowSlotModal] = useState(false);

  const loadWaitlist = useCallback(async () => {
    try {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const response = await waitlistService.getUserWaitlist(user.id || "user-1");

      if (response.success) {
        setWaitlistEntries(response.data);
      }
    } catch (error) {
      console.error("Error loading waitlist:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadWaitlist();
  }, [loadWaitlist]);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredEntries(waitlistEntries);
    } else {
      setFilteredEntries(waitlistEntries.filter(e => e.status === selectedFilter));
    }
  }, [selectedFilter, waitlistEntries]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWaitlist();
  };

  const handleEntryPress = (entry: WaitlistEntry) => {
    if (entry.status === "slot_available") {
      setSelectedEntry(entry);
      setShowSlotModal(true);
    } else {
      router.push(`/waitlist/${entry.id}` as any);
    }
  };

  const handleConfirm = async () => {
    if (!selectedEntry) return;

    try {
      const userId = user?.id || "user-1";

      const response = await waitlistService.confirmSlot(selectedEntry.id, userId);

      if (response.success && response.data.appointmentId) {
        setShowSlotModal(false);
        router.push("/payment");
      }
    } catch (error) {
      console.error("Error confirming slot:", error);
    }
  };

  const handleSkip = async () => {
    if (!selectedEntry) return;

    try {
      const userId = user?.id || "user-1";

      await waitlistService.skipSlot(selectedEntry.id, userId);
      setShowSlotModal(false);
      loadWaitlist();
    } catch (error) {
      console.error("Error skipping slot:", error);
    }
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
        <Clock size={rf(40)} color={Colors.primary} />
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
        When your preferred time slot is full, join the waitlist to get notified when it opens up!
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/home")}
        className="flex-row items-center rounded-xl"
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: hp(1.5),
          paddingHorizontal: wp(6),
          marginTop: hp(3),
        }}
      >
        <Plus size={rf(18)} color="#fff" />
        <Text style={{ fontSize: rf(15), fontWeight: "600", color: "#fff", marginLeft: wp(2) }}>
          Book a Service
        </Text>
      </TouchableOpacity>
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
          My Waitlist
        </Text>
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

      {/* Stats Summary */}
      {waitlistEntries.length > 0 && (
        <View
          className="flex-row"
          style={{ paddingHorizontal: wp(4), marginBottom: hp(2), gap: wp(3) }}
        >
          <View
            className="flex-1 rounded-xl items-center"
            style={{ backgroundColor: "#FFFBEB", paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(20), fontWeight: "700", color: "#F59E0B" }}>
              {waitlistEntries.filter(e => e.status === "waiting").length}
            </Text>
            <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Waiting</Text>
          </View>
          <View
            className="flex-1 rounded-xl items-center"
            style={{ backgroundColor: "#ECFDF5", paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(20), fontWeight: "700", color: "#10B981" }}>
              {waitlistEntries.filter(e => e.status === "slot_available").length}
            </Text>
            <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Available</Text>
          </View>
          <View
            className="flex-1 rounded-xl items-center"
            style={{ backgroundColor: "#EFF6FF", paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(20), fontWeight: "700", color: "#3B82F6" }}>
              {waitlistEntries.filter(e => e.status === "confirmed").length}
            </Text>
            <Text style={{ fontSize: rf(11), color: Colors.gray[600] }}>Confirmed</Text>
          </View>
        </View>
      )}

      {/* Waitlist List */}
      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <WaitlistCard
            entry={item}
            onPress={() => handleEntryPress(item)}
            onConfirm={() => {
              setSelectedEntry(item);
              handleConfirm();
            }}
            onSkip={() => {
              setSelectedEntry(item);
              handleSkip();
            }}
          />
        )}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />

      {/* Slot Available Modal */}
      <SlotAvailableModal
        visible={showSlotModal}
        entry={selectedEntry}
        onConfirm={handleConfirm}
        onSkip={handleSkip}
        onClose={() => setShowSlotModal(false)}
      />
    </View>
  );
}
