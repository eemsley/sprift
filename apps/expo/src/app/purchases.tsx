import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { type OrderType } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

const PurchasesScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { getUserPurchases } = useAPI();
  const { data: purchases, isLoading: isPurchasesLoading } = useQuery({
    queryKey: ["/api/user/[id]/purchases"],
    queryFn: () => getUserPurchases(userId as string),
  });

  const Order: React.FC<OrderType> = (order) => {
    return (
      <Pressable
        className="pb-3"
        onPress={() =>
          router.push({
            pathname: "purchase-details",
            params: { orderId: order.id },
          })
        }
      >
        <View className="w-full space-y-2 rounded-2xl bg-neutral-50 p-2 shadow-lg shadow-neutral-300">
          <View className="w-full flex-row items-center justify-between px-2 pt-2">
            <Text className="font-general-sans-medium text-base">Order</Text>
            <View className="flex-row items-center">
              <Text
                className="font-general-sans-semibold text-base text-sky-600"
                style={{ color: "#4a7a82" }}
              >
                $
              </Text>
              <Text className="font-general-sans-semibold text-base">
                {order.price.toFixed(2)}
              </Text>
            </View>
          </View>
          <Text className="font-general-sans-medium px-2 text-base">
            {`#${order.id}`}
          </Text>

          <Text className="font-general-sans-regular pl-3">{order?.date}</Text>
          <Text className="font-general-sans-regular pl-3">
            {order.items.length} items
          </Text>
          <View className="w-full flex-row flex-wrap items-center space-x-1 space-y-1 px-1">
            <View />
            {order.items.map((listing, i) => (
              <Image
                key={`${listing.id}${i}`}
                className="h-10 w-10 rounded-lg"
                alt="Listing Image"
                source={{ uri: listing.imagePaths[0] }}
              />
            ))}
          </View>
          <View className="w-full flex-row items-center justify-between border-t-[1px] border-t-neutral-200 px-3 py-1">
            <Pressable
              className="p-1"
              onPress={() => console.log("track order")}
            >
              <Text className="font-general-sans-medium">Track order</Text>
            </Pressable>
            <Text
              className="font-general-sans-medium text-lg"
              style={{ color: "#b8a665" }}
            >
              {order?.status}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  if (isPurchasesLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <Stack.Screen
          options={{
            animation: "slide_from_right",
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: COLORS.primary[500],
            },
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <View className="h-full flex-1 justify-center bg-neutral-50 px-3 pt-5">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!purchases || purchases.length === 0) {
    return (
      <SafeAreaView className="bg-neutral-50">
        <Stack.Screen
          options={{
            animation: "slide_from_right",
            headerBackVisible: false,
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <View className="z-50 w-full rounded-full px-5 pt-4">
          <View className="w-full flex-row items-center justify-between">
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                color={COLORS.neutral[600]}
                size={24}
              />
            </Pressable>
            <Text className="font-satoshi-bold text-primary-500 text-3xl font-bold">
              Purchases
            </Text>
            <Ionicons
              name="chevron-back-outline"
              color="transparent"
              size={24}
            />
          </View>
        </View>
        <View className="mt-64 bg-neutral-50 px-3 pt-5">
          <View className="h-full w-full items-center">
            <View className="aspect-square w-[90%] items-center">
              <Text className="font-general-sans-medium text-primary-500 text-center text-2xl">
                You have not made any purchases!
              </Text>
              <Text className="font-general-sans-medium w-full self-center pt-4 text-center text-sm text-sky-900">
                Come back later after you buy some listings.
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "fade",
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary[500],
          },
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View className="z-50 w-full rounded-full px-5 pt-4">
        <View className="w-full flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-back-outline"
              color={COLORS.neutral[600]}
              size={24}
            />
          </Pressable>
          <Text className="font-satoshi-bold text-primary-500 text-3xl font-bold">
            Purchases
          </Text>
          <Ionicons name="chevron-back-outline" color="transparent" size={24} />
        </View>
      </View>
      <ScrollView className="h-full p-6">
        {purchases.map((order, index) => (
          <Order
            id={order.id}
            price={order.price}
            date={order.date}
            status={order.status}
            items={order.items}
            key={index}
          />
        ))}
        {/* <View className="w-full items-center pt-3">
          <View
            className="h-7 items-center justify-center rounded-full bg-neutral-300 opacity-80"
            style={{ backgroundColor: "#d0dbdd" }}
          >
            <Text className="font-general-sans-semibold px-6 text-neutral-500">
              View old orders
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
export default PurchasesScreen;
