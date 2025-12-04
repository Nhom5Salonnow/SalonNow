export interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    title: "Welcome to SalonNow",
    subtitle: "Book beauty services anytime, anywhere",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/df40774b35c31c8b961412657e5fb1dc858591a3?width=852",
  },
  {
    id: "2",
    title: "Discover & Book Easily",
    subtitle:
      "Explore the latest styles, services, and trends. Book your favorite stylist anytime, anywhere.",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/14c707c5358604376840939c488ee8796aec8617?width=590",
  },
  {
    id: "3",
    title: "Relax & Enjoy",
    subtitle:
      "We'll handle the rest while you enjoy your moment. Look great, feel amazing — effortlessly.",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/8cc6479872184958b12e234948af1c01bcb0ce99?width=720",
  },
  {
    id: "4",
    title: "Your Style, One App",
    subtitle: "Your beauty journey starts here",
    imageUrl:
      "https://api.builder.io/api/v1/image/assets/TEMP/279c974a6d7ee44a145581c9088d8ad7c77c19a6?width=564",
  },
];
