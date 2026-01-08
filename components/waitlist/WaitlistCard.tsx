import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { Clock, Calendar, User, ChevronRight, AlertCircle } from "lucide-react-native";

// Local interface for WaitlistCard props (compatible with both screen and API types)
interface WaitlistEntryData {
  id: string;
  salonName?: string;
  serviceName?: string;
  staffName?: string;
  preferredDate: string;
  preferredTimeSlots?: string[];
  status: 'waiting' | 'slot_available' | 'confirmed' | 'expired' | 'cancelled' | 'notified' | 'booked';
  position?: number;
  availableSlot?: { date: string; time: string; notifiedAt?: string; expiresAt?: string };
  expiresAt?: string;
}

interface WaitlistCardProps {
  entry: WaitlistEntryData;
  onPress: () => void;
  onConfirm?: () => void;
  onSkip?: () => void;
}

const STATUS_CONFIG: Record<WaitlistEntryData['status'], { color: string; bgColor: string; label: string }> = {
  waiting: {
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    label: "Waiting",
  },
  slot_available: {
    color: "#10B981",
    bgColor: "#ECFDF5",
    label: "Slot Available!",
  },
  confirmed: {
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "Confirmed",
  },
  expired: {
    color: "#6B7280",
    bgColor: "#F3F4F6",
    label: "Expired",
  },
  cancelled: {
    color: "#EF4444",
    bgColor: "#FEF2F2",
    label: "Cancelled",
  },
  notified: {
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    label: "Notified",
  },
  booked: {
    color: "#059669",
    bgColor: "#D1FAE5",
    label: "Booked",
  },
};

export const WaitlistCard: React.FC<WaitlistCardProps> = ({
  entry,
  onPress,
  onConfirm,
  onSkip,
}) => {
  const statusConfig = STATUS_CONFIG[entry.status];
  const isSlotAvailable = entry.status === "slot_available";

  // Calculate time remaining for slot
  const getTimeRemaining = () => {
    if (!entry.availableSlot?.expiresAt) return null;
    const expiresAt = new Date(entry.availableSlot.expiresAt);
    const now = new Date();
    const diffMs = expiresAt.getTime() - now.getTime();
    if (diffMs <= 0) return "Expired";
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl"
      style={{
        backgroundColor: isSlotAvailable ? Colors.salon.pinkLight : "#fff",
        marginBottom: hp(2),
        padding: wp(4),
        borderWidth: isSlotAvailable ? 2 : 1,
        borderColor: isSlotAvailable ? Colors.primary : "#F3F4F6",
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text style={{ fontSize: rf(17), fontWeight: "600", color: "#000" }}>
            {entry.serviceName}
          </Text>
          <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.3) }}>
            {entry.salonName}
          </Text>
        </View>

        {/* Status Badge */}
        <View
          className="rounded-full flex-row items-center"
          style={{
            backgroundColor: statusConfig.bgColor,
            paddingHorizontal: wp(3),
            paddingVertical: hp(0.5),
          }}
        >
          {isSlotAvailable && (
            <AlertCircle size={rf(12)} color={statusConfig.color} style={{ marginRight: wp(1) }} />
          )}
          <Text style={{ fontSize: rf(12), color: statusConfig.color, fontWeight: "600" }}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      {/* Info Row */}
      <View className="flex-row items-center" style={{ marginTop: hp(1.5) }}>
        <View className="flex-row items-center" style={{ marginRight: wp(4) }}>
          <Calendar size={rf(14)} color={Colors.gray[400]} />
          <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
            {entry.preferredDate}
          </Text>
        </View>
        <View className="flex-row items-center" style={{ marginRight: wp(4) }}>
          <Clock size={rf(14)} color={Colors.gray[400]} />
          <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
            {(entry.preferredTimeSlots || []).join(", ")}
          </Text>
        </View>
        {entry.staffName && (
          <View className="flex-row items-center">
            <User size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
              {entry.staffName}
            </Text>
          </View>
        )}
      </View>

      {/* Position / Slot Available Info */}
      {entry.status === "waiting" && (
        <View
          className="flex-row items-center justify-between rounded-lg"
          style={{ marginTop: hp(2), backgroundColor: "#F9FAFB", padding: wp(3) }}
        >
          <View>
            <Text style={{ fontSize: rf(12), color: Colors.gray[500] }}>Your Position</Text>
            <Text style={{ fontSize: rf(24), fontWeight: "700", color: Colors.primary }}>
              #{entry.position}
            </Text>
          </View>
          <ChevronRight size={rf(20)} color={Colors.gray[400]} />
        </View>
      )}

      {/* Slot Available Actions */}
      {isSlotAvailable && entry.availableSlot && (
        <View style={{ marginTop: hp(2) }}>
          {/* Slot Info */}
          <View
            className="rounded-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.8)", padding: wp(3), marginBottom: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginBottom: hp(0.5) }}>
              Available Slot
            </Text>
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
              {entry.availableSlot.date} at {entry.availableSlot.time}
            </Text>
            <View className="flex-row items-center" style={{ marginTop: hp(0.5) }}>
              <Clock size={rf(12)} color={Colors.primary} />
              <Text style={{ fontSize: rf(12), color: Colors.primary, fontWeight: "600", marginLeft: wp(1) }}>
                Expires in {getTimeRemaining()}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row" style={{ gap: wp(2) }}>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 items-center justify-center rounded-xl"
              style={{ backgroundColor: Colors.primary, paddingVertical: hp(1.5) }}
            >
              <Text style={{ fontSize: rf(15), fontWeight: "600", color: "#fff" }}>
                Book Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSkip}
              className="items-center justify-center rounded-xl"
              style={{ backgroundColor: "#F3F4F6", paddingVertical: hp(1.5), paddingHorizontal: wp(4) }}
            >
              <Text style={{ fontSize: rf(15), fontWeight: "500", color: Colors.gray[600] }}>
                Skip
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default WaitlistCard;
