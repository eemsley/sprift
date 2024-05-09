import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

const PhotoScreen = () => {
  const router = useRouter();
  const { getImageUploadLink, updateUserProfilePic, getProfileById } = useAPI();
  const { userId } = useAuth();
  const [uploading, setUploading] = useState(false);
  const {
    data: profile,
    isLoading: _,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile by id"],
    queryFn: () => getProfileById(userId as string),
  });

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
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0] != undefined) {
        const source = { uri: result.assets[0].uri };

        const PROFILE_PIC_S3_NAME = `https://spree-images-db.s3.amazonaws.com/profile/${userId}`;

        // SEE LINEAR https://linear.app/spree/issue/SPR-187/create-listing-backend-integration
        try {
          setUploading(true);
          // 1: Get presigned url by passing in name and type of image

          const { url: presignedUrl } = await getImageUploadLink(
            `profile/${userId}`,
            "image/jpeg",
          );

          // 2: Upload image to presigned url
          await fetch(presignedUrl, {
            method: "PUT",
            body: source as never,
            headers: {
              "Content-Type": "image/jpeg",
            },
          });

          // 3: Update user profile pic
          await updateUserProfilePic(userId as string, PROFILE_PIC_S3_NAME);

          await refetchProfile();
          setUploading(false);
        } catch (err) {
          console.log(err);
          setUploading(false);
          return;
        }
      }
      setUploading(false);
    }
  };

  const takeImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert(
        "We need access to your camera to take photos.\n\nPlease go to \nSettings -> Sprift -> Camera \nand enable access!",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0] != undefined) {
      const source = { uri: result.assets[0].uri };

      const PROFILE_PIC_S3_NAME = `https://spree-images-db.s3.amazonaws.com/profile/${userId}`;

      // SEE LINEAR https://linear.app/spree/issue/SPR-187/create-listing-backend-integration
      try {
        setUploading(true);
        // 1: Get presigned url by passing in name and type of image
        const { url: presignedUrl } = await getImageUploadLink(
          `profile/${userId}`,
          "image/jpeg",
        );

        console.log("\n\nSTEP 1 DONE!\n\n");

        // 2: Upload image to presigned url
        await fetch(presignedUrl, {
          method: "PUT",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: source as any,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        console.log("\n\nSTEP 2 DONE!\n\n");

        // 3: Update user profile pic
        await updateUserProfilePic(userId as string, PROFILE_PIC_S3_NAME);
        await refetchProfile();

        setUploading(false);
        console.log("\n\nSTEP 3 DONE!\n\n");
      } catch (err) {
        console.log(err);

        setUploading(false);
        return;
      }
    }

    setUploading(false);
  };

  return (
    <SafeAreaView className="flex h-full w-full bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <View className="h-12 w-full flex-row items-center justify-between px-5">
        <Pressable onPress={() => router.back()}>
          <Ionicons
            color={COLORS.neutral[600]}
            name="chevron-back-outline"
            size={24}
          />
        </Pressable>
        <Text className=" text-primary-500 font-satoshi-bold text-3xl">
          Profile Picture
        </Text>
        <Ionicons color={"transparent"} name="chevron-back-outline" size={24} />
      </View>

      <View className="h-full w-full items-center px-4 py-24">
        {!uploading ? (
          <Image
            alt={"prof"}
            source={{ uri: `${profile?.profilePic}?${new Date().getTime()}` }}
            className="h-48 w-48 rounded-full"
          />
        ) : (
          <View className="h-48 w-48 items-center justify-center">
            <ActivityIndicator color={COLORS.secondary[400]} size="large" />
          </View>
        )}

        <View
          className="h-20 w-full flex-row justify-evenly
          "
        >
          <View className="my-12 h-12 w-1/3">
            <Pressable
              onPress={() => void takeImage()}
              className="bg-primary-500 h-12 items-center justify-center rounded-2xl"
            >
              <Text className="font-general-sans-medium text-white">
                Take Photo
              </Text>
            </Pressable>
          </View>
          <View className="my-12 h-12 w-1/3">
            <Pressable
              onPress={() => void pickImage()}
              className="bg-primary-500 h-12 items-center justify-center rounded-2xl"
            >
              <Text className="font-general-sans-medium text-white">
                Upload Photo
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default PhotoScreen;
