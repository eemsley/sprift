import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import {
  AddressSheet,
  AddressSheetError,
  type AddressDetails,
} from "@stripe/stripe-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

const ShippingScreen = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);
  const {
    getUserBillingDetails,
    updateUserBillingDetails: updateUserBillingDetailsCall,
  } = useAPI();
  //SHIPPING
  // Call to update billing info
  const { mutate: updateUserBillingDetails } = useMutation({
    mutationKey: ["/api/user/billing-details/update"],
    mutationFn: (billingDetails: BillingDetails) =>
      updateUserBillingDetailsCall(userId as string, billingDetails),
    onSuccess: () => {
      void refetchBillingDetails();
      setAddressSheetVisible(false);
    },
  });
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

  // Gets user billing details on load
  const {
    data: billingDetails,
    isLoading: isBillingDetailsLoading,
    refetch: refetchBillingDetails,
    isRefetching: isRefetchingBillingDetails,
  } = useQuery({
    queryKey: ["/api/user/billing-details"],
    queryFn: () => getUserBillingDetails(userId as string),
  });

  return (
    <SafeAreaView className="h-full">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <View className="h-full w-full items-center">
        <View className="h-12 w-full flex-row items-center justify-between px-5">
          <Pressable onPress={() => router.back()}>
            <Ionicons
              color={COLORS.neutral[600]}
              name="chevron-back-outline"
              size={24}
            />
          </Pressable>
          <Text className=" text-primary-500 font-satoshi-bold text-3xl">
            Shipping Details
          </Text>
          <Ionicons
            color={"transparent"}
            name="chevron-back-outline"
            size={24}
          />
        </View>
        <View className="my-10 w-[85%] items-center justify-center rounded-3xl bg-white px-2 py-4 shadow-lg shadow-neutral-300">
          {isBillingDetailsLoading || isRefetchingBillingDetails ? (
            <View className="h-64 w-full items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <Text className="font-general-sans-medium text-xl">
              Name: {billingDetails?.name}
              {"\n"}
              City: {billingDetails?.city}
              {"\n"}
              Country: {billingDetails?.country}
              {"\n"}
              Email: {billingDetails?.email}
              {"\n"}
              Phone: {billingDetails?.phone}
              {"\n"}
              State: {billingDetails?.state}
              {"\n"}
              Street 1: {billingDetails?.street1}
              {"\n"}
              Street 2: {billingDetails?.street2 || "N/A"}
              {"\n"}
              Zip: {billingDetails?.zip}
            </Text>
          )}
        </View>
        <Pressable
          className="bg-primary-500 mt-10 items-center justify-center rounded-2xl p-4 shadow-sm"
          onPress={() => setAddressSheetVisible(true)}
        >
          <Text className="font-general-sans-medium text-white">
            Update Shipping Details
          </Text>
        </Pressable>
      </View>
      <AddressSheet
        visible={addressSheetVisible}
        additionalFields={{ phoneNumber: "required" }}
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
        appearance={{}}
      />
    </SafeAreaView>
  );
};

export default ShippingScreen;
