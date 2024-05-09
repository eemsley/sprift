import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, SignedIn } from "@clerk/clerk-expo";
import { StripeProvider } from "@stripe/stripe-react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { tokenCache } from "~/utils/cache";
import {
  CLERK_PUBLISHABLE_KEY,
  STRIPE_PUBLISHABLE_KEY,
} from "~/utils/constants";
import { fontImports } from "~/utils/theme";
import BottomNavBar from "~/components/shared/BottomNavBar";
import { APIProvider } from "~/contexts/API";

SplashScreen.preventAutoHideAsync().catch((err) => console.log(err));

const RootLayout = () => {
  const queryClient = new QueryClient();
  const [fontsLoaded] = useFonts(fontImports);
  const pathname = usePathname();
  const navBarPaths = ["/main", "/", "/explore", "/liked", "/account"];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          tokenCache={tokenCache}
        >
          <APIProvider>
            <SafeAreaProvider>
              <Stack
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: false,
                  animation: "none",
                }}
              />
              <SignedIn>
                {navBarPaths.includes(pathname) && (
                  <BottomNavBar currPage={pathname} />
                )}
              </SignedIn>
              <StatusBar />
            </SafeAreaProvider>
          </APIProvider>
        </ClerkProvider>
      </StripeProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;
