import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
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
  Edit3,
  RefreshCw,
} from "lucide-react-native";
import { bookingApi } from "@/api/bookingApi";
import { useAuth } from "@/contexts";

const STATUS_CONFIG: Record<string, {color: string; bgColor: string; label: string; icon: any}> = {
  pending: {
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    label: "Pending Confirmation",
    icon: Clock,
  },
  confirmed: {
    color: "#10B981",
    bgColor: "#ECFDF5",
    label: "Confirmed",
    icon: CheckCircle,
  },
  in_progress: {
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    label: "In Progress",
    icon: Clock,
  },
  completed: {
    color: "#6B7280",
    bgColor: "#F3F4F6",
    label: "Completed",
    icon: CheckCircle,
  },
  cancelled: {
    color: "#EF4444",
    bgColor: "#FEF2F2",
    label: "Cancelled",
    icon: XCircle,
  },
  no_show: {
    color: "#EF4444",
    bgColor: "#FEF2F2",
    label: "No Show",
    icon: AlertCircle,
  },
};

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAppointment = useCallback(async () => {
    if (!id) return;

    try {
      // Try real API first
      const response = await bookingApi.getBookingById(id);

      if (response.success && response.data && response.data.id) {
        // Map API response to display format
        const booking = response.data;
        setAppointment({
          id: booking.id,
          userId: booking.userId,
          serviceName: booking.serviceName || booking.service?.name || 'Service',
          salonName: booking.salonName || booking.salon?.name || 'Salon',
          staffName: booking.stylistName || (booking.stylist ? `${booking.stylist.firstName} ${booking.stylist.lastName}` : undefined),
          date: booking.date || (booking.startTime ? new Date(booking.startTime).toLocaleDateString() : ''),
          time: booking.time || (booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
          status: booking.status,
          price: booking.price || booking.totalPrice || booking.service?.price || 60,
          servicePrice: booking.service?.price,
          total: booking.total || booking.totalPrice || booking.price,
          tax: 5,
          hasReview: booking.hasReview,
        });
      } else {
        // API returned no data - show not found
        console.log('API returned no data');
        setAppointment(null);
      }
    } catch (error) {
      console.error("Error loading appointment:", error);
      // On error - show not found (don't crash)
      setAppointment(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAppointment();
  }, [loadAppointment]);

  const canModify = () => {
    if (!appointment) return false;
    return ["pending", "confirmed"].includes(appointment.status);
  };

  const handleCancel = async () => {
    if (!appointment) return;

    setIsSubmitting(true);

    try {
      // Try real API
      const apiResponse = await bookingApi.cancelBooking(appointment.id);

      if (apiResponse.success) {
        setShowCancelModal(false);
        Alert.alert(
          "Appointment Cancelled",
          "Your appointment has been cancelled successfully.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        // API failed - show error
        Alert.alert("Error", apiResponse.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Error cancelling:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReschedule = () => {
    router.push({
      pathname: "/appointment/reschedule",
      params: { appointmentId: appointment.id },
    } as any);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>Loading...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>
          Appointment not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: hp(2) }}>
          <Text style={{ fontSize: rf(16), color: Colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      {/* Header */}
      <View
        className="flex-row items-center justify-between"
        style={{ paddingTop: hp(6), paddingHorizontal: wp(4), paddingBottom: hp(2) }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} style={{ padding: wp(2) }}>
            <ChevronLeft size={rf(28)} color="#000" />
          </TouchableOpacity>
          <Text style={{ fontSize: rf(22), fontWeight: "600", color: "#000", marginLeft: wp(2) }}>
            Appointment Details
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Banner */}
        <View
          className="flex-row items-center rounded-xl"
          style={{
            backgroundColor: statusConfig.bgColor,
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <StatusIcon size={rf(24)} color={statusConfig.color} />
          <View style={{ marginLeft: wp(3), flex: 1 }}>
            <Text
              style={{
                fontSize: rf(16),
                fontWeight: "600",
                color: statusConfig.color,
              }}
            >
              {statusConfig.label}
            </Text>
            {appointment.status === "pending" && (
              <Text style={{ fontSize: rf(12), color: statusConfig.color, marginTop: hp(0.3) }}>
                Waiting for salon confirmation
              </Text>
            )}
          </View>
        </View>

        {/* Service Details Card */}
        <View
          className="rounded-xl"
          style={{
            backgroundColor: Colors.salon.pinkLight,
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <View className="flex-row items-start">
            <Scissors size={rf(24)} color={Colors.primary} style={{ marginTop: hp(0.3) }} />
            <View style={{ marginLeft: wp(3), flex: 1 }}>
              <Text style={{ fontSize: rf(20), fontWeight: "700", color: "#000" }}>
                {appointment.serviceName}
              </Text>
              <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginTop: hp(0.5) }}>
                at {appointment.salonName}
              </Text>
            </View>
          </View>

          <View
            className="flex-row"
            style={{
              marginTop: hp(3),
              paddingTop: hp(2),
              borderTopWidth: 1,
              borderTopColor: "rgba(0,0,0,0.1)",
            }}
          >
            <View className="flex-1">
              <View className="flex-row items-center">
                <Calendar size={rf(16)} color={Colors.primary} />
                <Text
                  style={{
                    fontSize: rf(15),
                    fontWeight: "600",
                    color: "#000",
                    marginLeft: wp(2),
                  }}
                >
                  {appointment.date}
                </Text>
              </View>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(6) }}>
                Date
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Clock size={rf(16)} color={Colors.primary} />
                <Text
                  style={{
                    fontSize: rf(15),
                    fontWeight: "600",
                    color: "#000",
                    marginLeft: wp(2),
                  }}
                >
                  {appointment.time}
                </Text>
              </View>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(6) }}>
                Time
              </Text>
            </View>
          </View>

          {appointment.staffName && (
            <View className="flex-row items-center" style={{ marginTop: hp(2) }}>
              <User size={rf(16)} color={Colors.primary} />
              <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(2) }}>
                with {appointment.staffName}
              </Text>
            </View>
          )}
        </View>

        {/* Salon Info */}
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
            SALON INFORMATION
          </Text>

          <View className="flex-row items-start" style={{ marginBottom: hp(1.5) }}>
            <MapPin size={rf(18)} color={Colors.gray[400]} style={{ marginTop: hp(0.2) }} />
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(2), flex: 1 }}>
              123 Beauty Street, New York, NY 10001
            </Text>
          </View>

          <View className="flex-row items-center">
            <Phone size={rf(18)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(14), color: Colors.primary, marginLeft: wp(2) }}>
              (555) 123-4567
            </Text>
          </View>
        </View>

        {/* Price Summary */}
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
            PRICE DETAILS
          </Text>

          <View className="flex-row justify-between" style={{ marginBottom: hp(1) }}>
            <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>
              {appointment.serviceName}
            </Text>
            <Text style={{ fontSize: rf(14), color: "#000" }}>
              ${appointment.price || appointment.servicePrice || 60}
            </Text>
          </View>

          <View className="flex-row justify-between" style={{ marginBottom: hp(1) }}>
            <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>Tax</Text>
            <Text style={{ fontSize: rf(14), color: "#000" }}>
              ${appointment.tax || 5}
            </Text>
          </View>

          <View
            className="flex-row justify-between"
            style={{
              paddingTop: hp(1.5),
              marginTop: hp(1),
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>Total</Text>
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: Colors.primary }}>
              ${appointment.total || (appointment.price || 60) + 5}
            </Text>
          </View>
        </View>

        {/* Cancellation Policy */}
        {canModify() && (
          <View
            className="rounded-xl"
            style={{ backgroundColor: "#FEF3C7", padding: wp(4), marginBottom: hp(3) }}
          >
            <View className="flex-row items-start">
              <AlertCircle size={rf(18)} color="#F59E0B" style={{ marginTop: hp(0.2) }} />
              <View style={{ marginLeft: wp(2), flex: 1 }}>
                <Text style={{ fontSize: rf(14), fontWeight: "600", color: "#92400E" }}>
                  Cancellation Policy
                </Text>
                <Text style={{ fontSize: rf(13), color: "#92400E", marginTop: hp(0.5) }}>
                  Free cancellation up to 24 hours before your appointment. Late
                  cancellations may incur a 50% fee.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {canModify() && (
          <View style={{ gap: hp(1.5) }}>
            <TouchableOpacity
              onPress={handleReschedule}
              className="flex-row items-center justify-center rounded-xl"
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: hp(2),
              }}
            >
              <RefreshCw size={rf(18)} color="#fff" />
              <Text
                style={{
                  fontSize: rf(16),
                  fontWeight: "600",
                  color: "#fff",
                  marginLeft: wp(2),
                }}
              >
                Reschedule Appointment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowCancelModal(true)}
              className="flex-row items-center justify-center rounded-xl"
              style={{
                backgroundColor: "#FEF2F2",
                paddingVertical: hp(2),
              }}
            >
              <XCircle size={rf(18)} color="#EF4444" />
              <Text
                style={{
                  fontSize: rf(16),
                  fontWeight: "600",
                  color: "#EF4444",
                  marginLeft: wp(2),
                }}
              >
                Cancel Appointment
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed - Leave Review */}
        {appointment.status === "completed" && !appointment.hasReview && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/feedback",
                params: { appointmentId: appointment.id },
              } as any)
            }
            className="flex-row items-center justify-center rounded-xl"
            style={{
              backgroundColor: Colors.primary,
              paddingVertical: hp(2),
            }}
          >
            <Edit3 size={rf(18)} color="#fff" />
            <Text
              style={{
                fontSize: rf(16),
                fontWeight: "600",
                color: "#fff",
                marginLeft: wp(2),
              }}
            >
              Leave a Review
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-2xl"
            style={{ backgroundColor: "#fff", width: wp(85), padding: wp(6) }}
          >
            <Text
              style={{
                fontSize: rf(20),
                fontWeight: "700",
                color: "#000",
                textAlign: "center",
              }}
            >
              Cancel Appointment?
            </Text>

            <Text
              style={{
                fontSize: rf(14),
                color: Colors.gray[500],
                textAlign: "center",
                marginTop: hp(1),
              }}
            >
              Are you sure you want to cancel this appointment? This action cannot be
              undone.
            </Text>

            <View style={{ marginTop: hp(3) }}>
              <Text style={{ fontSize: rf(14), fontWeight: "500", color: "#000", marginBottom: hp(1) }}>
                Reason (optional)
              </Text>
              <TextInput
                value={cancelReason}
                onChangeText={setCancelReason}
                placeholder="Tell us why you're cancelling..."
                placeholderTextColor={Colors.gray[400]}
                multiline
                numberOfLines={3}
                className="rounded-xl"
                style={{
                  backgroundColor: "#F9FAFB",
                  padding: wp(4),
                  fontSize: rf(14),
                  color: "#000",
                  textAlignVertical: "top",
                  minHeight: hp(10),
                }}
              />
            </View>

            <View className="flex-row" style={{ marginTop: hp(3), gap: wp(3) }}>
              <TouchableOpacity
                onPress={() => setShowCancelModal(false)}
                className="flex-1 items-center justify-center rounded-xl"
                style={{ backgroundColor: "#F3F4F6", paddingVertical: hp(1.5) }}
              >
                <Text style={{ fontSize: rf(15), fontWeight: "600", color: Colors.gray[600] }}>
                  Keep Appointment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isSubmitting}
                className="flex-1 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: isSubmitting ? Colors.gray[300] : "#EF4444",
                  paddingVertical: hp(1.5),
                }}
              >
                <Text style={{ fontSize: rf(15), fontWeight: "600", color: "#fff" }}>
                  {isSubmitting ? "Cancelling..." : "Cancel It"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
