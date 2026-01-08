import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors, SPECIALISTS } from "@/constants";
import { DecorativeCircle } from "@/components";
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Scissors,
  Bell,
  CheckCircle,
  Info,
} from "lucide-react-native";
import { useAuth } from "@/contexts";
import { waitlistApi, stylistApi } from "@/api";

interface Staff {
  id: string;
  name: string;
}

// Hardcoded staff for fallback/merge
const HARDCODED_STAFF: Staff[] = SPECIALISTS.map(s => ({
  id: s.id,
  name: s.name,
}));

// Merge API data with hardcoded (API takes priority)
const mergeStaff = (apiData: Staff[], hardcodedData: Staff[]): Staff[] => {
  const merged = new Map<string, Staff>();
  hardcodedData.forEach(item => merged.set(item.id, item));
  apiData.forEach(item => merged.set(item.id, item));
  return Array.from(merged.values());
};

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

export default function JoinWaitlistScreen() {
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    serviceId?: string;
    serviceName?: string;
    salonId?: string;
    salonName?: string;
    staffId?: string;
    staffName?: string;
    date?: string;
  }>();

  const [selectedDate, setSelectedDate] = useState<string>(params.date || "");
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>(params.staffId);
  const [flexibleDates, setFlexibleDates] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Initialize with hardcoded staff
  const [availableStaff, setAvailableStaff] = useState<Staff[]>(HARDCODED_STAFF);

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
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

  // Fetch staff and merge with hardcoded
  useEffect(() => {
    const loadStaff = async () => {
      if (params.salonId) {
        try {
          // Call real API
          const response = await stylistApi.getStylistsBySalon(params.salonId);
          if (response.success && response.data && response.data.length > 0) {
            const apiStaff = response.data.map((s: any) => ({
              id: s.id || s._id,
              name: s.name || `${s.firstName} ${s.lastName}`,
            }));
            // Merge API data with hardcoded
            setAvailableStaff(mergeStaff(apiStaff, HARDCODED_STAFF));
          }
          // If API fails/empty, keep hardcoded (already set as initial state)
        } catch (error) {
          console.error('Error loading staff:', error);
          // Keep hardcoded on error
        }
      }
    };
    loadStaff();
  }, [params.salonId]);

  const toggleTimeSlot = (slot: string) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      Alert.alert("Missing Date", "Please select a preferred date.");
      return;
    }
    if (selectedTimeSlots.length === 0) {
      Alert.alert("Missing Time", "Please select at least one preferred time slot.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call real API
      const response = await waitlistApi.joinWaitlist({
        salonId: params.salonId || "salon-1",
        serviceId: params.serviceId || "service-1",
        staffId: selectedStaff || undefined,
        preferredDate: selectedDate,
        preferredTimeSlots: selectedTimeSlots,
        notifyVia: ["push"],
      });

      if (response.success && response.data) {
        Alert.alert(
          "Joined Waitlist!",
          `You are now #${response.data.position || 1} in the queue. We'll notify you when a slot opens up!`,
          [
            {
              text: "View Waitlist",
              onPress: () => router.replace("/waitlist" as any),
            },
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        // API failed - show error
        Alert.alert("Error", response.message || "Failed to join waitlist");
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Join Waitlist
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: wp(4), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info */}
        <View
          className="rounded-xl"
          style={{
            backgroundColor: Colors.salon.pinkLight,
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <View className="flex-row items-center" style={{ marginBottom: hp(1) }}>
            <Scissors size={rf(20)} color={Colors.primary} />
            <Text
              style={{
                fontSize: rf(18),
                fontWeight: "600",
                color: "#000",
                marginLeft: wp(2),
              }}
            >
              {params.serviceName || "Service"}
            </Text>
          </View>
          <Text style={{ fontSize: rf(14), color: Colors.gray[600] }}>
            at {params.salonName || "Salon Now"}
          </Text>
        </View>

        {/* Info Box */}
        <View
          className="flex-row rounded-xl"
          style={{
            backgroundColor: "#EFF6FF",
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <Info size={rf(20)} color="#3B82F6" style={{ marginRight: wp(3) }} />
          <Text style={{ fontSize: rf(13), color: "#1E40AF", flex: 1, lineHeight: rf(20) }}>
            Join the waitlist when your preferred time is fully booked. We'll notify you
            immediately when a slot opens up!
          </Text>
        </View>

        {/* Select Date */}
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
              Preferred Date
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

          {/* Flexible Dates Toggle */}
          <TouchableOpacity
            onPress={() => setFlexibleDates(!flexibleDates)}
            className="flex-row items-center"
            style={{ marginTop: hp(2) }}
          >
            <View
              className="items-center justify-center rounded"
              style={{
                width: wp(6),
                height: wp(6),
                backgroundColor: flexibleDates ? Colors.primary : "#F3F4F6",
                borderWidth: 1,
                borderColor: flexibleDates ? Colors.primary : Colors.gray[300],
              }}
            >
              {flexibleDates && <CheckCircle size={rf(14)} color="#fff" />}
            </View>
            <Text
              style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(2) }}
            >
              I'm flexible with nearby dates
            </Text>
          </TouchableOpacity>
        </View>

        {/* Select Time Slots */}
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
              Preferred Time Slots
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(2) }}>
              (Select multiple)
            </Text>
          </View>

          <View className="flex-row flex-wrap" style={{ gap: wp(2) }}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                onPress={() => toggleTimeSlot(slot)}
                className="rounded-full"
                style={{
                  backgroundColor: selectedTimeSlots.includes(slot)
                    ? Colors.primary
                    : "#F3F4F6",
                  paddingVertical: hp(1),
                  paddingHorizontal: wp(4),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    color: selectedTimeSlots.includes(slot) ? "#fff" : Colors.gray[600],
                    fontWeight: selectedTimeSlots.includes(slot) ? "600" : "400",
                  }}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Select Staff (Optional) */}
        {availableStaff.length > 0 && (
          <View style={{ marginBottom: hp(3) }}>
            <View className="flex-row items-center" style={{ marginBottom: hp(1.5) }}>
              <User size={rf(18)} color={Colors.primary} />
              <Text
                style={{
                  fontSize: rf(16),
                  fontWeight: "600",
                  color: "#000",
                  marginLeft: wp(2),
                }}
              >
                Preferred Stylist
              </Text>
              <Text style={{ fontSize: rf(12), color: Colors.gray[500], marginLeft: wp(2) }}>
                (Optional)
              </Text>
            </View>

            <View className="flex-row flex-wrap" style={{ gap: wp(2) }}>
              <TouchableOpacity
                onPress={() => setSelectedStaff(undefined)}
                className="rounded-full"
                style={{
                  backgroundColor: !selectedStaff ? Colors.primary : "#F3F4F6",
                  paddingVertical: hp(1),
                  paddingHorizontal: wp(4),
                }}
              >
                <Text
                  style={{
                    fontSize: rf(14),
                    color: !selectedStaff ? "#fff" : Colors.gray[600],
                    fontWeight: !selectedStaff ? "600" : "400",
                  }}
                >
                  Any Available
                </Text>
              </TouchableOpacity>
              {availableStaff.map((staff) => (
                <TouchableOpacity
                  key={staff.id}
                  onPress={() => setSelectedStaff(staff.id)}
                  className="rounded-full"
                  style={{
                    backgroundColor:
                      selectedStaff === staff.id ? Colors.primary : "#F3F4F6",
                    paddingVertical: hp(1),
                    paddingHorizontal: wp(4),
                  }}
                >
                  <Text
                    style={{
                      fontSize: rf(14),
                      color: selectedStaff === staff.id ? "#fff" : Colors.gray[600],
                      fontWeight: selectedStaff === staff.id ? "600" : "400",
                    }}
                  >
                    {staff.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={{ marginBottom: hp(3) }}>
          <Text
            style={{
              fontSize: rf(16),
              fontWeight: "600",
              color: "#000",
              marginBottom: hp(1.5),
            }}
          >
            Additional Notes
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or preferences..."
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
              minHeight: hp(12),
            }}
          />
        </View>

        {/* Notification Info */}
        <View
          className="flex-row items-center rounded-xl"
          style={{
            backgroundColor: "#FFFBEB",
            padding: wp(4),
            marginBottom: hp(3),
          }}
        >
          <Bell size={rf(20)} color="#F59E0B" style={{ marginRight: wp(3) }} />
          <Text style={{ fontSize: rf(13), color: "#92400E", flex: 1 }}>
            You'll receive a notification when a slot becomes available. You'll have
            5 minutes to confirm your booking!
          </Text>
        </View>
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
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="items-center justify-center rounded-xl"
          style={{
            backgroundColor: isSubmitting ? Colors.gray[300] : Colors.primary,
            paddingVertical: hp(2),
          }}
        >
          <Text style={{ fontSize: rf(17), fontWeight: "600", color: "#fff" }}>
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
