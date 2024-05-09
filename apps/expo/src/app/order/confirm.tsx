import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { type SetupParams } from "@stripe/stripe-react-native/lib/typescript/src/types/PaymentSheet";
import { useMutation, useQuery } from "@tanstack/react-query";

import { getOrderCost, type Costs } from "~/utils/checkout";
import { paymentIntentClientSecretToPaymentIntent } from "~/utils/stripe";
import { COLORS } from "~/utils/theme";
import AppButton from "~/components/shared/AppButton";
import useAPI from "~/hooks/useAPI";

const ConfirmOrderScreen = () => {
  const router = useRouter();
  const { failedCheckout } = useAPI();
  const { userId } = useAuth();
  const { mutate: failCheckout } = useMutation({
    mutationKey: ["/api/notifications/delete"],
    mutationFn: (cart: string[]) => failedCheckout(userId as string, cart),
  });

  setTimeout(() => {
    //SET LISTING STATUSES BACK TO AVAILABLE
    if (cart) {
      const cartIds = cart.map((item) => item.id);
      void failCheckout(cartIds);
    }
    router.replace("cart");
  }, 600000);
  setTimeout(() => {
    setCurrentTime(currentTime - 1000);
  }, 1000);
  const [currentTime, setCurrentTime] = useState(600000);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { getOrderById, purchase, getListingsInCart } = useAPI();
  const { paymentIntentClientSecret, ephemeralKey, customer, orderId } =
    useLocalSearchParams();

  //  Gets order by id on load
  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: [`/api/order/${orderId}`],
    queryFn: async () => getOrderById(orderId as string),
  });

  // Calculate order subtotal, shipping, and total costs
  const {
    data: costs,
    isLoading: isCostsLoading,
    refetch: refetchCost,
  } = useQuery({
    queryKey: [`order/${orderId}/costs`],
    queryFn: () => {
      if (!order || isOrderLoading) {
        return { subtotal: 0, shipping: 0, total: 0 } as Costs;
      }
      return getOrderCost(order);
    },
  });

  // Gets listings from cart in db on load
  const { data: cart, isLoading: isCartLoading } = useQuery({
    queryKey: [`/api/cart/${userId}`],
    queryFn: () => getListingsInCart(userId as string),
  });

  // Refetches costs once order loads
  useEffect(() => {
    if (order && !isOrderLoading) {
      void refetchCost();
    }
  }, [order, isOrderLoading, refetchCost]);

  // This initializes the order flow by opening the payment sheet
  const initPayment = async () => {
    const paymentSheetParams: SetupParams = {
      merchantDisplayName: "Sprift Inc.",
      paymentIntentClientSecret: paymentIntentClientSecret as string,
      customerId: customer as string,
      customerEphemeralKeySecret: ephemeralKey as string,
      style: "alwaysLight",
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      // Implement when we add apple pay later
      // applePay: {
      //   merchantCountryCode: "US",
      // },
    };

    // Initialize payment sheet
    const initPaymentResponse = await initPaymentSheet(paymentSheetParams);

    if (initPaymentResponse.error) {
      console.error(initPaymentResponse.error);
      Alert.alert("Something went wrong.");
      return;
    }

    const paymentResponse = await presentPaymentSheet();

    if (paymentResponse.error) {
      Alert.alert(
        `Error code: ${paymentResponse.error.code}`,
        paymentResponse.error.message,
      );
      return;
    }

    setPlacingOrder(true);
    const order = await purchase(
      userId as string,
      paymentIntentClientSecretToPaymentIntent(
        paymentIntentClientSecret as string,
      ),
    );

    // Redirect to purchase details screen
    router.replace({
      pathname: "/purchase-details",
      params: { orderId: order.id },
    });
    setPlacingOrder(false);
  };

  const BottomBar = ({ costs }: { costs: Costs }) => {
    return (
      <View className="w-full rounded-lg border-t-[1px] border-neutral-300 bg-neutral-50 p-5">
        {/* Checkout information */}
        <View className="mb-5 space-y-4">
          <View className="flex-row">
            <View>
              <Text className="text-accent-900 font-general-sans-medium text-lg">
                Subtotal
              </Text>
            </View>
            <View className="ml-auto">
              <Text className="text-accent-900 font-general-sans-medium ml-auto text-lg">
                {`$${costs.subtotal.toFixed(2)}`}
              </Text>
            </View>
          </View>

          {
            <View className="flex-row">
              <View>
                <Text className="text-accent-900 font-general-sans-medium text-lg">
                  Shipping
                </Text>
              </View>
              <View className="ml-auto">
                <Text className="text-accent-900 font-general-sans-medium text-lg">
                  {`$${costs.shipping.toFixed(2)}`}
                </Text>
              </View>
            </View>
          }
          <View className="flex-row">
            <View>
              <Text className="text-accent-900 font-general-sans-bold text-lg">
                Total
              </Text>
            </View>
            <View className="ml-auto">
              <Text className="text-accent-900 font-general-sans-bold text-lg">
                {`$${costs.total.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-5">
          <AppButton
            onPress={() => {
              void initPayment();
            }}
            disabled={placingOrder}
            title="Confirm and Checkout"
            rounded
            backgroundColor={COLORS.primary[500]}
            textColor={COLORS.neutral[50]}
          />
        </View>
      </View>
    );
  };

  interface CartItemProps {
    id: string;
    sellerName: string;
    description: string;
    price: number;
    uri: string;
  }

  const CartItem: React.FC<CartItemProps> = ({
    sellerName,
    description,
    price,
    uri,
  }) => {
    return (
      <View className="mb-4 h-28">
        <View className="h-full flex-row items-center rounded-lg bg-[#e9ebec] py-1">
          <View className="w-[26%] items-center pt-1">
            <Image
              alt="item"
              source={{ uri }}
              className="aspect-square h-[70%] rounded-lg"
            />
          </View>

          <View className="h-full w-[74%] p-1">
            <Text className="text-accent-800 font-general-sans-medium w-40">
              {sellerName}
            </Text>
            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              className="font-general-sans-regular text-neutral-500"
            >
              {description}
            </Text>
            <Text className="text-accent-800 text-md font-general-sans-semibold mt-2">
              ${price.toFixed(2)}
            </Text>
          </View>
          <View className="h-full w-[26%] items-center justify-center pt-1">
            <Image
              alt="item"
              source={{ uri: uri }}
              className="aspect-square h-[70%] rounded-lg"
            />
            <Text className="text-accent-800 text-md font-general-sans-semibold text-center">
              ${price}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (
    isCartLoading ||
    isOrderLoading ||
    !paymentIntentClientSecret ||
    !ephemeralKey ||
    !customer ||
    !orderId ||
    !order ||
    isCostsLoading ||
    !costs
  ) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <Stack.Screen
          options={{
            animation: "slide_from_bottom",
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

  return (
    <SafeAreaView className="h-full bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      {placingOrder && (
        <View className="h-full flex-1 justify-center bg-neutral-50 px-3 pt-5">
          <ActivityIndicator size="large" />
        </View>
      )}
      {!placingOrder && (
        <View className="flex-grow">
          <View className="z-50 w-full rounded-full px-5 pt-4">
            <View className="w-full flex-row items-center justify-between">
              <Pressable
                onPress={() => {
                  if (cart) {
                    failCheckout(cart.map((item) => item.id));
                    router.back();
                  }
                }}
              >
                <Ionicons
                  name="arrow-back"
                  color={COLORS.accent[900]}
                  size={22}
                />
              </Pressable>
              <Text className="font-general-sans-medium text-primary-500 text-3xl font-bold">
                Confirm Order
              </Text>
              <Ionicons name="arrow-back" color="transparent" size={22} />
            </View>
          </View>
          <Text className="font-general-sans-medium text-secondary-500 w-full px-8 pt-2 text-center">
            Complete you order in {Math.floor(currentTime / 60000)}:
            {(currentTime % 60000) / 1000 < 10 ? "0" : ""}
            {(currentTime % 60000) / 1000}, or you will be redirected back to
            your cart!
          </Text>

          <View
            style={{
              height: Dimensions.get("screen").height - 380,
              width: Dimensions.get("screen").width,
            }}
            className="px-3 pt-10"
          >
            <FlashList
              showsVerticalScrollIndicator={false}
              data={cart}
              renderItem={({ item }) => {
                console.log(item);
                return (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    sellerName={item.sellerName}
                    description={item.description}
                    price={item.price}
                    uri={item.uri == null ? "" : item.uri}
                  />
                );
              }}
              estimatedItemSize={10}
            />
          </View>
        </View>
      )}

      <BottomBar costs={costs} />
    </SafeAreaView>
  );
};

export default ConfirmOrderScreen;
