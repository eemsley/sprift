import { useState } from "react";
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";
import { type User } from ".prisma/client";

const BioScreen = () => {
  const { getProfileById, updateUserProfile } = useAPI();
  const { userId } = useAuth();
  const router = useRouter();
  const [bio, setBio] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  //GET profile to display current bio
  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile by id"],
    queryFn: () => getProfileById(userId as string),
  });

  const { mutate: updateBio, isLoading: isUpdatingBio } = useMutation({
    mutationKey: ["/api/profile/update/bio"],
    mutationFn: ({
      bio,
      username,
      profilePic,
      notificationsEnabled,
      id,
      followers,
      following,
      numSales,
    }: {
      bio: string;
      username: string;
      profilePic: string;
      notificationsEnabled: boolean;
      id: string;
      followers: User[];
      following: User[];
      numSales: number;
    }) =>
      updateUserProfile(userId as string, {
        bio,
        username,
        profilePic,
        notificationsEnabled,
        id,
        followers,
        following,
        numSales,
      }),
    onSuccess: (res) => {
      console.log(res);
      setUpdateMessage("Bio updated!");
      void refetchProfile();
    },
    onError: (err) => {
      console.log(err);
      setUpdateMessage("Error updating bio");
    },
  });

  //Update BIO only for profile
  const changeBio = () => {
    Keyboard.dismiss();
    if (!isProfileLoading && profile) {
      const {
        username,
        profilePic,
        notificationsEnabled,
        followers,
        following,
        id,
        numSales,
      } = profile;
      updateBio({
        bio,
        username,
        profilePic,
        notificationsEnabled,
        followers,
        following,
        numSales,
        id,
      });
    }
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
          Bio
        </Text>
        <Ionicons color={"transparent"} name="chevron-back-outline" size={24} />
      </View>
      <View className="h-full w-full items-center px-4 py-8">
        <View className="w-full pb-10">
          <Text className="font-general-sans-medium text-secondary-500 mb-4 w-3/4 text-sm ">
            {`Add a bio to your account page to personalize your profile and tell shoppers what you're all about!`}
          </Text>
        </View>
        <TextInput
          className=" font-general-sans-medium mb-4 h-48 w-full flex-wrap rounded-xl bg-white px-4 py-2 shadow-sm shadow-neutral-300"
          placeholder={
            isProfileLoading
              ? "Loading..."
              : profile?.bio || "Enter a bio for your account here!"
          }
          keyboardType="default"
          numberOfLines={5}
          blurOnSubmit={true}
          multiline={true}
          onChangeText={(text) => setBio(text)}
        />
        <View className="my-12 w-full">
          <Pressable
            onPress={() => {
              console.log("pressed");
              changeBio();
            }}
            disabled={isUpdatingBio || isProfileLoading || !profile}
            className={`z-50 items-center justify-center rounded-xl ${
              isProfileLoading || isUpdatingBio
                ? "bg-primary-300"
                : "bg-primary-500"
            } p-4`}
          >
            <Text className="font-general-sans-medium text-white">
              {isProfileLoading || isUpdatingBio ? "Updating..." : "Update Bio"}
            </Text>
          </Pressable>
          <Text className=" font-general-sans-medium pl-2 pt-4 text-green-600">
            {updateMessage}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default BioScreen;
