import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";

import { type ListingType } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";

interface ListingSquareProps {
  listing: ListingType;
  accessedFrom: string;
  listingSquareKey: string;
}
const ListingSquare: React.FC<ListingSquareProps> = ({
  listing,
  accessedFrom,
  listingSquareKey: key,
}) => {
  console.log(listing);
  // const initialImage = listing.imagePaths[0]!;
  // const [currentImage] = useState(initialImage);
  // const [ratio, setRatio] = useState(1);
  const router = useRouter();

  // useEffect(() => {
  //   if (currentImage !== undefined) {
  //     Image.getSize(currentImage, (width, height) => setRatio(width / height));
  //   }
  // }, [currentImage]);

  return (
    <View key={key} className="h-52 w-1/2 p-2 ">
      <Pressable
        className="h-full w-full rounded-xl bg-white shadow-md shadow-neutral-400"
        onPress={() => {
          router.push({
            pathname: "/listing-details",
            params: {
              id: listing.id,
              accessedFrom: accessedFrom,
            },
          });
        }}
      >
        <Image
          source={{ uri: listing.imagePaths[0] }}
          alt="test"
          className="h-full w-full rounded-xl "
        />
        <View className="absolute bottom-1 w-full rounded-full p-1">
          {accessedFrom === "personalAccount" ? (
            <View className="w-full flex-row justify-evenly space-x-1">
              <View className=" flex-row items-center justify-evenly space-x-1 rounded-full bg-[#ff8181]/80 px-2 py-1">
                <Feather
                  name="thumbs-down"
                  size={13}
                  color={COLORS.neutral[200]}
                />
                <Text className="font-general-sans-medium text-center text-neutral-200">
                  {listing.dislikes}
                </Text>
              </View>
              <View className="bg-primary-500/80 flex-row items-center space-x-1 rounded-full px-2 py-1">
                <Feather
                  name="shopping-cart"
                  size={13}
                  color={COLORS.neutral[200]}
                  className="top-1"
                />
                <Text className="font-general-sans-medium items-center pl-1 text-neutral-200">
                  {listing.carts}
                </Text>
              </View>
              <View className="flex-row items-center justify-center space-x-1 rounded-full bg-[#81c097]/80 px-2 py-1">
                <Feather
                  name="thumbs-up"
                  size={13}
                  color={COLORS.neutral[200]}
                />
                <Text className="font-general-sans-medium text-center text-neutral-200">
                  {listing.likes}
                </Text>
              </View>
            </View>
          ) : (
            <View className="w-full flex-row space-x-1">
              <View className="bg-primary-500/80 flex-row items-center justify-evenly rounded-full p-1">
                <Entypo name="ruler" color={"ivory"} size={13} />
                <Text className="font-general-sans-medium text-center text-white">
                  {" "}{listing.size}
                </Text>
              </View>
              <View className="bg-primary-800/80 flex-row items-center justify-center rounded-full px-2 py-1">
                <FontAwesome name="dollar" color={"ivory"} size={13} />
                <Text className="font-general-sans-medium text-center text-white">
                  {listing.price}
                </Text>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default ListingSquare;
