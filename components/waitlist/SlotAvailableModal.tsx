import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { Clock, Calendar, Scissors, X, CheckCircle } from "lucide-react-native";
import { WaitlistEntry } from "@/api/mockServer/types";

interface SlotAvailableModalProps {
  visible: boolean;
  entry: WaitlistEntry | null;
  onConfirm: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export const SlotAvailableModal: React.FC<SlotAvailableModalProps> = ({
  visible,
  entry,
  onConfirm,
  onSkip,
  onClose,
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("5:00");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!visible || !entry?.availableSlot?.expiresAt) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(entry.availableSlot!.expiresAt);
      const now = new Date();
      const diffMs = expiresAt.getTime() - now.getTime();

      if (diffMs <= 0) {
        setIsExpired(true);
        setTimeRemaining("0:00");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diffMs / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, entry]);

  if (!entry || !entry.availableSlot) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          className="rounded-3xl"
          style={{
            backgroundColor: "#fff",
            width: wp(90),
            padding: wp(6),
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute"
            style={{ top: wp(4), right: wp(4), zIndex: 10 }}
          >
            <X size={rf(24)} color={Colors.gray[400]} />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center" style={{ marginBottom: hp(3) }}>
            <View
              className="items-center justify-center rounded-full"
              style={{
                width: wp(20),
                height: wp(20),
                backgroundColor: Colors.salon.pinkLight,
                marginBottom: hp(2),
              }}
            >
              <CheckCircle size={rf(40)} color={Colors.primary} />
            </View>
            <Text
              style={{
                fontSize: rf(24),
                fontWeight: "700",
                color: "#000",
                textAlign: "center",
              }}
            >
              Slot Available!
            </Text>
            <Text
              style={{
                fontSize: rf(14),
                color: Colors.gray[500],
                textAlign: "center",
                marginTop: hp(0.5),
              }}
            >
              A slot has opened up for your waitlisted service
            </Text>
          </View>

          {/* Slot Details */}
          <View
            className="rounded-xl"
            style={{
              backgroundColor: Colors.salon.pinkBg,
              padding: wp(4),
              marginBottom: hp(2),
            }}
          >
            <View className="flex-row items-center" style={{ marginBottom: hp(1.5) }}>
              <Scissors size={rf(18)} color={Colors.primary} />
              <Text
                style={{
                  fontSize: rf(16),
                  fontWeight: "600",
                  color: "#000",
                  marginLeft: wp(2),
                }}
              >
                {entry.serviceName}
              </Text>
            </View>

            <View className="flex-row items-center" style={{ marginBottom: hp(1) }}>
              <Calendar size={rf(16)} color={Colors.gray[500]} />
              <Text
                style={{
                  fontSize: rf(15),
                  color: Colors.gray[600],
                  marginLeft: wp(2),
                }}
              >
                {entry.availableSlot.date}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Clock size={rf(16)} color={Colors.gray[500]} />
              <Text
                style={{
                  fontSize: rf(15),
                  color: Colors.gray[600],
                  marginLeft: wp(2),
                }}
              >
                {entry.availableSlot.time}
              </Text>
            </View>

            {entry.staffName && (
              <Text
                style={{
                  fontSize: rf(14),
                  color: Colors.gray[500],
                  marginTop: hp(1),
                }}
              >
                with {entry.staffName}
              </Text>
            )}
          </View>

          {/* Timer */}
          <View
            className="items-center rounded-xl"
            style={{
              backgroundColor: isExpired ? "#FEF2F2" : "#FFFBEB",
              padding: wp(3),
              marginBottom: hp(3),
            }}
          >
            <Text
              style={{
                fontSize: rf(12),
                color: isExpired ? "#EF4444" : "#F59E0B",
                fontWeight: "500",
              }}
            >
              {isExpired ? "This slot has expired" : "Time remaining to confirm"}
            </Text>
            <Text
              style={{
                fontSize: rf(32),
                fontWeight: "700",
                color: isExpired ? "#EF4444" : "#F59E0B",
              }}
            >
              {timeRemaining}
            </Text>
          </View>

          {/* Action Buttons */}
          {!isExpired ? (
            <View style={{ gap: hp(1.5) }}>
              <TouchableOpacity
                onPress={onConfirm}
                className="items-center justify-center rounded-xl"
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: hp(2),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(17),
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  Confirm & Book Now
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onSkip}
                className="items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "#F3F4F6",
                  paddingVertical: hp(2),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(17),
                    fontWeight: "500",
                    color: Colors.gray[600],
                  }}
                >
                  Skip (Pass to Next)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onClose}
              className="items-center justify-center rounded-xl"
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: hp(2),
              }}
            >
              <Text
                style={{
                  fontSize: rf(17),
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                Back to Waitlist
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default SlotAvailableModal;
