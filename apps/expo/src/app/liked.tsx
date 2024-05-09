import React, { useState } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import ExploreListingSquare from "~/components/account/ExploreListingSquare";
import ListingSkeleton from "~/components/account/ListingsSkeleton";
import useAPI from "~/hooks/useAPI";

const LikedScreen = () => {
  const { getLikedListings, getSavedForLater } = useAPI();
  const { userId } = useAuth();
  const {
    data: listings,
    isLoading: isListingsLoading,
    refetch: refetchLikedListings,
  } = useQuery({
    queryKey: ["liked listings"],
    queryFn: () => getLikedListings(userId as string),
  });

  const {
    data: savedListings,
    isLoading: isSavedLoading,
    refetch: refetchSavedListings,
  } = useQuery({
    queryKey: ["saved listings"],
    queryFn: () => getSavedForLater(userId as string),
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchLikedListings();
    await refetchSavedListings();
    setRefreshing(false);
  };

  const [liked, setLiked] = React.useState(true);

  const Body = () => {
    if (isSavedLoading || isListingsLoading) {
      return (
        <View className="h-full w-full items-center justify-center px-4 pt-20">
          <ListingSkeleton />
        </View>
      );
    }
    if (!liked && savedListings?.length === 0) {
      return (
        <View className="h-full w-full items-center justify-center">
          <Text className="font-general-sans-medium text-secondary-500">
            Swipe up or click the ribbon to save a listing!
          </Text>
        </View>
      );
    }
    if (liked && listings?.length === 0) {
      return (
        <View className="h-full w-full items-center justify-center">
          <Text className="font-general-sans-medium text-secondary-500">
            Swipe right or click the thumbs up to like a listing!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        className="mt-20 h-full px-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
          />
        }
      >
        <View className="h-full w-full flex-row flex-wrap">
          {liked
            ? listings?.map((listing, index) => {
                return (
                  <ExploreListingSquare
                    key={index}
                    listingKey={index.toString()}
                    listing={listing}
                  />
                );
              })
            : savedListings?.map((listing, index) => {
                return (
                  <ExploreListingSquare
                    key={index}
                    listingKey={index.toString()}
                    listing={listing}
                  />
                );
              })}
          <View className={"h-24 w-full"} />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="h-full w-full items-center bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "none",
          headerBackVisible: false,
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View className="shadow-primary-600/20 absolute top-0 z-50 w-full items-center rounded-b-3xl bg-white pb-2 pt-14 shadow-xl">
        <View className="w-full flex-row items-center justify-evenly">
          <Pressable
            onPress={() => {
              setLiked(true);
            }}
            className="justify-top items-center p-2"
          >
            <View className="w-full flex-row items-center">
              <Text className="font-general-sans-medium  pr-1 text-center text-2xl font-bold text-neutral-700">
                Liked
              </Text>
              <Feather name="thumbs-up" color={COLORS.neutral[700]} size={20} />
            </View>
            <View
              className={`top-1 h-2 w-full rounded-full ${
                liked ? "bg-primary-200" : ""
              }`}
            />
          </Pressable>
          <Pressable
            onPress={() => setLiked(false)}
            className="items-center justify-center p-2"
          >
            <View className="w-full flex-row items-center">
              <Text className="font-general-sans-medium  pr-1 text-center text-2xl font-bold text-neutral-700">
                Saved
              </Text>
              <View className="pt-[3%]">
                <Feather
                  name="bookmark"
                  color={COLORS.neutral[700]}
                  size={20}
                />
              </View>
            </View>
            <View
              className={`top-1 h-2 w-full rounded-full ${
                liked ? "" : "bg-primary-200"
              }`}
            />
          </Pressable>
        </View>
      </View>
      <Body />
    </SafeAreaView>
  );
};

export default LikedScreen;
