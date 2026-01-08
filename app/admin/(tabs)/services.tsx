import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors } from "@/constants";
import { DecorativeCircle } from "@/components";
import { Plus, Edit2, Trash2, Clock, DollarSign, ChevronRight } from "lucide-react-native";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  image: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
  servicesCount: number;
}

const CATEGORIES: Category[] = [
  { id: "1", name: "Hair Cut", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200", servicesCount: 8 },
  { id: "2", name: "Hair Color", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200", servicesCount: 6 },
  { id: "3", name: "Styling", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200", servicesCount: 5 },
  { id: "4", name: "Nail Care", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200", servicesCount: 10 },
  { id: "5", name: "Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200", servicesCount: 7 },
];

const SERVICES: Service[] = [
  {
    id: "1",
    name: "Women's Haircut",
    description: "Professional haircut with wash and styling",
    duration: "45 min",
    price: "$45",
    category: "Hair Cut",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200",
    isActive: true
  },
  {
    id: "2",
    name: "Men's Haircut",
    description: "Classic or modern cut with styling",
    duration: "30 min",
    price: "$30",
    category: "Hair Cut",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200",
    isActive: true
  },
  {
    id: "3",
    name: "Full Color",
    description: "Complete hair coloring service",
    duration: "120 min",
    price: "$150",
    category: "Hair Color",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200",
    isActive: true
  },
  {
    id: "4",
    name: "Highlights",
    description: "Partial or full highlights",
    duration: "90 min",
    price: "$100",
    category: "Hair Color",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200",
    isActive: false
  },
  {
    id: "5",
    name: "Manicure",
    description: "Classic manicure with polish",
    duration: "30 min",
    price: "$25",
    category: "Nail Care",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200",
    isActive: true
  },
];

type ViewMode = "categories" | "services";

export default function AdminServicesScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredServices = selectedCategory
    ? SERVICES.filter((s) => s.category === selectedCategory)
    : SERVICES;

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(item.name);
        setViewMode("services");
      }}
      className="flex-row items-center rounded-xl"
      style={{
        backgroundColor: "#fff",
        marginBottom: hp(1.5),
        padding: wp(3),
        borderWidth: 1,
        borderColor: "#F3F4F6",
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: wp(16), height: wp(16), borderRadius: wp(2) }}
      />
      <View style={{ flex: 1, marginLeft: wp(3) }}>
        <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.5) }}>
          {item.servicesCount} services
        </Text>
      </View>
      <ChevronRight size={rf(20)} color={Colors.gray[400]} />
    </TouchableOpacity>
  );

  const renderService = ({ item }: { item: Service }) => (
    <View
      className="rounded-xl"
      style={{
        backgroundColor: "#fff",
        marginBottom: hp(1.5),
        padding: wp(4),
        borderWidth: 1,
        borderColor: "#F3F4F6",
        opacity: item.isActive ? 1 : 0.6,
      }}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.image }}
          style={{ width: wp(20), height: wp(20), borderRadius: wp(2) }}
        />
        <View style={{ flex: 1, marginLeft: wp(3) }}>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontSize: rf(16), fontWeight: "600", color: "#000" }}>
              {item.name}
            </Text>
            {!item.isActive && (
              <View
                className="rounded-full"
                style={{ backgroundColor: Colors.gray[200], paddingHorizontal: wp(2), paddingVertical: hp(0.3) }}
              >
                <Text style={{ fontSize: rf(10), color: Colors.gray[600] }}>Inactive</Text>
              </View>
            )}
          </View>
          <Text
            style={{ fontSize: rf(13), color: Colors.gray[500], marginTop: hp(0.5) }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <View className="flex-row items-center" style={{ marginTop: hp(1) }}>
            <View className="flex-row items-center">
              <Clock size={rf(14)} color={Colors.gray[400]} />
              <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>
                {item.duration}
              </Text>
            </View>
            <View className="flex-row items-center" style={{ marginLeft: wp(4) }}>
              <DollarSign size={rf(14)} color={Colors.primary} />
              <Text style={{ fontSize: rf(15), color: Colors.primary, fontWeight: "600" }}>
                {item.price.replace("$", "")}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        className="flex-row justify-end"
        style={{ marginTop: hp(2), paddingTop: hp(1.5), borderTopWidth: 1, borderTopColor: "#F3F4F6" }}
      >
        <TouchableOpacity
          className="flex-row items-center rounded-lg"
          style={{ backgroundColor: "#F3F4F6", paddingHorizontal: wp(3), paddingVertical: hp(0.8), marginRight: wp(2) }}
        >
          <Edit2 size={rf(14)} color={Colors.gray[600]} />
          <Text style={{ fontSize: rf(13), color: Colors.gray[600], marginLeft: wp(1) }}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center rounded-lg"
          style={{ backgroundColor: "#FEF2F2", paddingHorizontal: wp(3), paddingVertical: hp(0.8) }}
        >
          <Trash2 size={rf(14)} color="#EF4444" />
          <Text style={{ fontSize: rf(13), color: "#EF4444", marginLeft: wp(1) }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <DecorativeCircle position="topLeft" size="large" opacity={0.4} />

      {/* Header */}
      <View style={{ paddingTop: hp(6), paddingHorizontal: wp(6) }}>
        <View className="flex-row items-center justify-between">
          <View>
            {viewMode === "services" && selectedCategory ? (
              <TouchableOpacity
                onPress={() => {
                  setViewMode("categories");
                  setSelectedCategory(null);
                }}
              >
                <Text style={{ fontSize: rf(14), color: Colors.primary }}>
                  ← Back to Categories
                </Text>
              </TouchableOpacity>
            ) : null}
            <Text style={{ fontSize: rf(24), fontWeight: "700", color: "#000", marginTop: hp(0.5) }}>
              {viewMode === "categories" ? "Service Categories" : selectedCategory}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center rounded-full"
            style={{ backgroundColor: Colors.primary, paddingHorizontal: wp(4), paddingVertical: hp(1) }}
          >
            <Plus size={rf(18)} color="#fff" />
            <Text style={{ fontSize: rf(14), color: "#fff", fontWeight: "500", marginLeft: wp(1) }}>
              Add {viewMode === "categories" ? "Category" : "Service"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={(viewMode === "categories" ? CATEGORIES : filteredServices) as any}
        renderItem={viewMode === "categories" ? renderCategory : renderService as any}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingHorizontal: wp(6), paddingTop: hp(3), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
