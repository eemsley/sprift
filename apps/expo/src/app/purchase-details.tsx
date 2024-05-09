import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { getOrderCost } from "~/utils/checkout";
import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

const PurchaseDetailsScreen: React.FC = () => {
  const { getOrderById } = useAPI();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { orderId } = params;
  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: ["order by id"],
    queryFn: async () => getOrderById(orderId as string),
  });

  const { data: costs, refetch: refetchCost } = useQuery({
    queryKey: [`order/${orderId}/costs`],
    queryFn: () => {
      if (!order || isOrderLoading) {
        return { subtotal: 0, shipping: 0, total: 0 };
      }
      return getOrderCost(order);
    },
  });

  useEffect(() => {
    if (order && !isOrderLoading) {
      void refetchCost();
    }
  }, [order, isOrderLoading, refetchCost]);

  const ListingSquare: React.FC<{
    sellerName: string;
    imagePaths: string[];
    price: number;
    size: string;
    address: string;
  }> = ({ sellerName, imagePaths, price, size, address }) => {
    return (
      <View className="w-1/2 px-3 py-3">
        <View className="w-full rounded-xl bg-neutral-50 shadow-lg shadow-neutral-300">
          <Image
            className="aspect-[5/4] w-full rounded-b-lg rounded-t-xl"
            alt=""
            source={{ uri: imagePaths[0] }}
          />
          <View className="flex-row justify-between p-3">
            <Text className="font-general-sans-semibold w-2/3">
              {sellerName}
              {"\n"}${price.toFixed(2)}
            </Text>
            <Text className="font-general-sans-medium">{size}</Text>
          </View>
          <View className="p-3">
            <Text className="font-general-sans-medium">Shipping from:</Text>
            <Text className="font-general-sans-regular text-[#39331d]">
              {address}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (isOrderLoading) {
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
        <View className="top-1 z-50 w-[95%] items-center rounded-full px-5 pt-3">
          <View className="w-full flex-row items-center justify-between">
            <View className="w-13 h-8 items-center justify-center pr-8">
              <Ionicons
                onPress={() => router.replace("/purchases")}
                name="chevron-back-outline"
                color="black"
                size={24}
              />
            </View>
            <Text className="font-general-sans-medium text-primary-500 text-3xl font-bold">
              My Order
            </Text>
            <View className="h-8 w-14 pl-8" />
          </View>
        </View>
        <View className="-mt-20 h-full w-full justify-center">
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
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
        <View className="top-1 z-50 w-[95%] items-center rounded-full px-5 pt-3">
          <View className="w-full flex-row items-center justify-between">
            <View className="w-13 h-8 items-center justify-center pr-8">
              <Ionicons
                onPress={() => router.replace("/purchases")}
                name="chevron-back-outline"
                color="black"
                size={24}
              />
            </View>
            <Text className="font-general-sans-medium text-primary-500 text-3xl font-bold">
              My Order
            </Text>
            <View className="h-8 w-14 pl-8" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const getListings = () => {
    const listings = [];
    for (const suborder of order.suborders) {
      const parsedListings = suborder.lines.map(({ listing }) => ({
        ...listing,
        price: Number(listing.price),
        sellerName: listing.seller.email.split("@")[0] as string,
        address: listing.seller.street1,
        imagePaths: listing.imagePaths.map((image) => image.path),
        size: listing.size,
      }));
      listings.push(...parsedListings);
    }

    return listings;
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="top-1 z-50 w-[95%] items-center rounded-full px-5 pt-3">
        <View className="w-full flex-row items-center justify-between">
          <View className="w-13 h-8 items-center justify-center pr-8">
            <Ionicons
              onPress={() => router.replace("/purchases")}
              name="chevron-back-outline"
              color="black"
              size={24}
            />
          </View>
          <Text className="font-general-sans-medium text-primary-500 text-3xl font-bold">
            My Order
          </Text>
          <Ionicons name="chevron-back-outline" color="transparent" size={24} />
        </View>
      </View>
      <ScrollView className="h-full w-full">
        <View className="flex-row flex-wrap space-x-5 pt-2">
          {getListings().map((listing) => (
            <ListingSquare
              key={listing.id}
              price={Number(listing.price)}
              sellerName={listing.sellerName}
              address={listing.address}
              imagePaths={listing.imagePaths}
              size={listing.size}
            />
          ))}
          <View className="p-24" />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-full rounded-t-3xl bg-neutral-50 p-5 shadow-lg shadow-neutral-300">
        <View className="flex-row items-center justify-between pb-3">
          <Text className="font-general-sans-medium text-base">
            {`0 of ${getListings().length} shipped`}
          </Text>
          <View className="flex-row items-center">
            <Text className="font-general-sans-regular text-base">
              Total Price:{" "}
            </Text>
            <Text className="font-general-sans-semibold text-lg text-[#b8a665]">
              ${costs?.total.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text className="font-general-sans-regular pb-1 text-base">
          {/* {`Ordered on: ${order.createdAt.toISOString()}\nEstimated Delivery: June 2, 2023`} */}
        </Text>
        {/* <Pressable onPress={() => console.log("open tracking link")}>
          <Text className="font-general-sans-medium pl-2 text-[#4b8891]">
            Track order
          </Text>
        </Pressable> */}
        <View className="p-4" />
      </View>
    </SafeAreaView>
  );
};

export default PurchaseDetailsScreen;
