import { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { Plus, Edit2, Phone, Mail, Star, Clock, MoreVertical } from "lucide-react-native";

interface Staff {
  id: string;
  name: string;
  role: string;
  avatar: string;
  phone: string;
  email: string;
  rating: number;
  totalAppointments: number;
  specialties: string[];
  workingHours: string;
  isActive: boolean;
}

const STAFF_MEMBERS: Staff[] = [
  {
    id: "1",
    name: "Emily Chen",
    role: "Senior Stylist",
    avatar: "https://i.pravatar.cc/200?img=1",
    phone: "+1 234 567 8901",
    email: "emily@salon.com",
    rating: 4.9,
    totalAppointments: 1250,
    specialties: ["Hair Cut", "Hair Color", "Styling"],
    workingHours: "Mon-Sat 9AM-6PM",
    isActive: true
  },
  {
    id: "2",
    name: "John Doe",
    role: "Barber",
    avatar: "https://i.pravatar.cc/200?img=3",
    phone: "+1 234 567 8902",
    email: "john@salon.com",
    rating: 4.7,
    totalAppointments: 980,
    specialties: ["Men's Cut", "Beard Trim", "Shaving"],
    workingHours: "Tue-Sun 10AM-7PM",
    isActive: true
  },
  {
    id: "3",
    name: "Lucy Han",
    role: "Nail Technician",
    avatar: "https://i.pravatar.cc/200?img=5",
    phone: "+1 234 567 8903",
    email: "lucy@salon.com",
    rating: 4.8,
    totalAppointments: 850,
    specialties: ["Manicure", "Pedicure", "Nail Art"],
    workingHours: "Mon-Fri 9AM-5PM",
    isActive: true
  },
  {
    id: "4",
    name: "Mike Wilson",
    role: "Massage Therapist",
    avatar: "https://i.pravatar.cc/200?img=8",
    phone: "+1 234 567 8904",
    email: "mike@salon.com",
    rating: 4.6,
    totalAppointments: 620,
    specialties: ["Deep Tissue", "Swedish", "Sports Massage"],
    workingHours: "Wed-Sun 11AM-8PM",
    isActive: false
  },
  {
    id: "5",
    name: "Sarah Park",
    role: "Junior Stylist",
    avatar: "https://i.pravatar.cc/200?img=9",
    phone: "+1 234 567 8905",
    email: "sarah@salon.com",
    rating: 4.5,
    totalAppointments: 320,
    specialties: ["Hair Cut", "Blow Dry"],
    workingHours: "Mon-Sat 10AM-6PM",
    isActive: true
  },
];

export default function AdminStaffScreen() {
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredStaff = showActiveOnly
    ? STAFF_MEMBERS.filter((s) => s.isActive)
    : STAFF_MEMBERS;

  const renderStaffCard = ({ item }: { item: Staff }) => (
    <View
      className="rounded-xl"
      style={{
        backgroundColor: "#fff",
        marginBottom: hp(2),
        padding: wp(4),
        borderWidth: 1,
        borderColor: "#F3F4F6",
        opacity: item.isActive ? 1 : 0.7,
      }}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.avatar }}
          style={{ width: wp(20), height: wp(20), borderRadius: wp(10) }}
        />
        <View style={{ flex: 1, marginLeft: wp(4) }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text style={{ fontSize: rf(18), fontWeight: "600", color: "#000" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: rf(14), color: Colors.gray[500] }}>
                {item.role}
              </Text>
            </View>
            <TouchableOpacity>
              <MoreVertical size={rf(20)} color={Colors.gray[400]} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center" style={{ marginTop: hp(1) }}>
            <Star size={rf(14)} color="#F59E0B" fill="#F59E0B" />
            <Text style={{ fontSize: rf(14), color: "#000", fontWeight: "500", marginLeft: wp(1) }}>
              {item.rating}
            </Text>
            <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginLeft: wp(2) }}>
              ({item.totalAppointments} appointments)
            </Text>
          </View>

          <View className="flex-row flex-wrap" style={{ marginTop: hp(1), gap: wp(1.5) }}>
            {item.specialties.map((specialty, index) => (
              <View
                key={index}
                className="rounded-full"
                style={{ backgroundColor: Colors.salon.pinkLight, paddingHorizontal: wp(2.5), paddingVertical: hp(0.3) }}
              >
                <Text style={{ fontSize: rf(11), color: Colors.primary }}>
                  {specialty}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View
        className="flex-row items-center justify-between"
        style={{ marginTop: hp(2), paddingTop: hp(2), borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
      >
        <View className="flex-row items-center">
          <Clock size={rf(14)} color={Colors.gray[400]} />
          <Text style={{ fontSize: rf(12), color: Colors.gray[600], marginLeft: wp(1) }}>
            {item.workingHours}
          </Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{ backgroundColor: "#F3F4F6", width: wp(9), height: wp(9), marginRight: wp(2) }}
          >
            <Phone size={rf(16)} color={Colors.gray[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{ backgroundColor: "#F3F4F6", width: wp(9), height: wp(9), marginRight: wp(2) }}
          >
            <Mail size={rf(16)} color={Colors.gray[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center rounded-full"
            style={{ backgroundColor: Colors.salon.pinkLight, width: wp(9), height: wp(9) }}
          >
            <Edit2 size={rf(16)} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {!item.isActive && (
        <View
          className="absolute rounded-bl-xl rounded-tr-xl"
          style={{
            top: 0,
            right: 0,
            backgroundColor: Colors.gray[200],
            paddingHorizontal: wp(3),
            paddingVertical: hp(0.5),
          }}
        >
          <Text style={{ fontSize: rf(11), color: Colors.gray[600], fontWeight: "500" }}>
            Inactive
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      {/* Header */}
      <View style={{ paddingTop: hp(6), paddingHorizontal: wp(6) }}>
        <View className="flex-row items-center justify-between">
          <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#000" }}>
            Staff Members
          </Text>
          <TouchableOpacity
            className="flex-row items-center rounded-full"
            style={{ backgroundColor: Colors.primary, paddingHorizontal: wp(4), paddingVertical: hp(1) }}
          >
            <Plus size={rf(18)} color="#fff" />
            <Text style={{ fontSize: rf(14), color: "#fff", fontWeight: "500", marginLeft: wp(1) }}>
              Add Staff
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Toggle */}
        <TouchableOpacity
          onPress={() => setShowActiveOnly(!showActiveOnly)}
          className="flex-row items-center"
          style={{ marginTop: hp(2) }}
        >
          <View
            className="rounded items-center justify-center"
            style={{
              width: wp(5),
              height: wp(5),
              borderWidth: 2,
              borderColor: showActiveOnly ? Colors.primary : Colors.gray[300],
              backgroundColor: showActiveOnly ? Colors.primary : "transparent",
            }}
          >
            {showActiveOnly && <Text style={{ color: "#fff", fontSize: rf(10) }}>✓</Text>}
          </View>
          <Text style={{ fontSize: rf(14), color: Colors.gray[600], marginLeft: wp(2) }}>
            Show active staff only
          </Text>
        </TouchableOpacity>

        {/* Stats Summary */}
        <View className="flex-row" style={{ marginTop: hp(2), gap: wp(3) }}>
          <View
            className="flex-1 rounded-xl items-center"
            style={{ backgroundColor: Colors.salon.pinkLight, paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(22), fontWeight: "700", color: "#000" }}>
              {STAFF_MEMBERS.filter((s) => s.isActive).length}
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[600] }}>Active</Text>
          </View>
          <View
            className="flex-1 rounded-xl items-center"
            style={{ backgroundColor: "#F3F4F6", paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(22), fontWeight: "700", color: "#000" }}>
              {STAFF_MEMBERS.length}
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[600] }}>Total</Text>
          </View>
          <View
            className="flex-1 rounded-xl items-center"
            style={{ backgroundColor: "#ECFDF5", paddingVertical: hp(1.5) }}
          >
            <Text style={{ fontSize: rf(22), fontWeight: "700", color: "#10B981" }}>
              {(STAFF_MEMBERS.reduce((acc, s) => acc + s.rating, 0) / STAFF_MEMBERS.length).toFixed(1)}
            </Text>
            <Text style={{ fontSize: rf(12), color: Colors.gray[600] }}>Avg Rating</Text>
          </View>
        </View>
      </View>

      {/* Staff List */}
      <FlatList
        data={filteredStaff}
        renderItem={renderStaffCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: wp(6), paddingTop: hp(3), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
