import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";

import { type ListingType } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import AppButton from "~/components/shared/AppButton";
import useAPI from "~/hooks/useAPI";

const ListingDetailsScreen = () => {
  const router = useRouter();
  const {
    getListingById,
    deleteListingById,
    likeListing,
    removeLike,
    isListingLiked,
    dislikeListing,
    removeDislike,
    isListingDisliked,
    addListingToCart,
    removeListingFromCart,
    isListingInCart,
    addToSavedForLater,
    isListingSavedForLater,
    removeFromSavedForLater,
  } = useAPI();
  const { userId } = useAuth();

  const { data: isLiked, refetch: refetchIsLiked } = useQuery({
    queryKey: ["is listing liked"],
    queryFn: () => isListingLiked(userId as string, id as string),
  });
  const { data: isDisliked, refetch: refetchIsDisliked } = useQuery({
    queryKey: ["is listing disliked"],
    queryFn: () => isListingDisliked(userId as string, id as string),
  });
  const { data: isInCart, refetch: refetchIsInCart } = useQuery({
    queryKey: ["is listing in cart"],
    queryFn: () => isListingInCart(userId as string, id as string),
  });
  const { data: isSaved, refetch: refetchIsSaved } = useQuery({
    queryKey: ["is listing saved"],
    queryFn: () => isListingSavedForLater(userId as string, id as string),
  });
  const { mutate: deleteListing } = useMutation({
    mutationFn: () => deleteListingById(id as string),
    onSuccess: () => {
      router.replace("account");
    },
  });

  const onLikeListing = (listing: ListingType) => {
    likeListing(userId as string, listing.id)
      .then((_) => {
        void refetchListing();
        void refetchIsLiked();
      })
      .catch((err) => console.log(err));
  };

  const onDislikeListing = (listing: ListingType) => {
    dislikeListing(userId as string, listing.id)
      .then((_) => {
        void refetchListing();
        void refetchIsDisliked();
      })
      .catch((err) => console.log(err));
  };

  const onAddToCart = (listing: ListingType) => {
    addListingToCart(userId as string, listing.id)
      .then((_) => {
        void refetchListing();
        void refetchIsInCart();
      })
      .catch((err) => console.log(err));
  };

  const onAddToSaved = (listing: ListingType) => {
    addToSavedForLater(userId as string, listing.id)
      .then((_) => {
        void refetchIsSaved();
      })
      .catch((err) => console.log(err));
  };

  const onRemoveFromSaved = (listing: ListingType) => {
    removeFromSavedForLater(userId as string, listing.id)
      .then((_) => {
        void refetchIsSaved();
      })
      .catch((err) => console.log(err));
  };

  const onRemoveDislike = (listing: ListingType) => {
    removeDislike(userId as string, listing.id)
      .then((_) => {
        void refetchIsDisliked();
        void refetchListing();
      })
      .catch((err) => console.log(err));
  };

  const onRemoveLike = (listing: ListingType) => {
    removeLike(userId as string, listing.id)
      .then((_) => {
        void refetchIsLiked();
        void refetchListing();
      })
      .catch((err) => console.log(err));
  };

  const onRemoveFromCart = (listing: ListingType) => {
    removeListingFromCart(userId as string, listing.id)
      .then((_) => {
        void refetchIsInCart();
        void refetchListing();
      })
      .catch((err) => console.log(err));
  };
  const onDeleteListing = () => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
        },
        {
          text: "Delete",
          onPress: () => {
            deleteListing();
          },
        },
      ],
    );
  };

  const params = useLocalSearchParams();
  //id is the listing id to get from api
  const { id, accessedFrom } = params;
  const {
    data: listing,
    isLoading: isListingLoading,
    refetch: refetchListing,
    remove,
  } = useQuery({
    queryKey: ["listing by id"],
    queryFn: () => getListingById(id as string),
  });
  const [imageIndex, setImageIndex] = useState(0);
  // const [currentImage, setCurrentImage] = useState(listing?.imagePaths[0]);
  // const [ratio, setRatio] = useState(9 / 16);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportReason, setReportReason] = useState("");

  //for edit/archive/delete listing modal
  const [showOptions, setShowOptions] = useState(false);

  //these are so the delay of the api calls isn't as noticable by the user
  const [cart, setCart] = useState(isInCart);
  const [like, setLike] = useState(isLiked);
  const [dislike, setDislike] = useState(isDisliked);

  useEffect(() => {
    setCart(isInCart);
  }, [isInCart]);

  useEffect(() => {
    setLike(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setDislike(isDisliked);
  }, [isDisliked]);

  // useEffect(() => {
  //   if (currentImage !== undefined) {
  //     //sets aspect ratio to the original image's ratio
  //     if (!isListingLoading)
  //       ReactImage.getSize(currentImage, (width, height) =>
  //         setRatio(width / height),
  //       );
  //   }
  // }, [currentImage, ratio, isListingLoading]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        remove();
      };
    }, [remove]),
  );

  // const [images, setImages] = useState(
  //   listing?.imagePaths.map((path) => {
  //     return (
  //       <ImageZoom
  //         containerStyle={{
  //           position: "absolute",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           top: 0,
  //           height: "100%",
  //           width: "100%",
  //           overflow: "hidden",
  //           borderRadius: 24,
  //         }}
  //         style={{
  //           height: "100%",
  //           backgroundColor: "black",
  //           aspectRatio: 2,
  //         }}
  //         key={listing.imagePaths.indexOf(path)}
  //         alt={"image"}
  //         uri={listing.imagePaths[listing.imagePaths.indexOf(path)]}
  //       />
  //     );
  //   }),
  // );

  // const [tabs, setTabs] = useState(
  //   listing?.imagePaths.map((path) => {
  //     if (listing.imagePaths.length > 1) {
  //       if (listing.imagePaths.indexOf(path) == 0)
  //         return (
  //           <View
  //             key={listing.imagePaths.indexOf(path)}
  //             className={`h-full w-1/6 rounded-sm bg-sky-50`}
  //           />
  //         );
  //       else {
  //         return (
  //           <View
  //             key={listing.imagePaths.indexOf(path)}
  //             className={`h-full w-1/6 rounded-sm bg-neutral-500`}
  //           />
  //         );
  //       }
  //     }
  //   }),
  // );

  const reportPost = () => {
    setShowOptions(false);
    Alert.prompt(
      "Report Post",
      "Explain your reason for reporting.\n We will review the report and notify you of any action taken.",
      [
        {
          text: "Cancel",
        },
        {
          text: "Enter",
          onPress: (reason) => {
            if (reason != "" && reason != undefined) {
              Alert.alert("Successfully Reported!");
              setReportReason(reason);
            } else {
              Alert.alert("Please enter a reason. \nReport was not sent.");
            }
          },
        },
      ],
      "plain-text",
    );
  };

  const PostData = () => {
    return (
      <View className="bottom-0 w-full flex-row items-center justify-evenly py-7">
        <View className="flex-row items-center justify-center rounded-2xl bg-[#ff8181]/20 px-3 py-1 ">
          <View className="p-1" />
          <Feather name="thumbs-down" size={15} color={"#FF8181"} />
          <Text
            className="font-general-sans-bold p-2"
            style={{ color: "#FF8181" }}
          >
            {listing?.dislikes}
          </Text>
        </View>
        <View className="bg-primary-50/30  flex-row items-center rounded-2xl px-3 py-1 ">
          <View className="p-1" />
          <Feather name="shopping-cart" size={16} color={COLORS.primary[500]} />
          <Text className="font-general-sans-bold text-primary-500 items-center p-2">
            {listing?.carts}
          </Text>
        </View>
        <View className="flex-row items-center rounded-2xl bg-[#81c097]/30 px-3 py-1 ">
          <View className="p-1" />
          <Feather name="thumbs-up" size={15} color={"#81c097"} />
          <Text className="font-general-sans-bold p-2 text-[#81c097]">
            {listing?.likes}
          </Text>
        </View>
      </View>
    );
  };

  const BottomButtons = () => {
    return (
      <View className="w-full items-center justify-center py-4 pt-8">
        <View className="w-full flex-row justify-between px-5 pb-2">
          <Pressable
            onPress={() => {
              if (listing && !isDisliked) {
                if (like) {
                  onRemoveLike(listing);
                  setLike(false);
                }
                if (cart) {
                  onRemoveFromCart(listing);
                  setCart(false);
                }
                onDislikeListing(listing);
                setDislike(true);
              } else if (listing && isDisliked) {
                onRemoveDislike(listing);
                setDislike(false);
              }
            }}
            className={
              dislike
                ? "h-12 w-12 items-center justify-center rounded-full bg-[#ff8181]/80"
                : "h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg shadow-gray-600/20"
            }
          >
            <Feather
              name="thumbs-down"
              color={dislike ? COLORS.neutral[50] : COLORS.neutral[800]}
              size={18}
            />
          </Pressable>
          <View className="w-60 rounded-2xl bg-neutral-50 shadow-lg shadow-neutral-300">
            <AppButton
              backgroundColor={cart ? COLORS.primary[500] : "white"}
              title={cart ? "Remove from cart" : "Add to cart"}
              textColor={cart ? COLORS.neutral[50] : COLORS.neutral[600]}
              highlightedColor={cart ? COLORS.primary[400] : COLORS.primary[50]}
              onPress={() => {
                if (listing && isInCart) {
                  onRemoveFromCart(listing);
                  setCart(false);
                } else if (listing && !isInCart) {
                  if (isSaved) {
                    onRemoveFromSaved(listing);
                  }
                  if (dislike) {
                    onRemoveDislike(listing);
                    setDislike(false);
                  }
                  if (like) {
                    onRemoveLike(listing);
                    setLike(false);
                  }
                  onAddToCart(listing);
                  setCart(true);
                }
              }}
            />
          </View>
          <Pressable
            onPress={() => {
              if (isLiked && listing) {
                onRemoveLike(listing);
                setLike(false);
              } else if (listing && !isLiked) {
                if (dislike) {
                  onRemoveDislike(listing);
                  setDislike(false);
                }
                if (cart) {
                  onRemoveFromCart(listing);
                  setCart(false);
                }
                onLikeListing(listing);
                setLike(true);
              }
            }}
            className={
              like
                ? "h-12 w-12 items-center rounded-full bg-[#81c097]/80 pt-3 shadow-lg shadow-[#81c097]/50"
                : "h-12 w-12 items-center rounded-full bg-white pt-3 shadow-lg shadow-gray-600/20"
            }
          >
            <Feather
              name="thumbs-up"
              color={like ? COLORS.neutral[50] : COLORS.neutral[800]}
              size={18}
            />
            <Text
              className={
                like
                  ? "font-general-sans-medium text-xs text-neutral-50"
                  : "font-general-sans-medium text-xs text-neutral-800"
              }
            >
              {listing?.likes}
            </Text>
          </Pressable>
        </View>
        <Text className="font-general-sans-regular text-center text-sm">
          Buy it now! {listing?.carts}{" "}
          {listing?.carts === 1 ? "person has" : "people have"} this in their
          cart
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "slide_from_bottom",
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <View className="mt-2 w-full flex-row items-center justify-between bg-transparent px-6">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" color={"black"} size={24} />
        </Pressable>
        <Pressable onPress={() => setShowOptions(true)}>
          <Entypo name="dots-three-horizontal" color={"black"} size={20} />
        </Pressable>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(!showOptions);
        }}
      >
        <Pressable
          className="h-full w-full"
          onPress={() => setShowOptions(false)}
        >
          <View className="absolute top-[80%] h-full w-full space-y-3 rounded-t-3xl bg-neutral-50 p-5 shadow-lg shadow-neutral-400">
            {accessedFrom === "personalAccount" ||
            accessedFrom === "archive" ? (
              <View>
                <Pressable onPress={() => console.log("edit")}>
                  <Text className="font-general-sans-medium pb-2 text-base">
                    Edit Listing
                  </Text>
                </Pressable>
                {/* below is for the archive if we add that */}
                {/* {accessedFrom === "personalAccount" ? (
                  <Pressable onPress={() => console.log("archive")}>
                    <Text className="font-general-sans-medium text-base">
                      Archive Listing
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => console.log("repost")}>
                    <Text className="font-general-sans-medium text-base">
                      Repost Listing
                    </Text>
                  </Pressable>
                )} */}
                <Pressable onPress={() => onDeleteListing()}>
                  <Text className="font-general-sans-medium text-base">
                    Delete Listing
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Pressable onPress={() => reportPost()}>
                  <Text className="font-general-sans-medium pb-2 text-base">
                    Report Listing
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (listing && !isSaved) {
                      if (isInCart) {
                        onRemoveFromCart(listing);
                        setCart(false);
                      }
                      onAddToSaved(listing);
                      setShowOptions(false);
                    } else if (listing && isSaved) {
                      onRemoveFromSaved(listing);
                      setShowOptions(false);
                    }
                  }}
                >
                  <Text className="font-general-sans-medium text-base">
                    {isSaved ? "Remove from saved for later" : "Save For Later"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
      <ScrollView showsVerticalScrollIndicator className="z-10">
        <View className="w-full items-center pt-5">
          <View className="w-[92%] items-center rounded-[30px] bg-neutral-50 shadow-lg shadow-neutral-300">
            <Pressable
              onPress={() => {
                if (listing?.imagePaths[imageIndex + 1] !== undefined) {
                  setImageIndex(imageIndex + 1);
                } else {
                  setImageIndex(0);
                }
                // setCurrentImage(listing?.imagePaths[imageIndex]);
              }}
            >
              {isListingLoading ? (
                <View
                  style={{ aspectRatio: 0.75 }}
                  className="w-[95%] items-center justify-center"
                >
                  <ActivityIndicator />
                </View>
              ) : (
                <View className="h-auto w-[95%] rounded-2xl">
                  <Image
                    style={{
                      borderRadius: 30,
                      top: -20,
                      aspectRatio: 0.8,
                      width: "100%",
                    }}
                    alt=""
                    source={{ uri: listing?.imagePaths[imageIndex] }}
                  />
                </View>
              )}
              <View className="flex-row items-center justify-between px-5 pb-4">
                <View className="flex-row items-center">
                  <Entypo name="ruler" size={15} color={COLORS.neutral[800]} />
                  <Text className="font-general-sans-semibold pl-1 text-lg text-neutral-800">
                    {listing?.size || "   "}
                  </Text>
                </View>
                <View className="bg-primary-600 rounded-xl">
                  <Text className="font-general-sans-medium p-1 px-2 text-lg text-white">
                    $ {listing?.price || "     "}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
        <View className="flex-row flex-wrap items-center justify-center space-x-3 space-y-2 p-4 pb-2">
          {/* this is maping the borders of the bottom images */}
          {listing && listing.imagePaths.length > 1 ? (
            listing.imagePaths.map((image, index) =>
              image === listing.imagePaths[imageIndex] ? (
                <View
                  key={index}
                  className="shadow-netural-200 border-primary-50 z-10 rounded-2xl border-4 p-[2px]"
                >
                  <View className="h-10 w-10 rounded-xl" />
                </View>
              ) : (
                <Pressable
                  key={index}
                  onPress={() => {
                    setImageIndex(index);
                    // setCurrentImage(listing.imagePaths[index]);
                  }}
                  className="z-10 rounded-2xl border-4 border-neutral-200"
                >
                  <View className="h-11 w-11 rounded-xl" />
                </Pressable>
              ),
            )
          ) : (
            <></>
          )}
          {/* this is mapping the bottom images so they don't rerender with the border  */}
          <View className="absolute z-0 flex-row flex-wrap items-center justify-center space-x-3 space-y-2 p-4 pb-2">
            {listing && listing.imagePaths.length > 1 ? (
              listing.imagePaths.map((image, index) => (
                <View
                  key={index}
                  className="z-0 rounded-2xl border-4 border-transparent bg-transparent p-[2px]"
                >
                  <Image
                    key={index}
                    className=" h-10 w-10 rounded-xl"
                    alt=""
                    source={{ uri: image }}
                  />
                </View>
              ))
            ) : (
              <></>
            )}
          </View>
        </View>

        <View className="px-5">
          <View className="flex-row items-center justify-between pb-2">
            <Pressable
              className="flex-row items-center justify-start"
              onPress={() => {
                if (accessedFrom == "personalAccount") {
                  router.replace("account");
                } else {
                  router.push({
                    pathname: "/other-user-account",
                    params: { id: listing?.seller.externalId },
                  });
                }
              }}
            >
              <Image
                alt="Seller Profile Pic"
                key={1}
                source={{ uri: listing?.seller.profilePic }}
                className="mr-2 h-6 w-6 rounded-full"
              />
              <Text className="font-general-sans-medium pb-1 text-lg">
                {listing?.seller?.username ||
                  listing?.seller.email.slice(
                    0,
                    listing?.seller.email.indexOf("@"),
                  ) ||
                  ""}
              </Text>
            </Pressable>
            {accessedFrom === "personalAccount" ? (
              <></>
            ) : (
              <Pressable
                className="rounded-full border border-gray-200 bg-neutral-100 p-2"
                onPress={() =>
                  router.push({
                    pathname: "/chat",
                    params: {
                      sellerName:
                        listing?.seller.username ||
                        listing?.seller.email.slice(
                          0,
                          listing?.seller.email.indexOf("@"),
                        ) ||
                        "",
                      recipientId: listing?.seller.externalId,
                      listingId: listing?.id,
                    },
                  })
                }
              >
                <Text className="text-gray-500">Message Seller</Text>
              </Pressable>
            )}
          </View>
          <Text className="font-general-sans-regular pl-1 text-base text-neutral-600">
            {listing?.description || ""}
          </Text>
        </View>
        {accessedFrom === "personalAccount" || accessedFrom === "archive" ? (
          <PostData />
        ) : (
          <BottomButtons />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListingDetailsScreen;
