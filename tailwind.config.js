/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "salon-primary": "#FE697D",
        "salon-coral": "#FFB5C2",
        "salon-pink": "#FFCCD3",
        "salon-pink-light": "#FFE5EA",
        "salon-pink-bg": "#FFF0F3",
        "salon-brown": "#C19A6B",
        "salon-dark": "#262626",
        "salon-gray-light": "#A6A6A6",
      },
      fontFamily: {
        sansation: ["System"],
        inter: ["System"],
        roboto: ["System"],
        "send-flowers": ["System"],
      },
    },
  },
  plugins: [],
};
