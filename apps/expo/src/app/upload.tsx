import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeIn } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import {
  AddressSheet,
  AddressSheetError,
  type AddressDetails,
} from "@stripe/stripe-react-native";
import { useMutation, useQuery } from "@tanstack/react-query";

import { clothingTypes, genders, sizeOptions } from "~/utils/constants";
import { mockKeywords } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import Keyword from "~/components/onboarding/Keyword";
import AppButton from "~/components/shared/AppButton";
import useAPI from "~/hooks/useAPI";

const UploadScreen = () => {
  const uploadListing = async () => {
    try {
      const newListing = await createListing(
        userId as string,
        clothingType,
        size,
        parseFloat(price),
        description,
        gender == "Women" ? "F" : gender.charAt(0).toString(),
        parseFloat(weight),
        weightUnit,
        imageUris.map((uri, index) => `${userId}${index + 1}`),
        keywords
          .filter((keyword) => keyword.selected)
          .map((keyword) => keyword.keyword),
      );

      for (let i = 0; i < imageUris.length; i++) {
        try {
          // 1: Get presigned url by passing in name and type of image
          const { url: presignedUrl } = await getImageUploadLink(
            `listings/${userId}_${newListing.id}_${i + 1}`,
            "image/jpeg",
          );

          // 2: Upload image to presigned url
          await fetch(presignedUrl, {
            method: "PUT",
            body: imageUris[i] as never,
            headers: {
              "Content-Type": "image/jpeg",
            },
          });
        } catch (err) {
          console.log(err);
          return;
        }
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error Creating Listing, Please try again later");
      router.replace("/account");
      return;
    }
    //created listing, now upload images

    router.replace("/account");
  };

  const router = useRouter();
  const {
    getUserBillingDetails,
    updateUserBillingDetails: updateUserBillingDetailsCall,
    createListing,
    getImageUploadLink,
  } = useAPI();
  const exit = () => {
    //TODO ADD NAVIGATION
    Alert.alert(
      "Discard Listing?",
      "Are you sure you want to exit? Progress will be lost.",
      [
        { text: "Exit", onPress: () => router.replace("/account") },
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
      ],
    );
  };

  const { userId } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  //SHIPPING
  const [addressSheetVisible, setAddressSheetVisible] = useState(false);
  //SHIPPING
  // Call to update billing info
  const {
    mutate: updateUserBillingDetails,
    isLoading: isUpdatingUserBillingDetails,
  } = useMutation({
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

  enum UploadScreenCurrentScreen {
    UPLOAD_PHOTOS = "UPLOAD_PHOTOS",
    UPLOAD_DETAILS = "UPLOAD_DETAILS",
    UPLOAD_KEYWORDS = "UPLOAD_KEYWORDS",
    VERIFY_SHIPPING = "VERIFY_SHIPPING",
  }
  const [currentScreen, setCurrentScreen] = useState<UploadScreenCurrentScreen>(
    UploadScreenCurrentScreen.UPLOAD_PHOTOS,
  );

  const [keywords, setKeywords] = useState<KeywordSelection[]>(mockKeywords); //FOR BACKEND
  const [description, setDescription] = useState<string>(""); //FOR BACKEND
  const [price, setPrice] = useState<string>(""); //FOR BACKEND
  const [size, setSize] = useState<string>(""); //FOR BACKEND
  const [clothingType, setClothingType] = useState<string>(""); //FOR BACKEND
  const [gender, setGender] = useState<string>(""); //FOR BACKEND
  const [weight, setWeight] = useState<string>(""); //FOR BACKEND
  const [weightUnit, setWeightUnit] = useState<string>("LBS"); //FOR BACKEND

  interface KeywordSelection {
    keyword: string;
    selected: boolean;
  }

  const selectKeyword = (keyword: KeywordSelection) => {
    const keywordIndex = keywords.findIndex(
      (k) => k.keyword === keyword.keyword,
    );
    if (keywordIndex !== -1) {
      const updatedKeywords: KeywordSelection[] = [...keywords];
      if (updatedKeywords[keywordIndex] !== undefined) {
        updatedKeywords[keywordIndex] = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...updatedKeywords[keywordIndex]!,
          selected: !updatedKeywords[keywordIndex]?.selected,
        };
      }
      setKeywords(updatedKeywords);
    }
  };

  const [imageUris, setImageUris] = useState<{ uri: string }[]>([]);
  const imagesLarge = imageUris.map((imageUri, index) => (
    <View key={index}>
      <View className="absolute left-2 top-1 z-10 aspect-square h-5 items-center justify-center rounded-full bg-red-100">
        <Ionicons
          name="close-outline"
          size={18}
          color="red"
          onPress={() => {
            if (imageUris.length == 1) setImageUris([]);
            else setImageUris(imageUris.filter((uri) => uri !== imageUri));
          }}
        />
      </View>
      <Image
        alt="Upload Photos  "
        source={imageUri}
        className="mx-1 h-full w-64 rounded-md "
      />
    </View>
  ));
  const imagesSmall = imageUris.map((imageUri, index) => (
    <Image
      key={index}
      alt="Upload Photos  "
      source={imageUri}
      className="mx-1 h-full w-28 rounded-md"
    />
  ));
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert(
        "We need access to your gallery to upload photos.\n\nPlease go to \nSettings -> Sprift -> Photos \nand enable access!",
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0] != undefined) {
        const source = { uri: result.assets[0].uri };
        setImageUris([...imageUris, source]);
      }
    }
  };
  const takeImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert(
        "We need access to your camera to take photos.\n\nPlease go to \nSettings -> Sprift -> Camera \nand enable access!",
      );
    } else {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0] != undefined) {
        const source = { uri: result.assets[0].uri };
        setImageUris([...imageUris, source]);
      }
    }
  };

  if (currentScreen === UploadScreenCurrentScreen.UPLOAD_PHOTOS) {
    return (
      <SafeAreaView className="h-full items-center">
        <View className=" h-auto w-full flex-row items-center justify-center">
          <Text className="font-satoshi-bold text-primary-500 text-2xl">
            Create New Listing
          </Text>
        </View>
        <View className=" h-1/4 w-full items-center justify-center px-4">
          <Text className="font-general-sans-medium w-full pb-2 text-left text-sm text-neutral-600">
            First, upload from 1 to 6 photos of your clothing item!
          </Text>
          <Text className="font-general-sans-medium w-full text-left text-sm text-neutral-600">
            Keep in mind:
          </Text>
          <Text className="font-general-sans-medium w-full pl-5 text-left text-sm text-neutral-600">
            - photos should be well lit and clear
            {"\n"}- include photos from all sides of your item
            {"\n"}- consider including photos of the tags
            {"\n"}- vertical photos are preferred
            {"\n"}- innapropriate photos will be flagged and removed
          </Text>
        </View>
        <View className="w-full flex-row px-3 py-5">
          <View className="w-1/2 pr-3">
            <AppButton
              disabled={imageUris.length >= 6}
              title="Upload Photo"
              backgroundColor={
                imageUris.length < 6 ? COLORS.primary[500] : COLORS.primary[50]
              }
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={() => void pickImage()}
            />
          </View>
          <View className="w-1/2 pl-3">
            <AppButton
              disabled={imageUris.length >= 6}
              title="Take Photo"
              backgroundColor={
                imageUris.length < 6 ? COLORS.primary[500] : COLORS.primary[50]
              }
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={() => void takeImage()}
            />
          </View>
        </View>
        <View className="h-1/2 w-full">
          <ScrollView
            horizontal={true}
            className="h-full w-full flex-row bg-slate-200 px-1 py-2"
          >
            {imageUris.length != 0 ? (
              imagesLarge
            ) : (
              <Text className=" font-general-sans-medium mt-28 h-10 pl-28 pr-28 text-center text-sm text-neutral-600">
                Add at least one photo!
              </Text>
            )}
            <View className="h-full w-2" />
          </ScrollView>
        </View>

        <View className="absolute bottom-10 h-auto w-full flex-row px-3">
          <View className="w-1/2 pr-3">
            <AppButton
              title="Exit"
              backgroundColor={COLORS.primary[500]}
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={exit}
            />
          </View>
          <View className="w-1/2 pl-3">
            <AppButton
              title="Next"
              disabled={imageUris.length == 0}
              backgroundColor={
                imageUris.length == 0 ? COLORS.primary[50] : COLORS.primary[500]
              }
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={() => {
                setCurrentScreen(UploadScreenCurrentScreen.UPLOAD_DETAILS);
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  } else if (currentScreen === UploadScreenCurrentScreen.UPLOAD_DETAILS) {
    return (
      <View>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView className="h-full items-center ">
            <KeyboardAwareScrollView className="h-full w-full">
              <View className=" h-auto w-full items-center justify-center">
                <Text className="font-satoshi-bold text-primary-500 text-2xl">
                  Create New Listing
                </Text>
              </View>

              <View className="w-full justify-start px-4 pt-8">
                <View className="h-40 w-full">
                  <ScrollView
                    horizontal={true}
                    className="w-full flex-row bg-neutral-300 px-1 py-2"
                  >
                    {imagesSmall}
                  </ScrollView>
                </View>
                <Text className="font-general-sans-medium pb-2 pt-8 text-left text-sm text-neutral-600">
                  Describe your item. Be detailed and specific as to answer any
                  questions your customers may have
                </Text>
                <TextInput
                  className=" font-general-sans-medium mb-4 h-32 flex-wrap rounded-xl border border-neutral-400 bg-neutral-200 px-4"
                  placeholder="Description"
                  keyboardType="default"
                  multiline={true}
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                  placeholderTextColor={COLORS.neutral[400]}
                />
                <Text className="font-general-sans-medium pb-2 pt-2 text-left text-sm text-neutral-600">
                  Enter a price. Keep in mind shipping costs are calculated and
                  added later.
                </Text>
                <View className="mb-4 h-10 flex-row items-center rounded-xl border border-neutral-400 bg-neutral-200 px-3">
                  <Text className="font-general-sans-medium pr-1 text-center text-sm text-neutral-600">
                    $
                  </Text>
                  <TextInput
                    className="font-general-sans-medium h-full w-full"
                    placeholder="Price"
                    keyboardType="numeric"
                    onChangeText={(text) => setPrice(text)}
                    value={price}
                    returnKeyType="done"
                  />
                </View>
                <Text className="font-general-sans-medium pb-2 pt-2 text-left text-sm text-neutral-600">
                  Enter a size. Be specific, and if you are unsure please
                  specify this in the description and enter your best estimate.
                </Text>
                <SelectList
                  setSelected={(value: string) => {
                    setSize(value);
                  }}
                  save="value"
                  data={sizeOptions}
                  boxStyles={{
                    backgroundColor: COLORS.neutral[200],
                    borderColor: COLORS.neutral[400],
                    height: 45,
                    borderRadius: 14,
                  }}
                  dropdownTextStyles={{ color: COLORS.neutral[500] }}
                  inputStyles={{ color: COLORS.neutral[500] }}
                  search={true}
                  searchPlaceholder="Search for a size"
                  placeholder={size === "" ? "Select Size" : size}
                />
                <Text className="font-general-sans-medium pb-2 pt-4 text-left text-sm text-neutral-600">
                  Select a clothing type which best describes your item.
                </Text>
                <SelectList
                  setSelected={(val: string) => setClothingType(val)}
                  data={clothingTypes}
                  save="value"
                  boxStyles={{
                    backgroundColor: COLORS.neutral[200],
                    borderColor: COLORS.neutral[400],
                    height: 45,
                    borderRadius: 14,
                  }}
                  dropdownTextStyles={{ color: COLORS.neutral[500] }}
                  inputStyles={{ color: COLORS.neutral[500] }}
                  search={false}
                  placeholder={
                    clothingType === "" ? "Select Clothing Type" : clothingType
                  }
                />
                <Text className="font-general-sans-medium pb-2 pt-4 text-left text-sm text-neutral-600">
                  Select the gender which best describes your item.
                </Text>
                <SelectList
                  setSelected={(val: string) => setGender(val)}
                  data={genders}
                  save="value"
                  boxStyles={{
                    backgroundColor: COLORS.neutral[200],
                    borderColor: COLORS.neutral[400],
                    height: 45,
                    borderRadius: 14,
                  }}
                  dropdownTextStyles={{ color: COLORS.neutral[500] }}
                  inputStyles={{ color: COLORS.neutral[500] }}
                  search={false}
                  placeholder={gender === "" ? "Select Gender" : gender}
                />
                <Text className="font-general-sans-medium pb-2 pt-4 text-left text-sm text-neutral-600">
                  Enter the weight of your item.
                </Text>
                <View className="h-14 w-full flex-row items-center">
                  <TextInput
                    className="font-general-sans-medium h-10 w-1/2 rounded-xl border border-neutral-400 bg-neutral-200 px-4"
                    placeholder="Weight"
                    keyboardType="numeric"
                    onChangeText={(text) => setWeight(text)}
                    placeholderTextColor={COLORS.neutral[400]}
                    returnKeyType="done"
                    value={weight}
                  />
                  <Pressable
                    onPress={() => setWeightUnit("OZ")}
                    className={`${
                      weightUnit === "OZ"
                        ? "bg-primary-300 border-neutral-300"
                        : "bg-beutral-300 border-primary-300"
                    } ml-3 mr-1 h-2/3 w-1/5 justify-center rounded-xl border`}
                  >
                    <Text
                      className={`font-general-sans-medium ${
                        weightUnit === "OZ"
                          ? "text-neutral-300"
                          : "text-primary-200"
                      } text-center text-sm`}
                    >
                      OZ
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setWeightUnit("LBS")}
                    className={`${
                      weightUnit === "LBS"
                        ? "bg-primary-300 border-neutral-300"
                        : "bg-beutral-300 border-primary-300"
                    } ml-3 mr-1 h-2/3 w-1/5 justify-center rounded-xl border`}
                  >
                    <Text
                      className={`font-general-sans-medium ${
                        weightUnit === "OZ"
                          ? "text-primary-300"
                          : "text-neutral-200"
                      } text-center text-sm`}
                    >
                      LBS
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="h-80" />
            </KeyboardAwareScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
        <View className="absolute bottom-10 h-auto w-full flex-row px-3">
          <View className="w-1/2 pr-3">
            <AppButton
              title="Back"
              backgroundColor={COLORS.primary[500]}
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={() => {
                setCurrentScreen(UploadScreenCurrentScreen.UPLOAD_PHOTOS);
              }}
            />
          </View>
          <View className="w-1/2 pl-3">
            <AppButton
              title="Next"
              backgroundColor={
                description === "" ||
                price === "" ||
                size === "" ||
                clothingType == "" ||
                gender == "" ||
                weight == ""
                  ? COLORS.primary[50]
                  : COLORS.primary[500]
              }
              highlightedColor={COLORS.primary[600]}
              disabled={
                description === "" ||
                price === "" ||
                size === "" ||
                clothingType == "" ||
                gender == "" ||
                weight == ""
              }
              textColor="white"
              onPress={() => {
                setCurrentScreen(UploadScreenCurrentScreen.UPLOAD_KEYWORDS);
              }}
            />
          </View>
        </View>
      </View>
    );
  } else if (currentScreen === UploadScreenCurrentScreen.UPLOAD_KEYWORDS) {
    return (
      <View>
        <SafeAreaView className="h-full items-center ">
          <View className=" h-auto w-full items-center justify-center">
            <Text className="font-satoshi-bold text-primary-500 text-2xl">
              Create New Listing
            </Text>
          </View>
          <View>
            <Text className="font-general-sans-medium px-4 py-4 text-center text-sm text-neutral-600">
              Select the keywords below which best apply to your item. This isn
              {"'"}t required, but it helps us find you the right customer
              quickly and get your item sold ASAP!
            </Text>
          </View>
          <ScrollView>
            <View className="flex-row flex-wrap items-center justify-center">
              {keywords.map((keyword: KeywordSelection, index) => (
                <Animated.View key={index} entering={FadeIn.delay(200)}>
                  <Pressable onPress={() => selectKeyword(keyword)}>
                    <Keyword
                      keyword={keyword.keyword}
                      selected={keyword.selected}
                    />
                  </Pressable>
                </Animated.View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
        <View className="absolute bottom-10 h-auto w-full flex-row px-3">
          <View className="w-1/2 pr-3">
            <AppButton
              title="Back"
              backgroundColor={COLORS.primary[500]}
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={() => {
                setCurrentScreen(UploadScreenCurrentScreen.UPLOAD_DETAILS);
              }}
            />
          </View>
          <View className="w-1/2 pl-3">
            <AppButton
              title="Next"
              backgroundColor={COLORS.primary[500]}
              highlightedColor={COLORS.primary[600]}
              textColor="white"
              onPress={() =>
                setCurrentScreen(UploadScreenCurrentScreen.VERIFY_SHIPPING)
              }
            />
          </View>
        </View>
      </View>
    );
  } else if (currentScreen === UploadScreenCurrentScreen.VERIFY_SHIPPING) {
    if (isUploading) {
      return (
        <SafeAreaView className="h-full w-full flex-row items-center justify-center">
          <Text className="font-general-sans-semibold text-md">Uploading </Text>
          <ActivityIndicator />
        </SafeAreaView>
      );
    } else
      return (
        <SafeAreaView className="h-full w-full">
          <View className="h-full w-full items-center">
            <View className="h-12 w-full flex-row items-center justify-center">
              <Text className=" text-primary-500 font-satoshi-bold text-3xl">
                Shipping Details
              </Text>
            </View>
            <View className="my-10 w-[85%] items-center justify-center rounded-3xl bg-white px-2 py-4 shadow-lg shadow-neutral-400">
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
              className="bg-primary-500 mt-10 items-center justify-center rounded-3xl p-4"
              onPress={() => setAddressSheetVisible(true)}
              disabled={
                isUploading ||
                isRefetchingBillingDetails ||
                isBillingDetailsLoading ||
                isUpdatingUserBillingDetails
              }
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
                Alert.alert(
                  "There was an error.",
                  "Check the logs for details.",
                );
                console.log(error.localizedMessage);
              }
              setAddressSheetVisible(false);
            }}
            presentationStyle={"popover"}
            appearance={{}}
          />
          <View className="absolute bottom-10 h-auto w-full flex-row px-3">
            <View className="w-1/2 pr-3">
              <AppButton
                title="Back"
                backgroundColor={COLORS.primary[500]}
                highlightedColor={COLORS.primary[600]}
                textColor="white"
                onPress={() => {
                  setCurrentScreen(UploadScreenCurrentScreen.UPLOAD_KEYWORDS);
                }}
                disabled={
                  isUploading ||
                  isRefetchingBillingDetails ||
                  isBillingDetailsLoading ||
                  isUpdatingUserBillingDetails
                }
              />
            </View>
            <View className="w-1/2 pl-3">
              <AppButton
                title="Confirm & Finish!"
                backgroundColor={
                  isUploading ||
                  isRefetchingBillingDetails ||
                  isBillingDetailsLoading ||
                  isUpdatingUserBillingDetails ||
                  !billingDetails ||
                  !billingDetails.city
                    ? COLORS.primary[50]
                    : COLORS.primary[500]
                }
                highlightedColor={COLORS.primary[600]}
                textColor="white"
                onPress={() => {
                  setIsUploading(true);
                  void uploadListing();
                }}
                disabled={
                  isUploading ||
                  isRefetchingBillingDetails ||
                  isBillingDetailsLoading ||
                  isUpdatingUserBillingDetails ||
                  !billingDetails ||
                  !billingDetails.city
                }
              />
            </View>
          </View>
        </SafeAreaView>
      );
  }
};

export default UploadScreen;
