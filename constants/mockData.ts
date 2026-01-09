// ==================== SPECIALISTS ====================
export interface Specialist {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  phone: string;
  role?: string;
  isTopRated?: boolean;
}

export const SPECIALISTS: Specialist[] = [
  {
    id: "1",
    name: "Doe John",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240",
    rating: 2,
    phone: "+732 8888 111",
    role: "Hair Specialist",
    isTopRated: true,
  },
  {
    id: "2",
    name: "Lucy",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
    rating: 2,
    phone: "+732 8888 111",
    role: "Hair Dresser",
    isTopRated: true,
  },
  {
    id: "3",
    name: "Laila",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240",
    rating: 0,
    phone: "+732 8888 111",
    role: "Hair Stylist",
    isTopRated: false,
  },
];

// ==================== SERVICES ====================
export interface ServiceItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  reviews: number;
}

export const SERVICES_MENU: ServiceItem[] = [
  {
    id: "1",
    name: "Basic Haircut",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240",
    rating: 3,
    price: 60,
    reviews: 24,
  },
  {
    id: "2",
    name: "Layered Haircut",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
    rating: 2,
    price: 65,
    reviews: 18,
  },
  {
    id: "3",
    name: "Bob Haircut",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240",
    rating: 3,
    price: 65,
    reviews: 31,
  },
];

// ==================== APPOINTMENTS ====================
export interface AppointmentItem {
  id: string;
  service: string;
  stylist: string;
  date: string;
  dayTime: string;
  time: string;
  price: number;
  hasReview: boolean;
}

export const APPOINTMENT_HISTORY: AppointmentItem[] = [
  {
    id: "1",
    service: "Hair dry",
    stylist: "Lucy",
    date: "10.April.2023",
    dayTime: "Tue, Afternoon",
    time: "2:00pm",
    price: 20,
    hasReview: false,
  },
  {
    id: "2",
    service: "Makeup",
    stylist: "Laila",
    date: "30.March.2023",
    dayTime: "Tue, Morning",
    time: "9:00am",
    price: 120,
    hasReview: true,
  },
  {
    id: "3",
    service: "Facial Treatment",
    stylist: "Emma",
    date: "15.March.2023",
    dayTime: "Wed, Afternoon",
    time: "3:30pm",
    price: 85,
    hasReview: true,
  },
  {
    id: "4",
    service: "Hair Color",
    stylist: "Lucy",
    date: "01.March.2023",
    dayTime: "Mon, Morning",
    time: "10:00am",
    price: 150,
    hasReview: false,
  },
];

export interface ScheduledAppointment {
  id: string;
  time: string;
  category: string;
  service: string;
  stylistName: string;
  stylistImage: string;
  customerName: string;
  customerImage: string;
  price: number;
  status: "confirmed" | "pending";
}

export const SCHEDULED_APPOINTMENTS: ScheduledAppointment[] = [
  {
    id: "1",
    time: "2:00 PM",
    category: "Hair Design & Cut",
    service: "Basic Haircut",
    stylistName: "Lisa",
    stylistImage: "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
    customerName: "You",
    customerImage: "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114",
    price: 50,
    status: "confirmed",
  },
  {
    id: "2",
    time: "5:00 PM",
    category: "Color & Shine",
    service: "Hair dying",
    stylistName: "Lisa",
    stylistImage: "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
    customerName: "Doe John",
    customerImage: "https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240",
    price: 29,
    status: "pending",
  },
];

