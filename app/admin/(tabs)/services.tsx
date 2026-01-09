import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { wp, hp, rf } from "@/utils/responsive";
import { Colors, HOME_CATEGORIES, SERVICES_MENU } from "@/constants";
import { DecorativeCircle } from "@/components";
import { Plus, Edit2, Trash2, Clock, DollarSign, ChevronRight } from "lucide-react-native";
import { categoryApi, serviceApi } from "@/api";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  categoryId: string;
  image: string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
  servicesCount: number;
}

const HARDCODED_CATEGORIES: Category[] = HOME_CATEGORIES.map((cat, idx) => ({
  id: cat.id,
  name: cat.name,
  image: cat.imageUrl,
  servicesCount: idx === 0 ? 8 : idx === 1 ? 6 : 5,
}));

const HARDCODED_SERVICES: Service[] = SERVICES_MENU.map(svc => ({
  id: svc.id,
  name: svc.name,
  description: `Professional ${svc.name.toLowerCase()} service`,
  duration: '45 min',
  price: `$${svc.price}`,
  category: 'Hair Cut',
  categoryId: 'hair-design',
  image: svc.image,
  isActive: true,
}));

const mergeCategories = (apiData: Category[], hardcodedData: Category[]): Category[] => {
  const merged = new Map<string, Category>();
  hardcodedData.forEach(item => merged.set(item.id, item));
  apiData.forEach(item => merged.set(item.id, item));
  return Array.from(merged.values());
};

const mergeServices = (apiData: Service[], hardcodedData: Service[]): Service[] => {
  const merged = new Map<string, Service>();
  hardcodedData.forEach(item => merged.set(item.id, item));
  apiData.forEach(item => merged.set(item.id, item));
  return Array.from(merged.values());
};

type ViewMode = "categories" | "services";

export default function AdminServicesScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(HARDCODED_CATEGORIES);
  const [services, setServices] = useState<Service[]>(HARDCODED_SERVICES);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        if (response.success && response.data && response.data.length > 0) {
          const apiCategories = response.data.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
            image: cat.image || cat.imageUrl || HARDCODED_CATEGORIES[0]?.image,
            servicesCount: cat.servicesCount || 0,
          }));
          setCategories(mergeCategories(apiCategories, HARDCODED_CATEGORIES));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (!selectedCategoryId) return;
      try {
        const response = await serviceApi.getServices({ categoryId: selectedCategoryId });
        if (response.success && response.data && response.data.length > 0) {
          const apiServices = response.data.map((svc: any) => ({
            id: svc.id || svc._id,
            name: svc.name,
            description: svc.description || '',
            duration: svc.duration ? `${svc.duration} min` : '30 min',
            price: `$${svc.price || 0}`,
            category: selectedCategory || '',
            categoryId: selectedCategoryId,
            image: svc.image || svc.imageUrl || HARDCODED_SERVICES[0]?.image,
            isActive: svc.isActive !== false,
          }));
          setServices(mergeServices(apiServices, HARDCODED_SERVICES));
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    if (viewMode === "services") {
      fetchServices();
    }
  }, [selectedCategoryId, viewMode, selectedCategory]);

  const filteredServices = services;

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedCategory(item.name);
        setSelectedCategoryId(item.id);
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

      <View style={{ paddingTop: hp(6), paddingHorizontal: wp(6) }}>
        <View className="flex-row items-center justify-between">
          <View>
            {viewMode === "services" && selectedCategory ? (
              <TouchableOpacity
                onPress={() => {
                  setViewMode("categories");
                  setSelectedCategory(null);
                  setSelectedCategoryId(null);
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

      <FlatList
        data={(viewMode === "categories" ? categories : filteredServices) as any}
        renderItem={viewMode === "categories" ? renderCategory : renderService as any}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingHorizontal: wp(6), paddingTop: hp(3), paddingBottom: hp(4) }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
