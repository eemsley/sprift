import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { mockOrders } from "~/utils/mockData";

const SalesDetails = () => {
  const params = useLocalSearchParams();
  const order = params;
  const orderDetails = mockOrders.find(
    (item) => item.id.toString() === order.id,
  );

  // Grouped data
  // const groupedData = orderDetails?.items.reduce(
  //   (result: { [key: string]: ListingType[] }, item: ListingType) => {
  //     if (!result[item.sellerName]) {
  //       result[item.sellerName] = [];
  //     }
  //     result[item.sellerName]?.push(item);
  //     return result;
  //   },
  //   {},
  // );
  const router = useRouter();

  const ListingSquare: React.FC<{
    sellerName: string;
    imageUrls: string[];
    price: number;
    size: string;
  }> = ({ sellerName, imageUrls, price, size }) => {
    return (
      <View className="w-1/2 px-3 py-3">
        <View className="w-full rounded-xl bg-neutral-50 shadow-lg shadow-neutral-300">
          <Image
            className="aspect-[5/4] w-full rounded-b-lg rounded-t-xl"
            alt=""
            source={{ uri: imageUrls[0] }}
          />
          <View className="flex-row justify-between p-3">
            <Text className="font-general-sans-semibold w-2/3">
              {sellerName}
              {"\n"}${price.toFixed(2)}
            </Text>
            <Text className="font-general-sans-medium">{size}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          animation: "fade",
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: "#7daeb5",
          },
          headerShown: true,
          headerTitle: () => (
            <View className="z-50 w-full flex-row items-center justify-between pr-10">
              <Pressable
                style={{ width: 28 }}
                onPress={() => {
                  router.back();
                }}
              >
                <Ionicons name="chevron-back" color={"white"} size={28} />
              </Pressable>
              <Text className="font-general-sans-medium text-3xl text-white">
                Order {order.id}
              </Text>
              <Ionicons name="chevron-back" color={"#7daeb5"} size={28} />
            </View>
          ),
          gestureEnabled: false,
        }}
      />
      <ScrollView className="h-full w-full">
        <View className="flex-row flex-wrap space-x-5 pt-2">
          {orderDetails?.items?.map((item) => (
            <ListingSquare
              price={item.price}
              sellerName={item.sellerName}
              key={item.id}
              imageUrls={item.imagePaths}
              size={item.size}
            />
          ))}
          <View className="p-40" />
        </View>
      </ScrollView>
      <View className="absolute bottom-0 w-full rounded-t-3xl bg-neutral-50 p-5 shadow-lg shadow-neutral-300">
        <Text className="font-general-sans-semibold pb-1 text-lg text-[#e74242]">
          Needs to be Shipped
        </Text>
        <Text className="font-general-sans-medium pb-1">
          Order date: {order.date}
        </Text>
        <View className="flex-row justify-between">
          <Text className="font-general-sans-regular">Sold to: Purchaser</Text>
          <View className="flex-row items-center justify-end">
            <Text className="font-general-sans-regular text-base">
              Sale Total:{" "}
            </Text>
            <Text className="font-general-sans-semibold w-20 text-lg text-[#b8a665]">
              ${order.price}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-end pb-2">
          <Text className="font-general-sans-regular text-base">
            Processing Fees:{" "}
          </Text>
          <Text className="font-general-sans-semibold w-20 text-lg text-[#b8a665]">
            $7.99
          </Text>
        </View>
        <View className="w-full items-end">
          <View className="w-1/2 flex-row items-center justify-end border-t-[1px] border-t-neutral-300 pb-3 pt-1">
            <Text className="font-general-sans-medium text-lg">
              Total Profit:{" "}
            </Text>
            <Text className="font-general-sans-semibold w-20 text-lg text-[#b8a665]">
              ${orderDetails?.price ? orderDetails?.price - 7.99 : "0"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between p-4 pt-2">
          <Pressable
            className="rounded-2xl bg-[#7daeb5] px-1 shadow-sm shadow-neutral-300"
            onPress={() => console.log("get shipping label")}
          >
            <Text className="font-general-sans-medium p-1 text-lg text-white">
              Get shipping label
            </Text>
          </Pressable>
          <Pressable
            className="rounded-2xl bg-[#e7e6e5] px-1  shadow-sm shadow-neutral-300"
            onPress={() => console.log("track order")}
          >
            <Text className="font-general-sans-medium p-1 text-lg text-[#4b8891]">
              Track order
            </Text>
          </Pressable>
        </View>
        <View className="items-center">
          <Text className="font-general-sans-medium pb-1 text-base">
            Please have shipped by: May 27, 2023
          </Text>
        </View>

        <View className="p-2" />
      </View>
    </SafeAreaView>
  );
};

export default SalesDetails;
