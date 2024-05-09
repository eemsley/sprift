import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";

import { type ListingType } from "~/utils/mockData";

interface ListingSquareProps {
  listing: ListingType;
  listingKey: string;
}
const ExploreListingSquare: React.FC<ListingSquareProps> = ({
  listing,
  listingKey,
}) => {
  console.log(listing);
  const router = useRouter();

  return (
    <View key={listingKey} className="h-52 w-1/2 p-2 ">
      <Pressable
        className="h-full w-full rounded-xl bg-white shadow-md shadow-neutral-300"
        onPress={() =>
          router.push({
            pathname: "/listing-details",
            params: {
              id: listing.id,
            },
          })
        }
      >
        <Image
          source={{ uri: listing.imagePaths[0] }}
          alt="test"
          className="h-full w-full rounded-xl "
        />
        <View className="absolute bottom-1 w-full flex-row flex-wrap justify-start space-x-1 rounded-full p-1">
          <View className="bg-primary-500/80 flex-row items-center justify-center rounded-full px-2 py-1">
            <FontAwesome name="dollar" color={"ivory"} size={13} />
            <Text className="font-general-sans-medium text-center text-white">
              {listing.price}
            </Text>
          </View>
          <View className="bg-primary-800/80 flex-row items-center justify-evenly space-x-1 rounded-full p-1 px-2">
            <Entypo name="ruler" color={"ivory"} size={13} />
            <Text className="font-general-sans-medium text-center text-white">
              {listing.size}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ExploreListingSquare;
