import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { WaitlistPosition } from "@/components/waitlist";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Scissors,
  MapPin,
  Phone,
  XCircle,
  CheckCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react-native";
import { useAuth } from "@/contexts";
import { waitlistApi } from "@/api";

interface WaitlistEntry {
  id: string;
  salonName: string;
  serviceName: string;
  staffName?: string;
  preferredDate: string;
  preferredTimeSlots: string[];
  position: number;
  status: 'waiting' | 'slot_available' | 'confirmed' | 'expired' | 'cancelled' | 'notified' | 'booked';
  availableSlot?: { date: string; time: string; notifiedAt?: string; expiresAt?: string };
  expiresAt?: string;
  createdAt: string;
}

export default function WaitlistDetailScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<WaitlistEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadEntry = useCallback(async () => {
    if (!id) return;

    try {
      const response = await waitlistApi.getWaitlistEntry(id);
      if (response.success && response.data) {
        const w = response.data;
        setEntry({
          id: w.id,
          salonName: w.salonName || w.salon?.name || 'Salon',
          serviceName: w.serviceName || w.service?.name || 'Service',
          staffName: w.staffName || w.staff?.name,
          preferredDate: w.preferredDate,
          preferredTimeSlots: w.preferredTimeSlots || [],
          position: w.position || 1,
          status: w.status || 'waiting',
          availableSlot: w.availableSlot,
          expiresAt: w.expiresAt,
          createdAt: w.createdAt || new Date().toISOString(),
        });
      } else {
        setEntry(null);
      }
    } catch (error) {
      console.error("Error loading waitlist entry:", error);
      setEntry(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadEntry();
  }, [loadEntry]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadEntry();
  };

  const handleCancel = () => {
    Alert.alert(
      "Leave Waitlist",
      "Are you sure you want to leave this waitlist? You'll lose your position.",
      [
        { text: "No, Keep My Spot", style: "cancel" },
        {
          text: "Yes, Leave",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await waitlistApi.cancelWaitlist(id!);
              if (response.success) {
                Alert.alert("Left Waitlist", "You've been removed from the waitlist.", [
                  { text: "OK", onPress: () => router.back() },
                ]);
              } else {
                Alert.alert("Error", response.message || "Failed to leave waitlist");
              }
            } catch (error) {
              console.error("Error cancelling:", error);
              Alert.alert("Error", "Failed to leave waitlist");
            }
          },
        },
      ]
    );
  };

  const handleConfirmSlot = async () => {
    if (!entry?.availableSlot) return;

    try {
      const response = await waitlistApi.confirmSlot(entry.id);
      if (response.success) {
        Alert.alert(
          "Slot Confirmed!",
          "Your appointment has been booked. Proceed to payment.",
          [{ text: "Pay Now", onPress: () => router.push("/payment") }]
        );
      }
    } catch (error) {
      console.error("Error confirming slot:", error);
      Alert.alert("Error", "Failed to confirm slot");
    }
  };

  const handleSkipSlot = async () => {
    Alert.alert(
      "Skip This Slot?",
      "The slot will be offered to the next person in line. You'll stay on the waitlist for future slots.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          onPress: async () => {
            try {
              const response = await waitlistApi.skipSlot(entry!.id);
              if (response.success) {
                loadEntry();
              } else {
                Alert.alert("Error", response.message || "Failed to skip slot");
              }
            } catch (error) {
              console.error("Error skipping slot:", error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  const getStatusInfo = () => {
    switch (entry?.status) {
      case "waiting":
        return {
          icon: <Clock size={rf(20)} color="#F59E0B" />,
          label: "Waiting in Queue",
          description: "We'll notify you when a slot opens up",
          bgColor: "#FFFBEB",
          textColor: "#92400E",
        };
      case "slot_available":
        return {
          icon: <CheckCircle size={rf(20)} color="#10B981" />,
          label: "Slot Available!",
          description: "A slot has opened up - confirm now!",
          bgColor: "#ECFDF5",
          textColor: "#065F46",
        };
      case "confirmed":
        return {
          icon: <CheckCircle size={rf(20)} color="#3B82F6" />,
          label: "Confirmed",
          description: "Your slot has been confirmed",
          bgColor: "#EFF6FF",
          textColor: "#1E40AF",
        };
      case "expired":
        return {
          icon: <AlertCircle size={rf(20)} color="#6B7280" />,
          label: "Expired",
          description: "The available slot has expired",
          bgColor: "#F3F4F6",
          textColor: "#374151",
        };
      default:
        return {
          icon: <XCircle size={rf(20)} color="#EF4444" />,
          label: "Cancelled",
          description: "You've left the waitlist",
          bgColor: "#FEF2F2",
          textColor: "#991B1B",
        };
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>Loading...</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>Entry not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: hp(2) }}>
          <Text style={{ fontSize: rf(16), color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      <View
        className="flex-row items-center justify-between"
        style={{ paddingTop: hp(6), paddingHorizontal: wp(4), paddingBottom: hp(2) }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} style={{ padding: wp(2) }}>
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(22), fontWeight: "600", color: "#000", marginLeft: wp(2) }}>
            Waitlist Details
          </Text>
        </View>
        {entry.status === "waiting" && (
          <TouchableOpacity onPress={handleCancel} style={{ padding: wp(2) }}>
            <MoreVertical size={rf(24)} color={Colors.gray[600]} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View
          className="flex-row items-center rounded-xl"
          style={{
            backgroundColor: statusInfo.bgColor,
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          {statusInfo.icon}
          <View style={{ marginLeft: wp(3), flex: 1 }}>
            <Text
              style={{
                fontSize: rf(16),
                fontWeight: "600",
                color: statusInfo.textColor,
              }}
            >
              {statusInfo.label}
            </Text>
            <Text style={{ fontSize: rf(13), color: statusInfo.textColor, marginTop: hp(0.3) }}>
              {statusInfo.description}
            </Text>
          </View>
        </View>

        {entry.status === "waiting" && (
          <View style={{ marginBottom: hp(3) }}>
            <WaitlistPosition
              position={entry.position || 1}
              totalInQueue={5}
              estimatedWaitMinutes={30}
            />
          </View>
        )}

        {entry.status === "slot_available" && entry.availableSlot && (
          <View
            className="rounded-xl"
            style={{
              backgroundColor: Colors.salon.pinkLight,
              padding: wp(4),
              marginBottom: hp(3),
              borderWidth: 2,
              borderColor: Colors.primary,
            }}
          >
            <Text
              style={{
                fontSize: rf(14),
                color: Colors.gray[600],
                marginBottom: hp(1),
              }}
            >
              Your slot is ready!
            </Text>
            <Text style={{ fontSize: rf(20), fontWeight: "700", color: "#000" }}>
              {entry.availableSlot.date}
            </Text>
            <Text style={{ fontSize: rf(18), color: "#000", marginTop: hp(0.5) }}>
              {entry.availableSlot.time}
            </Text>

            <View
              className="rounded-lg items-center"
              style={{ backgroundColor: "#FFFBEB", padding: wp(3), marginTop: hp(2) }}
            >
              <Text style={{ fontSize: rf(12), color: "#F59E0B" }}>
                Time remaining to confirm
              </Text>
              <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#F59E0B" }}>
                5:00
              </Text>
            </View>

            <View className="flex-row" style={{ gap: wp(2), marginTop: hp(2) }}>
              <TouchableOpacity
                onPress={handleConfirmSlot}
                className="flex-1 items-center justify-center rounded-xl"
                style={{ backgroundColor: Colors.primary, paddingVertical: hp(1.5) }}
              >
                <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#fff" }}>
                  Confirm & Book
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSkipSlot}
                className="items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "#F3F4F6",
                  paddingVertical: hp(1.5),
                  paddingHorizontal: wp(4),
                }}
              >
                <Text style={{ fontSize: rf(16), fontWeight: "500", color: Colors.gray[600] }}>
                  Skip
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View
          className="rounded-xl"
          style={{
            backgroundColor: "#F9FAFB",
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <Text
            style={{
              fontSize: rf(14),
              fontWeight: "600",
              color: Colors.gray[500],
              marginBottom: hp(2),
            }}
          >
            SERVICE DETAILS
          </Text>

          <View className="flex-row items-start" style={{ marginBottom: hp(2) }}>
            <Scissors size={rf(18)} color={Colors.primary} style={{ marginTop: hp(0.2) }} />
            <View style={{ marginLeft: wp(3), flex: 1 }}>
              <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
                {entry.serviceName}
              </Text>
              <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(0.3) }}>
                {entry.salonName}
              </Text>
            </View>
          </View>

          {entry.staffName && (
            <View className="flex-row items-center" style={{ marginBottom: hp(2) }}>
              <User size={rf(18)} color={Colors.primary} />
              <Text style={{ fontSize: rf(15), color: Colors.gray[600], marginLeft: wp(3) }}>
                with {entry.staffName}
              </Text>
            </View>
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              paddingTop: hp(2),
            }}
          >
            <Text
              style={{
                fontSize: rf(14),
                fontWeight: "600",
                color: Colors.gray[500],
                marginBottom: hp(1.5),
              }}
            >
              PREFERRED TIME
            </Text>
            <View className="flex-row items-center" style={{ marginBottom: hp(1) }}>
              <Calendar size={rf(16)} color={Colors.gray[400]} />
              <Text style={{ fontSize: rf(15), color: "#000", marginLeft: wp(2) }}>
                {entry.preferredDate}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={rf(16)} color={Colors.gray[400]} />
              <Text style={{ fontSize: rf(15), color: "#000", marginLeft: wp(2) }}>
                {entry.preferredTimeSlots.join(", ")}
              </Text>
            </View>
            {entry.preferredTimeSlots.length > 2 && (
              <Text
                style={{
                  fontSize: rf(13),
                  color: Colors.primary,
                  marginTop: hp(1),
                }}
              >
                Multiple time slots selected
              </Text>
            )}
          </View>

        </View>

        <View
          className="rounded-xl"
          style={{ backgroundColor: "#F9FAFB", padding: wp(4), marginBottom: hp(3) }}
        >
          <Text
            style={{
              fontSize: rf(14),
              fontWeight: "600",
              color: Colors.gray[500],
              marginBottom: hp(2),
            }}
          >
            SALON CONTACT
          </Text>

          <View className="flex-row items-center" style={{ marginBottom: hp(1.5) }}>
            <MapPin size={rf(16)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(2), flex: 1 }}>
              123 Beauty Street, New York, NY 10001
            </Text>
          </View>

          <View className="flex-row items-center">
            <Phone size={rf(16)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(14), color: Colors.primary, marginLeft: wp(2) }}>
              (555) 123-4567
            </Text>
          </View>
        </View>

        <View
          className="rounded-xl"
          style={{ backgroundColor: "#F9FAFB", padding: wp(4) }}
        >
          <Text
            style={{
              fontSize: rf(14),
              fontWeight: "600",
              color: Colors.gray[500],
              marginBottom: hp(2),
            }}
          >
            ACTIVITY
          </Text>

          <View className="flex-row">
            <View style={{ width: wp(5), alignItems: "center" }}>
              <View
                className="rounded-full"
                style={{
                  width: wp(3),
                  height: wp(3),
                  backgroundColor: Colors.primary,
                }}
              />
              <View
                style={{
                  width: 2,
                  flex: 1,
                  backgroundColor: Colors.gray[300],
                  marginVertical: hp(0.5),
                }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: wp(2), paddingBottom: hp(2) }}>
              <Text style={{ fontSize: rf(14), fontWeight: "500", color: "#000" }}>
                Joined Waitlist
              </Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginTop: hp(0.3) }}>
                {new Date(entry.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>

          {entry.availableSlot?.notifiedAt && (
            <View className="flex-row">
              <View style={{ width: wp(5), alignItems: "center" }}>
                <View
                  className="rounded-full"
                  style={{
                    width: wp(3),
                    height: wp(3),
                    backgroundColor: "#10B981",
                  }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: wp(2) }}>
                <Text style={{ fontSize: rf(14), fontWeight: "500", color: "#000" }}>
                  Slot Available Notification
                </Text>
                <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginTop: hp(0.3) }}>
                  {new Date(entry.availableSlot.notifiedAt).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {entry.status === "waiting" && (
        <View
          className="border-t"
          style={{
            borderTopColor: "#F3F4F6",
            padding: wp(4),
            paddingBottom: hp(4),
          }}
        >
          <TouchableOpacity
            onPress={handleCancel}
            className="items-center justify-center rounded-xl"
            style={{
              backgroundColor: "#FEF2F2",
              paddingVertical: hp(2),
            }}
          >
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#EF4444" }}>
              Leave Waitlist
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
