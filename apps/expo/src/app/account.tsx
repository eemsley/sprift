import { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
// import ContentLoader from "react-native-easy-content-loader";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { type ListingType } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import AccountHeaderSkeleton from "~/components/account/AccountHeaderSkeleton";
import ListingSquare from "~/components/account/ListingSquare";
import ListingSkeleton from "~/components/account/ListingsSkeleton";
import useAPI from "~/hooks/useAPI";

const AccountScreen = () => {
  const { getUserListings, getProfileById } = useAPI();
  const { userId } = useAuth();
  // const { user } = useUser();
  const router = useRouter();
  const {
    data: listings,
    isLoading: isListingsLoading,
    refetch: refetchListings,
  } = useQuery({
    queryKey: ["account listings"],
    queryFn: () => getUserListings(userId as string),
  });

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["/api/profile/[id]"],
    queryFn: () => getProfileById(userId as string),
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchListings();
    await refetchProfile();
    setRefreshing(false);
  };
  const Header = () => {
    return (
      <View className="w-full space-y-3 rounded-b-3xl bg-neutral-50 shadow-md shadow-neutral-300">
        <View className="flex-row items-center justify-evenly pt-7">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/follow-list",
                params: { followersOrFollowing: "Following", id: userId },
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

          <Pressable onPress={() => router.push("settings/photo")}>
            <Image
              alt="profile"
              source={{
                uri: `${profile?.profilePic}`,
              }}
              className="h-20 w-20 rounded-full"
            />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/follow-list",
                params: { followersOrFollowing: "Followers", id: userId },
              })
            }
            className="w-20"
          >
            <Text className="font-general-sans-medium text-center text-base">
              {profile?.followers.length}
            </Text>

            <Text className="text-md font-general-sans-medium text-center text-neutral-500">
              Followers
            </Text>
          </Pressable>
        </View>
        <View className="items-center justify-center">
          <Text className="font-general-sans-medium text-lg">
            {profile?.username}
          </Text>
          <Text className="font-general-sans-medium text-neutral-500">
            {profile?.numSales} sales
          </Text>
        </View>
        <View className="w-full items-center">
          <Text className="font-general-sans-medium w-[80%] text-center text-sm text-neutral-500">
            {profile?.bio || "Add a bio in settings!"}
          </Text>
        </View>
        <View className="flex-row items-center justify-evenly p-3 pb-5 pt-1">
          <TouchableHighlight
            onPress={() => router.push("/upload")}
            className="bg-primary-500 h-[45px] w-[42%] justify-center rounded-2xl"
            underlayColor={COLORS.primary[600]}
          >
            <Text className="text-center font-semibold text-neutral-50">
              Upload Listing
            </Text>
          </TouchableHighlight>
          <Pressable
            onPress={() => console.log("share profile")}
            className="border-primary-500 h-[45px] w-[40%] justify-center rounded-2xl border-[1.5px]"
          >
            <Text className="text-center font-semibold text-gray-600">
              Share Profile
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full w-full">
      <Stack.Screen
        options={{
          animation: "none",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      {/* user's account header */}

      <View className="bg-primary-500 absolute z-20 h-28 w-full flex-row items-end justify-between rounded-b-3xl px-7 pb-4 shadow-md shadow-neutral-400">
        <Ionicons name="settings-sharp" color="#49bab4" size={23} />
        <Text className="text-xl font-semibold text-white">My Account</Text>
        <Pressable onPress={() => router.push("/settings")}>
          <Ionicons name="settings-sharp" color={"white"} size={23} />
        </Pressable>
      </View>
      <View className="p-6" />
      {isProfileLoading || isListingsLoading ? (
        <AccountHeaderSkeleton />
      ) : (
        <Header />
      )}
      {/* user's posts here */}
      <ScrollView
        className="pt-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
          />
        }
      >
        {isListingsLoading || isProfileLoading ? (
          <ListingSkeleton />
        ) : (
          <View className="flex-row flex-wrap px-3">
            {listings?.map((listing: ListingType, index) => (
              <ListingSquare
                listing={listing}
                accessedFrom="personalAccount"
                key={index.toString()}
                listingSquareKey={index.toString()}
              />
            ))}
          </View>
        )}
        {listings?.length === 0 && (
          <View className="h-full w-full items-center justify-center">
            <Text className="text-secondary-500 font-general-sans-medium w-full text-center">
              Upload listings to view them here!
            </Text>
          </View>
        )}
        <View className="p-9" />
        <View className="h-12 w-full" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;
