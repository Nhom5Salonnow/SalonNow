import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
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
  Scissors,
  CheckCircle,
} from "lucide-react-native";
import { appointmentService } from "@/api/appointmentService";
import { mockDatabase } from "@/api/mockServer/database";
import { useAuth } from "@/contexts";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

export default function RescheduleScreen() {
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);

  // Generate next 14 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return days;
  };

  const days = getNextDays();

  useEffect(() => {
    if (params.appointmentId) {
      const appt = mockDatabase.appointments.find((a) => a.id === params.appointmentId);
      if (appt) {
        setAppointment(appt);
      }
    }
  }, [params.appointmentId]);

  useEffect(() => {
    // Simulate checking available slots for selected date
    if (selectedDate && appointment) {
      const bookedSlots = mockDatabase.appointments
        .filter(
          (a) =>
            a.id !== appointment.id &&
            a.salonId === appointment.salonId &&
            a.date === selectedDate &&
            ["pending", "confirmed"].includes(a.status)
        )
        .map((a) => a.time);

      const available = TIME_SLOTS.filter((slot) => !bookedSlots.includes(slot));
      setAvailableSlots(available);

      // Clear selected time if not available in new date
      if (!available.includes(selectedTime)) {
        setSelectedTime("");
      }
    }
  }, [selectedDate, appointment]);

  const handleReschedule = async () => {
    if (!selectedDate) {
      Alert.alert("Select Date", "Please select a new date for your appointment.");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Select Time", "Please select a new time for your appointment.");
      return;
    }
    if (!appointment) return;

    setIsSubmitting(true);

    try {
      const userId = user?.id || "user-1";

      const response = await appointmentService.rescheduleAppointment({
        appointmentId: appointment.id,
        userId: userId,
        newDate: selectedDate,
        newTime: selectedTime,
        reason: reason || undefined,
      });

      if (response.success) {
        Alert.alert(
          "Appointment Rescheduled!",
          `Your appointment has been rescheduled to ${selectedDate} at ${selectedTime}.`,
          [
            {
              text: "View Appointment",
              onPress: () => router.replace(`/appointment/${appointment.id}` as any),
            },
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.error || "Failed to reschedule appointment");
      }
    } catch (error) {
      console.error("Error rescheduling:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!appointment) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>Loading...</Text>
      </View>
    );
  }

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
          Reschedule
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Appointment Info */}
        <View
          className="rounded-xl"
          style={{
            backgroundColor: Colors.salon.pinkLight,
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginBottom: hp(1) }}>
            CURRENT APPOINTMENT
          </Text>
          <View className="flex-row items-center">
            <Scissors size={rf(18)} color={Colors.primary} />
            <Text
              style={{
                fontSize: rf(16),
                fontWeight: "600",
                color: "#000",
                marginLeft: wp(2),
              }}
            >
              {appointment.serviceName}
            </Text>
          </View>
          <View className="flex-row items-center" style={{ marginTop: hp(1) }}>
            <Calendar size={rf(14)} color={Colors.gray[500]} />
            <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(2) }}>
              {appointment.date} at {appointment.time}
            </Text>
          </View>
        </View>

        {/* Select New Date */}
        <View style={{ marginBottom: hp(3) }}>
          <View className="flex-row items-center" style={{ marginBottom: hp(1.5) }}>
            <Calendar size={rf(18)} color={Colors.primary} />
            <Text
              style={{
                fontSize: rf(16),
                fontWeight: "600",
                color: "#000",
                marginLeft: wp(2),
              }}
            >
              Select New Date
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: wp(2) }}
          >
            {days.map((day) => (
              <TouchableOpacity
                key={day.date}
                onPress={() => setSelectedDate(day.date)}
                className="items-center rounded-xl"
                style={{
                  backgroundColor:
                    selectedDate === day.date ? Colors.primary : "#F3F4F6",
                  paddingVertical: hp(1.5),
                  paddingHorizontal: wp(4),
                  minWidth: wp(18),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(12),
                    color: selectedDate === day.date ? "#fff" : Colors.gray[500],
                  }}
                >
                  {day.dayName}
                </Text>
                <Text
                  style={{
                    fontSize: rf(20),
                    fontWeight: "700",
                    color: selectedDate === day.date ? "#fff" : "#000",
                  }}
                >
                  {day.dayNum}
                </Text>
                <Text
                  style={{
                    fontSize: rf(11),
                    color: selectedDate === day.date ? "#fff" : Colors.gray[500],
                  }}
                >
                  {day.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Select New Time */}
        {selectedDate && (
          <View style={{ marginBottom: hp(3) }}>
            <View className="flex-row items-center" style={{ marginBottom: hp(1.5) }}>
              <Clock size={rf(18)} color={Colors.primary} />
              <Text
                style={{
                  fontSize: rf(16),
                  fontWeight: "600",
                  color: "#000",
                  marginLeft: wp(2),
                }}
              >
                Select New Time
              </Text>
            </View>

            {availableSlots.length === 0 ? (
              <View
                className="rounded-xl items-center justify-center"
                style={{ backgroundColor: "#FEF2F2", padding: wp(4) }}
              >
                <Text style={{ fontSize: rf(14), color: "#EF4444", textAlign: "center" }}>
                  No available slots for this date. Please select another date.
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap" style={{ gap: wp(2) }}>
                {TIME_SLOTS.map((slot) => {
                  const isAvailable = availableSlots.includes(slot);
                  const isSelected = selectedTime === slot;

                  return (
                    <TouchableOpacity
                      key={slot}
                      onPress={() => isAvailable && setSelectedTime(slot)}
                      disabled={!isAvailable}
                      className="rounded-xl items-center justify-center"
                      style={{
                        backgroundColor: isSelected
                          ? Colors.primary
                          : isAvailable
                          ? "#F3F4F6"
                          : "#E5E7EB",
                        paddingVertical: hp(1.2),
                        paddingHorizontal: wp(4),
                        opacity: isAvailable ? 1 : 0.5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: rf(14),
                          color: isSelected ? "#fff" : isAvailable ? "#000" : Colors.gray[400],
                          fontWeight: isSelected ? "600" : "400",
                        }}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Reason (Optional) */}
        <View style={{ marginBottom: hp(3) }}>
          <Text
            style={{
              fontSize: rf(16),
              fontWeight: "600",
              color: "#000",
              marginBottom: hp(1.5),
            }}
          >
            Reason for Rescheduling (Optional)
          </Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="Tell us why you're rescheduling..."
            placeholderTextColor={Colors.gray[400]}
            multiline
            numberOfLines={3}
            className="rounded-xl"
            style={{
              backgroundColor: "#F9FAFB",
              padding: wp(4),
              fontSize: rf(15),
              color: "#000",
              textAlignVertical: "top",
              minHeight: hp(10),
            }}
          />
        </View>

        {/* Summary */}
        {selectedDate && selectedTime && (
          <View
            className="rounded-xl"
            style={{
              backgroundColor: "#ECFDF5",
              padding: wp(4),
              marginBottom: hp(3),
            }}
          >
            <View className="flex-row items-center" style={{ marginBottom: hp(1) }}>
              <CheckCircle size={rf(18)} color="#10B981" />
              <Text
                style={{
                  fontSize: rf(14),
                  fontWeight: "600",
                  color: "#065F46",
                  marginLeft: wp(2),
                }}
              >
                New Appointment Time
              </Text>
            </View>
            <Text style={{ fontSize: rf(18), fontWeight: "700", color: "#065F46" }}>
              {selectedDate}
            </Text>
            <Text style={{ fontSize: rf(16), color: "#065F46" }}>{selectedTime}</Text>
          </View>
        )}
      </ScrollView>

      {/* Submit Button */}
      <View
        className="border-t"
        style={{
          borderTopColor: "#F3F4F6",
          padding: wp(4),
          paddingBottom: hp(4),
        }}
      >
        <TouchableOpacity
          onPress={handleReschedule}
          disabled={isSubmitting || !selectedDate || !selectedTime}
          className="items-center justify-center rounded-xl"
          style={{
            backgroundColor:
              isSubmitting || !selectedDate || !selectedTime
                ? Colors.gray[300]
                : Colors.primary,
            paddingVertical: hp(2),
          }}
        >
          <Text style={{ fontSize: rf(17), fontWeight: "600", color: "#fff" }}>
            {isSubmitting ? "Rescheduling..." : "Confirm New Time"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
