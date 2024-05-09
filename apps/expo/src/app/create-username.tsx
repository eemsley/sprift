import { useState } from "react";
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "@tanstack/react-query";

import OnboardingNav from "~/components/onboarding/OnboardingNav";
import useAPI from "~/hooks/useAPI";
import { type User } from ".prisma/client";

const CreateUsername = () => {
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
        setError(false);
        void refetchProfile();
        alert("Username created!");
        router.replace("style-quiz");
      },
      onError: () => {
        setUpdateMessage("Username Taken!");
        setError(true);
      },
    },
  );

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
    <SafeAreaView className="flex-1 bg-neutral-50">
      <View className="h-12 w-full items-center justify-center">
        <OnboardingNav
          backHidden
          progress={1 / 4}
          onBack={() => {
            return;
          }}
        />
        <Text className="font-satoshi-bold text-primary-500 text-2xl">
          Create a Username!
        </Text>
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
              {isUpdatingUsername ? "Loading..." : "Create Username"}
            </Text>
          </Pressable>

          <Text className=" font-general-sans-medium pl-8 pt-4 text-red-600">
            {error && updateMessage}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateUsername;
