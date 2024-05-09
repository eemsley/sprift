import { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

//This screen is used for both followers and following lists
//so must pass in param with "Followers" or "Following"
const FollowListScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = useAuth();
  const { getProfileById } = useAPI();
  //TODO add a username or id param to decifer who's followers/following you're viewing
  const { followersOrFollowing, id } = params;

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["/api/profile/[id]"],
    queryFn: () => getProfileById(id as string),
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchProfile();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className=" bg-neutral-50 ">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerShown: false,
          gestureEnabled: true,
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
            {followersOrFollowing}
          </Text>
          <Ionicons name="chevron-back-outline" color="transparent" size={24} />
        </View>
      </View>
      <ScrollView
        className="mt-4 h-full bg-neutral-50 pt-2"
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
          />
        }
      >
        {followersOrFollowing == "Followers"
          ? profile?.followers.map((user, index) => {
              return (
                <Pressable
                  key={index}
                  className="my-2 h-16 w-[95%] flex-row items-center rounded-full bg-white px-4 shadow-lg shadow-neutral-300"
                  onPress={() => {
                    if (user.externalId != userId) {
                      router.replace({
                        pathname: "other-user-account",
                        params: {
                          id: user.externalId,
                          email: user.email,
                        },
                      });
                    } else {
                      router.replace({
                        pathname: "account",
                      });
                    }
                  }}
                >
                  <Image
                    source={{ uri: user.profilePic }}
                    alt="prof"
                    className="mr-4 h-12 w-12 rounded-full"
                  />
                  <Text className="font-general-sans-medium text-lg">
                    {user.username || user.email}
                  </Text>
                  {user.externalId == userId && (
                    <Text className=" font-general-sans-medium text-primary-400 pl-2 text-xs ">
                      (Me)
                    </Text>
                  )}
                </Pressable>
              );
            })
          : profile?.following.map((user, index) => {
              return (
                <Pressable
                  key={index}
                  className="my-2 h-16 w-[95%] flex-row items-center rounded-full bg-white px-4 shadow-lg shadow-neutral-300"
                  onPress={() => {
                    if (user.externalId != userId) {
                      router.replace({
                        pathname: "other-user-account",
                        params: {
                          id: user.externalId,
                          email: user.email,
                        },
                      });
                    } else {
                      router.replace({
                        pathname: "account",
                      });
                    }
                  }}
                >
                  <Image
                    source={{ uri: user.profilePic }}
                    alt="prof"
                    className="mr-4 h-12 w-12 rounded-full"
                  />
                  <Text className="font-general-sans-medium text-lg">
                    {user.username || user.email}
                  </Text>
                  {user.externalId == userId && (
                    <Text className=" font-general-sans-medium text-primary-400 pl-2 text-xs ">
                      (Me)
                    </Text>
                  )}
                </Pressable>
              );
            })}
        {profile?.following.length == 0 &&
          followersOrFollowing == "Following" && (
            <View className="h-full w-full items-center justify-center ">
              <Text className="font-general-sans-medium pb-12 text-neutral-500">
                Follow sellers from the explore page!
              </Text>
            </View>
          )}
        {profile?.followers.length == 0 &&
          followersOrFollowing == "Followers" && (
            <View className="h-full w-full items-center justify-center ">
              <Text className="font-general-sans-medium pb-12 text-neutral-500">
                No followers yet!
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FollowListScreen;