// ==================== NOTIFICATIONS ====================
export interface NotificationItem {
  id: string;
  type: "appointment_confirm" | "appointment_update" | "feedback";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "appointment_confirm",
    title: "Appointment confirm",
    description:
      "Your booking is confirmed!\nHaircut & Wash – 3:30 PM, Oct 16 2025\nStylist: Lucy\nSalon – 23 Nguyen Trai, District 1",
    time: "34 Minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "appointment_update",
    title: "Appointment updated",
    description:
      "Your appointment has been updated.\nPerm moved to 3:00 PM (instead of 2:00 PM).",
    time: "15 Minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "feedback",
    title: "Feedback",
    description:
      "Thanks for visiting. How was your experience with Stylist Emma?\nLeave a review and get 10% off",
    time: "52 Minutes ago",
    read: true,
  },
  {
    id: "4",
    type: "appointment_confirm",
    title: "Appointment confirm",
    description:
      "Your booking is confirmed!\nFacial Treatment – 10:00 AM, Oct 20 2025\nStylist: Anna\nSalon – 45 Le Loi, District 3",
    time: "2 hours ago",
    read: true,
  },
];

// ==================== REVIEWS ====================
export interface ReviewItem {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  timeAgo: string;
  comment: string;
}

export const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    userName: "Courtney Henry",
    userImage: "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
    rating: 5,
    timeAgo: "2 mins ago",
    comment: "The service is great. I will come back soon!",
  },
  {
    id: "2",
    userName: "Cameron Williamson",
    userImage: "https://api.builder.io/api/v1/image/assets/TEMP/4ab931700dd594de82119a13ddc008773676e5ab?width=240",
    rating: 4,
    timeAgo: "2 mins ago",
    comment: "The space is too small",
  },
  {
    id: "3",
    userName: "Jane Cooper",
    userImage: "https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240",
    rating: 3,
    timeAgo: "2 mins ago",
    comment: "Service not good ?!",
  },
];

export const RATING_DISTRIBUTION = [
  { stars: 5, percentage: 70 },
  { stars: 4, percentage: 55 },
  { stars: 3, percentage: 35 },
  { stars: 2, percentage: 15 },
  { stars: 1, percentage: 5 },
];

// ==================== CATEGORY INFO ====================
export const CATEGORY_INFO: Record<string, { name: string; quote: string }> = {
  "hair-design": { name: "Hair Design & Cut", quote: '"Crafting Confidence,\nOne Cut at a Time."' },
  "color-shine": { name: "Color & Shine", quote: '"Shine Bright,\nColor Your World."' },
  "texture-volume": { name: "Texture & Volume", quote: '"Volume That Speaks,\nTexture That Inspires."' },
  "scalp-spa": { name: "Scalp & Head Spa", quote: '"Relax & Rejuvenate,\nFrom Root to Soul."' },
  "facial-neck": { name: "Facial & Neck Care", quote: '"Glow From Within,\nCare That Shows."' },
  "bridal-vip": { name: "Bridal & VIP Styling", quote: '"Your Special Day,\nPerfectly Styled."' },
};

// ==================== DEFAULT AVATAR ====================
export const DEFAULT_AVATAR = "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114";

// ==================== DEFAULT USER ====================
export const DEFAULT_USER = {
  name: "Doe John",
  email: "doejohn@example.com",
  phone: "+732 8888 111",
  avatar: DEFAULT_AVATAR,
};

// ==================== GUEST USER ====================
export const GUEST_USER = {
  name: "Guest",
  avatar: null, // Will use default icon
};

// ==================== MOCK USERS FOR AUTHENTICATION ====================
export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    email: "doejohn@example.com",
    password: "123456",
    name: "Doe John",
    phone: "+732 8888 111",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/bf83f7d9f51b91c7f1126d620657aa5f1b9a54bf?width=114",
  },
  {
    id: "2",
    email: "lucy@example.com",
    password: "123456",
    name: "Lucy Smith",
    phone: "+732 9999 222",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/ab5fe51fab4ac2627711fedc485bf50f9f29dc9d?width=240",
  },
  {
    id: "3",
    email: "test@test.com",
    password: "test",
    name: "Test User",
    phone: "+732 1111 333",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/c13a64eddbdb7480b9b4c7efde1b809bfdd47ab0?width=240",
  },
];

// ==================== CALENDAR ====================
export const WEEK_DAYS = ["Mo", "Tue", "Wed", "Th", "Fri", "Sa", "Su"];
