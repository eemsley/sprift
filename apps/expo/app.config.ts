import type { ExpoConfig } from "@expo/config";

const defineConfig = (): ExpoConfig => ({
  name: "Sprift",
  description: "Swipe, shop, save!",
  owner: "spree-technologies",
  slug: "spree-mobile",
  scheme: "expo",
  version: "1.0.5",
  orientation: "portrait",
  icon: "./assets/icons/icon.png",
  userInterfaceStyle: "light",
  splash: {
    resizeMode: "contain",
    image: "./assets/splash/splash.png",
  },
  updates: {
    url: "https://u.expo.dev/945ff498-aa67-4b80-8670-81c8c30db1ef",
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.spree-commerce.ios",
    buildNumber: "1.0.0",
    icon: "./assets/icons/icon.png",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    icon: "./assets/icons/icon.png",
  },
  extra: {
    eas: {
      projectId: "945ff498-aa67-4b80-8670-81c8c30db1ef",
    },
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  // plugins: [
  //   ["./expo-plugins/with-modify-gradle.js"],
  //   [
  //     "@stripe/stripe-react-native",
  //     {
  //       merchantIdentifier: "",
  //       enableGooglePay: true,
  //     },
  //   ],
  // ],
});

export default defineConfig;
