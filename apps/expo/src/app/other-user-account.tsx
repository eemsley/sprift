import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";

import { type ListingType } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import AccountHeaderSkeleton from "~/components/account/AccountHeaderSkeleton";
import ExploreListingSquare from "~/components/account/ExploreListingSquare";
import ListingSkeleton from "~/components/account/ListingsSkeleton";
import useAPI from "~/hooks/useAPI";

const AccountScreen = () => {
  const { getUserListings, getProfileById, updateFollow } = useAPI();
  const { userId } = useAuth();
  const { id, email } = useLocalSearchParams();
  const router = useRouter();
  const {
    data: listings,
    refetch: refetchListings,
    isLoading: isListingsLoading,
  } = useQuery({
    queryKey: ["account listings"],
    queryFn: () => getUserListings(id as string),
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["/api/profile/[id]"],
    queryFn: () => getProfileById(id as string),
  });

  const { mutate: followUser, isLoading: isFollowingUser } = useMutation({
    mutationKey: ["/api/profile/update-follow"],
    mutationFn: (targetUserId: string) =>
      updateFollow(userId as string, targetUserId),
    onSuccess: (res) => {
      console.log(res);
      void refetchProfile();
    },
    onError: (err) => {
      console.log(err);
      void refetchProfile();
    },
  });
  const isFollowing = profile?.followers.find(
    (user) => user.externalId === userId,
  );

  const updateUserFollow = () => {
    followUser(id as string);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchListings();
    await refetchProfile();
    setRefreshing(false);
  };

  const Header = () => {
    return (
      <>
        <View className="p-6" />
        <View className="w-full space-y-3 rounded-b-3xl bg-neutral-50 shadow-md shadow-neutral-300">
          <View className="flex-row items-center justify-evenly pt-7">
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/follow-list",
                  params: {
                    followersOrFollowing: "Following",
                    id: id,
                  },
                })
              }
              className="w-20"
            >
              <Text className="font-general-sans-medium text-center text-base">
                {profile?.following.length}
              </Text>
              <Text className="text-md font-general-sans-medium text-center text-neutral-500">
                Following
              </Text>
            </Pressable>
            {isProfileLoading ? (
              <View className="h-20 w-20 items-center justify-center">
                <ActivityIndicator />
              </View>
            ) : (
              <Image
                alt="profile"
                source={{
                  uri: profile?.profilePic || "https://picsum.photos/200",
                }}
                className="h-20 w-20 rounded-full"
              />
            )}
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/follow-list",
                  params: { followersOrFollowing: "Followers", id: id },
                })
              }
              className="w-20 items-center justify-center"
            >
              {isFollowingUser || isProfileLoading ? (
                <ActivityIndicator className="h-6 w-6 pb-2" />
              ) : (
                <Text className="font-general-sans-medium text-center text-base">
                  {profile?.followers.length}
                </Text>
              )}
              <Text className="text-md font-general-sans-medium text-center text-neutral-500">
                Followers
              </Text>
            </Pressable>
          </View>
          <View className="items-center justify-center">
            <Text className="font-general-sans-medium text-base">
              {profile?.username || email?.slice(0, email.indexOf("@"))}
            </Text>
            <Text className="font-general-sans-medium text-neutral-500">
              {profile?.numSales || 0} sales
            </Text>
          </View>
          <View className="w-full items-center">
            <Text className="font-general-sans-medium w-[80%] text-center text-sm text-neutral-500">
              {profile?.bio || ""}
            </Text>
          </View>
          <View className="flex-row items-center justify-evenly p-3 pb-5 pt-1">
            <TouchableHighlight
              onPress={() => {
                updateUserFollow();
              }}
              disabled={isFollowingUser || isProfileLoading}
              className="bg-primary-500 h-[45px] w-[42%] justify-center rounded-2xl"
              underlayColor={COLORS.primary[600]}
            >
              {!isFollowingUser ? (
                <Text className="text-center font-semibold text-neutral-50">
                  {isFollowing ? "Unfollow" : "Follow"}
                </Text>
              ) : (
                <ActivityIndicator color={"white"} />
              )}
            </TouchableHighlight>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "chat",
                  params: {
                    sellerName:
                      profile?.username || email?.slice(0, email.indexOf("@")),
                    recipientId: id as string,
                  },
                })
              }
              className="border-primary-500 h-[45px] w-[40%] justify-center rounded-2xl border-[1.5px]"
            >
              <Text className="text-center font-semibold text-gray-600">
                Message
              </Text>
            </Pressable>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView className="h-full w-full">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <View className="bg-primary-500 absolute z-20 h-28 w-full flex-row items-end justify-between rounded-b-3xl px-7 pb-4 shadow-md shadow-neutral-400">
        <Ionicons
          name="chevron-back"
          color="white"
          size={23}
          onPress={() => router.back()}
        />
        <Text className="text-xl font-semibold text-white">
          {profile?.username || email?.slice(0, email.indexOf("@"))}
        </Text>
        <Ionicons name="settings-sharp" color={"transparent"} size={23} />
      </View>

      {/* user's account header */}
      {isProfileLoading || isListingsLoading ? (
        <>
          <View className="p-6" />
          <AccountHeaderSkeleton />
        </>
      ) : (
        <Header />
      )}
      {/* user's posts here */}
      {/* user's account header end */}
      {/* user's posts here */}

      {isProfileLoading || isListingsLoading ? (
        <View className="pt-4">
          <ListingSkeleton />
        </View>
      ) : (
        <ScrollView
          className="pt-4"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void onRefresh()}
            />
          }
        >
          <View className="flex-row px-4">
            {listings?.length === 0 && (
              <Text className="font-general-sans-medium w-full text-center">
                No Listings Yet...
              </Text>
            )}
            <View className="w-full flex-row flex-wrap">
              {listings?.map((listing: ListingType, index) => (
                <ExploreListingSquare
                  key={index}
                  listingKey={index.toString()}
                  listing={listing}
                />
              ))}
            </View>
          </View>
          <View className="p-9" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export type Href = string | HrefObject;

export interface HrefObject {
  pathname?: string;
  params?: Record<string, unknown>;
}

export default AccountScreen;
