import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

import ExploreListingSquare from "~/components/account/ExploreListingSquare";
import ListingSkeleton from "~/components/account/ListingsSkeleton";
import useAPI from "~/hooks/useAPI";

const Following: React.FC = () => {
  const { getFollowingListings } = useAPI();
  const { userId } = useAuth();

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    refetch: refetchRecommendations,
  } = useQuery({
    queryKey: ["followingListings"],
    queryFn: () => getFollowingListings(userId as string, null),
  });
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchRecommendations();
    setRefreshing(false);
  };
  if (isRecommendationsLoading)
    return (
      <View className="mt-72 h-full w-full px-4">
        <ListingSkeleton />
      </View>
    );
  else
    return (
      <ScrollView
        className="mt-36 h-full w-full px-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void onRefresh()}
          />
        }
      >
        <View className="h-full w-full flex-row flex-wrap">
          {recommendations?.listings.map((listing, index) => {
            return (
              <ExploreListingSquare
                key={index}
                listingKey={index.toString()}
                listing={listing}
              />
            );
          })}
        </View>

        <View className="h-64 w-full" />
      </ScrollView>
    );
};

export default Following;
