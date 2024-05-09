// TODO: Add support for TS config files in Nativewind.

// import { type Config } from "tailwindcss";

// import baseConfig from "@spree/tailwind-config";

// export default {
//   presets: [baseConfig],
//   content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
// } satisfies Config;

// const config = {
//   content: ["./src/**/*.{ts,tsx}"],
// };

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#97d8d3",
          100: "#89d2cd",
          200: "#7acdc8",
          300: "#6bc7c2",
          400: "#5cc1bc",
          500: "#49bab4",
          600: "#43b1ac",
          700: "#3ea39e",
          800: "#38948f",
          900: "#38948f",
        },
        secondary: {
          50: "#4ac3e8",
          100: "#38bde5",
          200: "#26b7e3",
          300: "#1cadd9",
          400: "#1a9ec7",
          500: "#168aad",
          600: "#1581a2",
          700: "#137390",
          800: "#10657e",
          900: "#0e566c",
        },
        neutral: {
          50: "#F9FAFA",
          100: "#F3F5F5",
          200: "#F3F5F5",
          300: "#D6DADB",
          400: "#B8C5CA",
          500: "#666666",
          600: "#4D4D4D",
          700: "#333333",
          800: "#1A1A1A",
          900: "#26273D",
        },
        accent: {
          50: "#769bbc",
          100: "#6991b5",
          200: "#5b87ae",
          300: "#517da4",
          400: "#4a7396",
          500: "#426685",
          600: "#3d5e7b",
          700: "#36536d",
          800: "#2f4960",
          900: "#283f52",
        },
      },
      fontFamily: {
        "satoshi-light": "SatoshiLight",
        "satoshi-regular": "SatoshiRegular",
        "satoshi-medium": "SatoshiMedium",
        "satoshi-bold": "SatoshiBold",
        "satoshi-black": "SatoshiBlack",
        "general-sans-light": "GeneralSansLight",
        "general-sans-regular": "GeneralSansRegular",
        "general-sans-medium": "GeneralSansMedium",
        "general-sans-semibold": "GeneralSansSemibold",
        "general-sans-bold": "GeneralSansBold",
      },
    },
  },
};
