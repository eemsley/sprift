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

const UsernameScreen = () => {
  const router = useRouter();
  const { getProfileById, updateUserProfile } = useAPI();
  const { userId } = useAuth();

  const [newUsername, setNewUsername] = useState("");
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

  const { mutate: updateUsername, isLoading: isUpdatingUsername } = useMutation(
    {
      mutationKey: ["/api/profile/update/bio"],
      mutationFn: ({
        bio,
        username,
        profilePic,
        notificationsEnabled,
        followers,
        following,
        id,
        numSales,
      }: {
        bio: string;
        username: string;
        profilePic: string;
        notificationsEnabled: boolean;
        followers: User[];
        following: User[];
        id: string;
        numSales: number;
      }) =>
        updateUserProfile(userId as string, {
          bio,
          username,
          profilePic,
          notificationsEnabled,
          followers,
          following,
          id,
          numSales,
        }),
      onSuccess: (res) => {
        console.log(res);
        setUpdateMessage("Username updated!");
        setError(false);
        void refetchProfile();
      },
      onError: () => {
        setUpdateMessage("Username Taken!");
        setError(true);
      },
    },
  );

  //Update BIO only for profile
  const changeUsername = () => {
    Keyboard.dismiss();
    if (!isProfileLoading && profile) {
      const {
        bio,
        profilePic,
        notificationsEnabled,
        followers,
        following,
        id,
        numSales,
      } = profile;
      updateUsername({
        bio,
        username: newUsername,
        profilePic,
        notificationsEnabled,
        followers,
        following,
        id,
        numSales,
      });
    }
  };
  const [error, setError] = useState(false);

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
          Username
        </Text>
        <Ionicons color={"transparent"} name="chevron-back-outline" size={24} />
      </View>
      <View className="h-full w-full items-center px-4 py-24">
        <TextInput
          className="my-2 h-10 w-full rounded-xl bg-white px-4 shadow-sm shadow-neutral-300"
          placeholder={
            isProfileLoading
              ? "Loading..."
              : profile?.username || "Enter a username"
          }
          keyboardType="default"
          onChangeText={(text) => setNewUsername(text)}
        />

        <View className="my-12 h-12 w-1/2">
          <Pressable
            onPress={changeUsername}
            disabled={
              isProfileLoading || newUsername === "" || isUpdatingUsername
            }
            className={`z-50 items-center justify-center rounded-2xl ${
              isProfileLoading || isUpdatingUsername
                ? "bg-primary-300"
                : "bg-primary-500"
            } p-4`}
          >
            <Text className="font-general-sans-medium text-white">
              {isUpdatingUsername ? "Updating..." : "Change Username"}
            </Text>
          </Pressable>
          <Text className=" font-general-sans-medium pl-5 pt-4 text-green-600">
            {!error && updateMessage}
          </Text>
          <Text className=" font-general-sans-medium pl-8 pt-4 text-red-600">
            {error && updateMessage}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default UsernameScreen;
