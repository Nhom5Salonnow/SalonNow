import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { ChevronDown, Clock, CheckCircle, XCircle, AlertCircle, Check, X, User } from "lucide-react-native";
import { adminService } from "@/api/adminService";
import { Appointment } from "@/api/mockServer/types";

type FilterStatus = "all" | "confirmed" | "pending" | "completed" | "cancelled";

const SALON_ID = "salon-1";

const STATUS_CONFIG = {
  confirmed: { color: "#10B981", bgColor: "#ECFDF5", icon: CheckCircle, label: "Confirmed" },
  pending: { color: "#F59E0B", bgColor: "#FFFBEB", icon: AlertCircle, label: "Pending" },
  completed: { color: "#6B7280", bgColor: "#F3F4F6", icon: CheckCircle, label: "Completed" },
  cancelled: { color: "#EF4444", bgColor: "#FEF2F2", icon: XCircle, label: "Cancelled" },
  no_show: { color: "#6B7280", bgColor: "#F3F4F6", icon: XCircle, label: "No-Show" },
};

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminAppointmentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAppointments = useCallback(async () => {
    try {
      const filters = selectedFilter !== "all" ? { status: [selectedFilter] } : undefined;
      const res = await adminService.getAppointments(SALON_ID, filters);
      if (res.success && res.data) {
        setAppointments(res.data);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
    }
  }, [selectedFilter]);

  useEffect(() => {
    const init = async () => {
      await loadAppointments();
      setIsLoading(false);
    };
    init();
  }, [loadAppointments]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAppointments();
    setIsRefreshing(false);
  };

  const handleUpdateStatus = async (
    appointmentId: string,
    newStatus: "confirmed" | "cancelled" | "completed" | "no_show"
  ) => {
    const statusLabels: Record<string, string> = {
      confirmed: "Confirm",
      cancelled: "Cancel",
      completed: "Complete",
      no_show: "Mark No-Show",
    };

    Alert.alert(
      `${statusLabels[newStatus]} Appointment`,
      `Are you sure you want to ${statusLabels[newStatus].toLowerCase()} this appointment?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: statusLabels[newStatus],
          style: newStatus === "cancelled" || newStatus === "no_show" ? "destructive" : "default",
          onPress: async () => {
            const res = await adminService.updateAppointmentStatus(appointmentId, newStatus);
            if (res.success) {
              await loadAppointments();
            }
          },
        },
      ]
    );
  };

  const renderAppointment = ({ item }: { item: Appointment }) => {
    const apt = item as any;
    const statusConfig = STATUS_CONFIG[apt.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const StatusIcon = statusConfig.icon;

    return (
      <View
        className="rounded-xl"
        style={{
          backgroundColor: "#fff",
          marginBottom: hp(1.5),
          padding: wp(4),
          borderWidth: 1,
          borderColor: "#F3F4F6",
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className="rounded-full items-center justify-center"
              style={{ width: wp(12), height: wp(12), backgroundColor: Colors.salon.pinkBg }}
            >
              <User size={rf(20)} color={Colors.primary} />
            </View>
            <View style={{ marginLeft: wp(3) }}>
              <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
                {apt.serviceName}
              </Text>
              <Text style={{ fontSize: rf(13), color: Colors.gray[500] }}>
                with {apt.staffName || "Any Staff"}
              </Text>
            </View>
          </View>
          <View
            className="flex-row items-center rounded-full"
            style={{ backgroundColor: statusConfig.bgColor, paddingHorizontal: wp(2.5), paddingVertical: hp(0.4) }}
          >
            <StatusIcon size={rf(12)} color={statusConfig.color} />
            <Text style={{ fontSize: rf(11), color: statusConfig.color, marginLeft: wp(1), fontWeight: "500" }}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View
          className="flex-row items-center justify-between"
          style={{ marginTop: hp(2), paddingTop: hp(1.5), borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
        >
          <View className="flex-row items-center">
            <Clock size={rf(14)} color={Colors.gray[400]} />
            <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
              {apt.date} • {apt.time}
            </Text>
          </View>
          <Text style={{ fontSize: rf(16), fontWeight: "600", color: Colors.primary }}>
            ${apt.total || apt.price || 0}
          </Text>
        </View>

        {/* Actions for pending */}
        {apt.status === "pending" && (
          <View
            className="flex-row items-center justify-between"
            style={{ marginTop: hp(1.5), paddingTop: hp(1.5), borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
          >
            <TouchableOpacity
              onPress={() => handleUpdateStatus(apt.id, "confirmed")}
              className="flex-1 flex-row items-center justify-center rounded-xl py-2 mr-2"
              style={{ backgroundColor: "#ECFDF5" }}
            >
              <Check size={rf(16)} color="#10B981" />
              <Text style={{ fontSize: rf(13), fontWeight: "600", color: "#10B981", marginLeft: wp(1) }}>
                Confirm
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateStatus(apt.id, "cancelled")}
              className="flex-1 flex-row items-center justify-center rounded-xl py-2 ml-2"
              style={{ backgroundColor: "#FEF2F2" }}
            >
              <X size={rf(16)} color="#EF4444" />
              <Text style={{ fontSize: rf(13), fontWeight: "600", color: "#EF4444", marginLeft: wp(1) }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Actions for confirmed */}
        {apt.status === "confirmed" && (
          <View
            className="flex-row items-center justify-between"
            style={{ marginTop: hp(1.5), paddingTop: hp(1.5), borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
          >
            <TouchableOpacity
              onPress={() => handleUpdateStatus(apt.id, "completed")}
              className="flex-1 flex-row items-center justify-center rounded-xl py-2 mr-2"
              style={{ backgroundColor: "#ECFDF5" }}
            >
              <CheckCircle size={rf(16)} color="#10B981" />
              <Text style={{ fontSize: rf(13), fontWeight: "600", color: "#10B981", marginLeft: wp(1) }}>
                Complete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleUpdateStatus(apt.id, "no_show")}
              className="flex-1 flex-row items-center justify-center rounded-xl py-2 ml-2"
              style={{ backgroundColor: Colors.gray[100] }}
            >
              <XCircle size={rf(16)} color={Colors.gray[500]} />
              <Text style={{ fontSize: rf(13), fontWeight: "600", color: Colors.gray[500], marginLeft: wp(1) }}>
                No-Show
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      {/* Header */}
      <View style={{ paddingTop: hp(6), paddingHorizontal: wp(6) }}>
        <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#000" }}>
          Appointments
        </Text>
        <Text style={{ fontSize: rf(14), color: Colors.gray[500], marginTop: hp(0.5) }}>
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: hp(2) }}
        contentContainerStyle={{ paddingHorizontal: wp(6), gap: wp(2) }}
      >
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setSelectedFilter(option.value)}
            className="rounded-full"
            style={{
              paddingHorizontal: wp(4),
              paddingVertical: hp(1),
              backgroundColor: selectedFilter === option.value ? Colors.primary : "#F3F4F6",
            }}
          >
            <Text
              style={{
                fontSize: rf(14),
                color: selectedFilter === option.value ? "#fff" : Colors.gray[600],
                fontWeight: selectedFilter === option.value ? "600" : "400",
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Appointments List */}
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: wp(6), paddingTop: hp(2), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center" style={{ paddingTop: hp(10) }}>
            <Text style={{ fontSize: rf(16), color: Colors.gray[500] }}>
              No appointments found
            </Text>
          </View>
        }
      />
    </View>
  );
}
