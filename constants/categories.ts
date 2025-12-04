import { ServiceCategory, HomeCategory } from "@/types";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "haircut",
    name: "Cắt Tóc",
    icon: "scissors",
    color: "#3B82F6",
  },
  {
    id: "coloring",
    name: "Nhuộm",
    icon: "sparkles",
    color: "#F59E0B",
  },
  {
    id: "washing",
    name: "Gội Đầu",
    icon: "user",
    color: "#10B981",
  },
  {
    id: "spa",
    name: "Spa",
    icon: "heart",
    color: "#EF4444",
  },
  {
    id: "styling",
    name: "Tạo Kiểu",
    icon: "wand",
    color: "#8B5CF6",
  },
  {
    id: "treatment",
    name: "Điều Trị",
    icon: "shield",
    color: "#EC4899",
  },
];

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "hair-design",
    name: "Hair Design & Cut",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/bd0eabc2370a0bbca75ba2cb8281c812a73143b6?width=220",
  },
  {
    id: "color-shine",
    name: "Color & Shine",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/ff6d34a82f20dbf4d9009c0cea4ad6881ea66011?width=220",
  },
  {
    id: "texture-volume",
    name: "Texture & Volume",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/5c0cb7acd64c5f70b09de8ca9b374bdfaa6ad5ef?width=220",
  },
  {
    id: "scalp-spa",
    name: "Scalp & Head Spa",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/ae08994730461bd0b880cc5273d9f8afa6593e7e?width=220",
  },
  {
    id: "facial-neck",
    name: "Facial & Neck Care",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/2e5fb68764f54e81c299e51f489b20f081a205ff?width=220",
  },
  {
    id: "bridal-vip",
    name: "Bridal & VIP Styling",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/933c5b9114e6da63f44079fd9a8d0e26a75ec8cc?width=220",
  },
];
