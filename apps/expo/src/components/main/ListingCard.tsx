import React, { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { ImageZoom } from "@likashefqet/react-native-image-zoom";

import { type ListingType } from "~/utils/mockData";

interface ListingCardProps {
  listing: ListingType;
}

// Fills the parent view fully, pass in one listing as prop
const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  // const listing = props.listing;
  const router = useRouter();
  const [imageIndex, setImageIndex] = useState(0);
  const { userId } = useAuth();

  // TODO: Extract to helper files later
  const leftPress = () => {
    setImageIndex(imageIndex - 1);
    const tempTabs = tabs.slice(0);
    const temp2 = tempTabs.shift();
    if (temp2 == undefined) return;
    tempTabs.push(temp2);
    setTabs(tempTabs);
  };

  const rightPress = () => {
    setImageIndex(imageIndex + 1);
    const tempTabs = tabs.slice(0);
    const temp2 = tempTabs.pop();
    if (temp2 == undefined) return;
    tempTabs.unshift(temp2);
    setTabs(tempTabs);
  };

  const sellerPress = () => {
    if (listing.seller.externalId != userId) {
      router.push({
        pathname: "/other-user-account",
        params: { id: listing.seller.externalId, email: listing.seller.email },
      });
    } else {
      router.push("/account");
    }
  };

  const images = listing.imagePaths.map((path) => {
    return (
      <ImageZoom
        containerStyle={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          top: 0,
          height: "100%",
          width: "100%",
          overflow: "hidden",
          borderRadius: 24,
        }}
        style={{
          height: "100%",
          backgroundColor: "black",
          aspectRatio: 2,
        }}
        key={listing.imagePaths.indexOf(path)}
        alt={"image"}
        uri={listing.imagePaths[listing.imagePaths.indexOf(path)]}
      />
    );
  });

  const [tabs, setTabs] = useState(
    listing.imagePaths.map((path) => {
      if (listing.imagePaths.length > 1) {
        if (listing.imagePaths.indexOf(path) == 0)
          return (
            <View
              key={listing.imagePaths.indexOf(path)}
              className={`h-full bg-sky-50`}
              style={{ width: `${100 / listing.imagePaths.length}%` }}
            />
          );
        else {
          return (
            <View
              key={listing.imagePaths.indexOf(path)}
              className={`h-full bg-neutral-600`}
              style={{ width: `${100 / listing.imagePaths.length}%` }}
            />
          );
        }
      }
    }),
  );

  if (listing && listing.seller)
    return (
      <View className="h-[65%] w-[93%] items-center justify-center rounded-3xl bg-white">
        {images[imageIndex % listing.imagePaths.length]}
        {/*container*/}
        <View className="h-full w-full flex-row items-center justify-center">
          <View className="absolute top-0 h-[.5%] w-[88%] flex-row items-center justify-center overflow-hidden rounded-full ">
            {tabs}
          </View>
          <View className="justify-top absolute top-5 z-50 w-full flex-row items-center justify-between space-x-3 px-5">
            <View className="flex-row space-x-3">
              <Pressable
                onPress={sellerPress}
                className="border-1 flex-row items-center justify-center rounded-xl border-white bg-neutral-100/80 px-3 py-2"
              >
                <Image
                  alt="Seller Profile Pic"
                  source={{ uri: listing.sellerProfilePicUrl }}
                  className="mr-2 h-4 w-4 rounded-full"
                />
                <Text className="font-general-sans-medium pr-1 text-center text-black">
                  {listing.sellerName ||
                    listing.seller.email.slice(
                      0,
                      listing.seller.email.indexOf("@"),
                    )}
                </Text>
              </Pressable>
              <View className="border-1 flex-row items-center justify-evenly rounded-xl border-white bg-neutral-100/80 px-3 py-2">
                <Entypo name="ruler" color="black" size={12} />
                <Text className="font-general-sans-medium pl-1 text-center text-black">
                  {listing.size}
                </Text>
              </View>
            </View>
            <View className="border-1 flex-row items-center justify-center space-x-1 rounded-xl border-white bg-neutral-100/80 px-3 py-2">
              <FontAwesome name="dollar" color="black" size={13} />
              <Text className="font-general-sans-semibold text-center text-black">
                {listing.price}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/listing-details",
                params: {
                  id: listing.id,
                },
              })
            }
            className="border-1 absolute bottom-5 right-5 z-50 h-8 w-8 items-center justify-center rounded-full border-white bg-neutral-100/80"
          >
            {/* <Text className="text-white text-lg font-satoshi-regular pb-1">i</Text> */}
            <Feather name="maximize-2" size={16} />
          </Pressable>
          <View className="h-full w-1/2">
            {/*clickable (for changing images)*/}
            <Pressable
              onPress={leftPress}
              className="active: h-full w-full rounded-3xl active:bg-neutral-600/10"
            ></Pressable>
          </View>
          <View className="h-full w-1/2">
            <Pressable
              onPress={rightPress}
              className="active: h-full w-full rounded-3xl active:bg-neutral-600/10"
            ></Pressable>
          </View>
        </View>
      </View>
    );
  else
    return (
      <View className="h-[65%] w-[93%] items-center justify-center rounded-3xl bg-white">
        <Text>Error:{JSON.stringify(listing)}</Text>
      </View>
    );
};

export default ListingCard;
