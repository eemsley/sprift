import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ScrollView,
} from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { mockKeywords } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import Keyword from "~/components/onboarding/Keyword";
import AppButton from "~/components/shared/AppButton";

const EditListingScreen = () => {
  const listing = {
    id: "1",
    description: "This is a description",
    price: 10,
    size: "M",
    keywords: ["keyword1", "keyword2", "keyword3"],
    imageUris: [require("../../assets/testImages/Listing1Image1.jpg")],
  };
  const updateListing = () => {
    //FOR BACKEND
    console.log(keywords, imageUris, description, priceText, size);
  };
  const exit = () => {
    //TODO ADD NAVIGATION
    Alert.alert(
      "Discard Edits?",
      "Are you sure you want to exit? Progress will be lost.",
      [
        { text: "Exit", onPress: () => console.log("exit") },
        { text: "Cancel", onPress: () => console.log("cancel") },
      ],
    );
  };
  const [keywords, setKeywords] = useState<KeywordSelection[]>(mockKeywords); //FOR BACKEND
  const [description, setDescription] = useState<string>(listing.description); //FOR BACKEND
  const [priceText, setPriceText] = useState<string>(listing.price.toString()); //FOR BACKEND
  const [size, setSize] = useState<string>(listing.size); //FOR BACKEND

  const [imageUris, setImageUris] = useState<{ uri: string }[]>(
    listing.imageUris,
  ); //FOR BACKEND

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

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("need access to gallery for this app to work");
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
      alert("need access to gallery for this app to work");
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

  return (
    <SafeAreaView className="bg-primary-500 h-full items-center">
      <View className=" bg-primary-500 top-0 h-auto w-full flex-row items-center justify-center">
        <Text className="font-satoshi-bold text-2xl text-slate-100">
          Edit Listing
        </Text>
      </View>
      <ScrollView className="h-full w-full bg-slate-100">
        <View className="h-auto w-full items-center justify-center px-4 pt-4">
          <Text className="font-general-sans-medium w-full text-left text-sm text-neutral-600">
            When replacing images keep in mind:
          </Text>
          <Text className="font-general-sans-medium w-full pl-5 text-left text-sm text-neutral-600">
            - photos should be well lit and clear
            {"\n"}- you must have at least 1 and at most 6 photos
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
        <View className=" h-[20%] w-full ">
          <ScrollView
            horizontal={true}
            className="h-full w-full flex-row bg-slate-200 px-1 py-2"
          >
            {imageUris.length != 0 ? (
              imagesLarge
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className=" font-general-sans-medium h-10 pl-28 pr-28 text-center text-sm text-neutral-600">
                  Add at least one photo!
                </Text>
              </View>
            )}
            <View className="h-full w-2" />
          </ScrollView>
        </View>
        <View className="h-1/4 w-full justify-start px-4 pt-4">
          <Text className="font-general-sans-medium pb-2 text-left text-sm text-neutral-600">
            Describe your item. Be detailed and specific as to answer any
            questions your customers may have
          </Text>
          <TextInput
            className=" font-general-sans-medium mb-4 h-1/4 flex-wrap rounded-xl border border-neutral-300 bg-slate-200 px-4"
            placeholder="Description"
            keyboardType="default"
            multiline={true}
            onChangeText={(text) => setDescription(text)}
            value={description}
          />
          <Text className="font-general-sans-medium pb-2 text-left text-sm text-neutral-600">
            Enter a price. Keep in mind shipping costs are calculated and added
            later.
          </Text>
          <TextInput
            className="font-general-sans-medium mb-4 h-10 rounded-xl border border-neutral-300 bg-slate-200 px-4"
            placeholder="Price"
            keyboardType="numeric"
            onChangeText={(text) => setPriceText(text)}
            value={priceText}
          />
          <Text className="font-general-sans-medium pb-2 text-left text-sm text-neutral-600">
            Enter a size. Be specific, and if you are unsure please specify this
            in the description and enter your best estimate.
          </Text>
          <TextInput
            className="font-general-sans-medium h-10 rounded-xl border border-neutral-300 bg-slate-200 px-4"
            placeholder="Size"
            keyboardType="default"
            onChangeText={(text) => setSize(text)}
            value={size}
          />
        </View>
        <View className="h-auto w-full flex-row flex-wrap items-center justify-center ">
          <Text className="font-general-sans-medium px-4 py-4 text-center text-sm text-neutral-600">
            Select the keywords below which best apply to your item. This isn{"\'"}t
            required, but it helps us find you the right customer quickly and
            get your item sold ASAP!
          </Text>
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
        <View className=" h-72 w-full" />
        <View className="h-72 w-full" />
      </ScrollView>

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
            title="Update Listing"
            disabled={
              imageUris.length == 0 ||
              description === "" ||
              priceText === "" ||
              size === ""
            }
            backgroundColor={
              imageUris.length == 0 ||
              description === "" ||
              priceText === "" ||
              size === ""
                ? COLORS.primary[50]
                : COLORS.primary[500]
            }
            highlightedColor={COLORS.primary[600]}
            textColor="white"
            onPress={updateListing}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditListingScreen;
