import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import {
  AddressSheet,
  AddressSheetError,
  type AddressDetails,
} from "@stripe/stripe-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import BottomBar from "~/components/cart/BottomBar";
import CartItem from "~/components/cart/CartItem";
import useAPI from "~/hooks/useAPI";

export interface CartItemType {
  id: string;
  sellerName: string;
  sellerId: string;
  description: string;
  price: number;
  uri: string;
}

const CartScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const {
    getListingsInCart,
    removeListingFromCart,
    addToSavedForLater,
    createPaymentIntent: createPaymentIntentCall,
    updateUserBillingDetails: updateUserBillingDetailsCall,
    getUserBillingDetails,
  } = useAPI();

  const [addressSheetVisible, setAddressSheetVisible] = useState(false);

  // Gets listings from cart in db on load
  const {
    data: cart,
    isLoading: isCartLoading,
    refetch: refetchCart,
    remove,
  } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: () => getListingsInCart(userId as string),
    refetchInterval: 2000,
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchCart();
    setRefreshing(false);
  };

  // Gets billing details on load
  const { data: billingDetails, isLoading: isBillingDetailsLoading } = useQuery(
    {
      queryKey: [`/api/user/${userId}/billing-details`],
      queryFn: () => getUserBillingDetails(userId as string),
    },
  );

  const {
    data: subtotal,
    isLoading: isSubtotalLoading,
    refetch: refetchSubtotal,
  } = useQuery({
    queryKey: [`cart/${userId}/subtotal`],
    queryFn: () => {
      if (!cart) {
        return 0;
      }
      return cart.reduce(
        (subtotal: number, item: CartItemType) =>
          (subtotal = item.price + subtotal),
        0,
      );
    },
  });

  // Call to remove listing from cart
  const { mutate: removeFromCart } = useMutation({
    mutationKey: ["/api/cart/remove"],
    mutationFn: (listingId: string) =>
      removeListingFromCart(userId as string, listingId),
    onSuccess: () => {
      // Refetch
      void refetchCart();
    },
  });

  // Call to update billing info
  const { mutate: updateUserBillingDetails } = useMutation({
    mutationKey: ["/api/user/billing-details/update"],
    mutationFn: (billingDetails: BillingDetails) =>
      updateUserBillingDetailsCall(userId as string, billingDetails),
    onSuccess: () => {
      setAddressSheetVisible(false);
      createPaymentIntent(cart as CartItemType[]);
    },
  });

  const onUpdateBillingInfo = (billingDetails: AddressDetails) => {
    const newBillingDetails = {
      name: billingDetails.name,
      phone: billingDetails.phone,
      street1: billingDetails.address?.line1,
      street2: billingDetails.address?.line2,
      city: billingDetails.address?.city,
      state: billingDetails.address?.state,
      zip: billingDetails.address?.postalCode,
      country: billingDetails.address?.country,
    };

    // Update billing details in API
    updateUserBillingDetails(newBillingDetails);
    setAddressSheetVisible(false);
  };

  // Creates payment intent and initializes order lifecycle
  const { mutate: createPaymentIntent, isLoading: isCreatingPaymentIntent } =
    useMutation({
      mutationKey: ["/api/stripe/create-payment-intent"],
      mutationFn: (cart: CartItemType[]) =>
        createPaymentIntentCall(
          userId as string,
          cart.map(({ id }) => id),
        ),
      onSuccess: ({
        paymentIntentClientSecret,
        ephemeralKey,
        customer,
        orderId,
      }) => {
        setAddressSheetVisible(false);

        // Navigate to order confirmation screen
        //SET LISTING STATUSES TO UNAVAILABLE
        router.push({
          pathname: "/order/confirm",
          params: {
            paymentIntentClientSecret,
            ephemeralKey,
            customer,
            orderId,
          },
        });
      },
      onError: (err) => {
        console.log(err);
      },
    });

  useFocusEffect(
    useCallback(() => {
      return () => {
        remove();
      };
    }, [remove]),
  );

  useEffect(() => {
    if (cart && !isCartLoading) {
      void refetchSubtotal();
    }
  });

  // Removes a listing from the cart
  const onRemoveFromCart = (id: string) => {
    Alert.alert("Would you like to remove this item from your cart?", "", [
      {
        text: "Cancel",
        onPress: () => {
          return null;
        },
      },
      {
        text: "Yes",
        onPress: () => {
          removeFromCart(id);
          console.log("remove " + id + "from cart");

          Alert.alert("Item removed from cart!");
        },
      },
    ]);
  };

  // Saves a listing for later
  const onAddToSaved = (listingId: string) => {
    addToSavedForLater(userId as string, listingId)
      .then((_) => {
        removeFromCart(listingId);
      })
      .catch((err) => {
        console.log(err);
        removeFromCart(listingId);
      });
  };

  if (
    isCartLoading ||
    isSubtotalLoading ||
    isBillingDetailsLoading ||
    isCreatingPaymentIntent ||
    subtotal === undefined ||
    !billingDetails
  ) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <Stack.Screen
          options={{
            animation: "slide_from_bottom",
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

  if (!cart || cart.length === 0) {
    return (
      <SafeAreaView className="bg-neutral-50">
        <Stack.Screen
          options={{
            animation: "fade",
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
            <Text className="font-general-sans-medium text-primary-500 text-3xl font-bold">
              Cart
            </Text>
            <Ionicons name="chevron-back-outline" color="transparent" size={24} />
          </View>
        </View>
        <View className="mt-64 bg-neutral-50 px-3 pt-5">
          <View className="h-full w-full items-center">
            <View className="aspect-square w-[90%] items-center">
              <Text className="font-general-sans-medium text-primary-500 text-center text-2xl">
                You have nothing in your cart!
              </Text>
              <Text className="font-general-sans-medium w-full self-center pt-4 text-center text-sm text-sky-900">
                Come back later after you add more listings.
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
          animation: "slide_from_bottom",
          headerBackVisible: false,
          headerStyle: {
            backgroundColor: COLORS.primary[500],
          },
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View className="flex-grow">
        <View className="z-50 w-full rounded-full px-5 pt-4">
          <View className="w-full flex-row items-center justify-between">
            <Pressable onPress={() => router.back()}>
              <Ionicons
                name="chevron-back-outline"
                color={COLORS.neutral[600]}
                size={24}
              />
            </Pressable>
            <Text className="font-general-sans-medium text-primary-500 text-3xl font-bold">
              Cart
            </Text>
            <Ionicons name="chevron-back-outline" color="transparent" size={24} />
          </View>
        </View>
        <View
          style={{
            height: Dimensions.get("screen").height - 340,
            width: Dimensions.get("screen").width,
          }}
          className="px-3 pt-10"
        >
          <FlashList
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => void onRefresh()}
              />
            }
            data={cart}
            renderItem={({ item }) => (
              <CartItem
                key={item.id}
                id={item.id}
                sellerName={item.sellerName}
                description={item.description}
                price={item.price}
                uri={item.uri == null ? "" : item.uri}
                onSaveForLater={() => onAddToSaved(item.id)}
                onRemoveFromCart={onRemoveFromCart}
              />
            )}
            estimatedItemSize={10}
          />
        </View>
      </View>

      <BottomBar
        subtotal={subtotal}
        setAddressSheetVisible={setAddressSheetVisible}
        isCreatingPaymentIntent={isCreatingPaymentIntent}
      />

      <AddressSheet
        visible={addressSheetVisible}
        additionalFields={{ phoneNumber: "required" }}
        defaultValues={{
          name: billingDetails.name,
          phone: billingDetails.phone,
          address: {
            country: billingDetails.country,
            city: billingDetails.city,
            line1: billingDetails.street1,
            postalCode: billingDetails.zip,
            state: billingDetails.state,
          },
        }}
        onSubmit={(addressDetails) => {
          onUpdateBillingInfo(addressDetails);
          setAddressSheetVisible(false);
        }}
        onError={(error) => {
          if (error.code === AddressSheetError.Failed) {
            Alert.alert("There was an error.", "Check the logs for details.");
            console.log(error.localizedMessage);
          }
          setAddressSheetVisible(false);
        }}
        presentationStyle={"popover"}
        allowedCountries={["US"]}
      />
    </SafeAreaView>
  );
};

interface BillingDetails {
  name?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  state?: string;
  street1?: string;
  street2?: string;
  zip?: string;
}

export default CartScreen;
