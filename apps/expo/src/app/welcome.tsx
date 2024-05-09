import { useEffect } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";

import { WELCOME_SCREEN_SVGS_TO_PRELOAD } from "~/utils/constants";
import AppButton from "~/components/shared/AppButton";
import ListingCard from "~/components/welcome/ListingCard";
import { COLORS } from "../utils/theme";

const WelcomeScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Preload onboarding svgs as they are slow
    async function preloadOnboardingAssets() {
      for (const asset of WELCOME_SCREEN_SVGS_TO_PRELOAD) {
        await Image.prefetch(asset);
      }
    }

    void preloadOnboardingAssets();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "fade",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Text className="font-general-sans-medium pt-8 text-center text-2xl text-neutral-700">
        Welcome to
      </Text>
      <View className="items-center">
        {/* todo place logo here instead of the Text */}
        <Text className="text-primary-400 font-satoshi-black p-6 text-6xl">
          Sprift
        </Text>
      </View>
      <View className="mb-5 items-center justify-center">
        {/* todo replace with animation */}
        <ListingCard />
      </View>

      <View className="absolute bottom-12 w-full items-center">
        <Text className="font-satoshi-black p-2 text-center text-3xl font-bold text-neutral-600">
          Swipe. Shop. Save.
        </Text>
        <Text className="font-general-sans-medium text-center text-lg text-neutral-500">
          Build a wardrobe that reflects{"\n"}you with ease!
        </Text>
        <View className="w-96 p-5">
          <AppButton
            backgroundColor={COLORS.primary[400]}
            highlightedColor={COLORS.primary[300]}
            textColor={COLORS.neutral[200]}
            rounded
            title="Sign up"
            //TODO change route to be create account
            onPress={() => router.push("/register")}
          />
          <View className="p-4" />
          <AppButton
            backgroundColor={COLORS.neutral[300]}
            highlightedColor={"#e5e5e5"}
            textColor={COLORS.primary[700]}
            rounded
            title="Login"
            //TODO change route to be to Login
            onPress={() => router.push("/login")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
