import type { Config } from "tailwindcss";

import baseConfig from "@spree/tailwind-config";

export default {
  content: ["./src/**/*.tsx"],
  presets: [baseConfig],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "2rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "3rem" }],
      "4xl": ["2.5rem", { lineHeight: "3rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      animation: {
        "fade-in": "fade-in 0.5s linear forwards",
        marquee: "marquee var(--marquee-duration) linear infinite",
        "spin-slow": "spin 4s linear infinite",
        "spin-slower": "spin 6s linear infinite",
        "spin-reverse": "spin-reverse 1s linear infinite",
        "spin-reverse-slow": "spin-reverse 4s linear infinite",
        "spin-reverse-slower": "spin-reverse 6s linear infinite",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      colors: ({ colors }) => ({
        gray: colors.neutral,
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
        'pAccent': {
          500: "#a3e6cd",
        }, 
        'sAccent': {
          500: "#7cd4e6",
        },
        'offBlack': {
          500: "#262629"
        },
      }),
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
        "itim-regular": "ItimRegular",
      },
      keyframes: {
        marquee: {
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        "spin-reverse": {
          to: {
            transform: "rotate(-360deg)",
          },
        },
      },
      maxWidth: {
        "2xl": "40rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
