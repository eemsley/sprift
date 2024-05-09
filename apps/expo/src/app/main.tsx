// eslint-disable @typescript-eslint/no-non-null-assertion
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import type Swiper from "react-native-deck-swiper";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";

import { clothingTypes, sizeOptions } from "~/utils/constants";
import { type ListingType } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import AnimatedListingSwiper from "~/components/main/AnimatedListingSwiper";
import ListingCardSkeleton from "~/components/main/ListingCardSkeleton";
import Dislike from "~/components/shared/icons/Dislike";
import Like from "~/components/shared/icons/Like";
import useAPI from "~/hooks/useAPI";

const swiperRef = React.createRef<Swiper<ListingType>>();

const MainScreen = () => {
  const { userId } = useAuth();
  const {
    getAllListings,
    getFilters,
    updateFilters,
    likeListing,
    dislikeListing,
    addListingToCart,
    addToSavedForLater,
    removeListingFromCart,
    getListingsInCart,
    removeDislike,
    removeLike,
    removeFromSavedForLater,
    getUserNotifications,
  } = useAPI();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [swipedAll, setSwipedAll] = useState(false);

  const { data: notifications, isLoading: _ } = useQuery(
    ["notifications"],
    () => getUserNotifications(userId as string),
  );

  //FILTERING
  const { data: filters, isLoading: isFiltersLoading } = useQuery(
    ["filters"],
    () => getFilters(userId as string),
  );

  const { mutate: updateUserFilters, isLoading: isUpdatingFilters } =
    useMutation(
      ["updateFilters"],
      () =>
        updateFilters(userId as string, {
          gender: gender,
          maxPrice: maxPrice,
          types: selectedClothingTypes,
          sizes: selectedSizes,
        }),
      { onSuccess: () => refetchListings() },
    );

  const [filterModified, setFilterModified] = useState(false);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [gender, setGender] = useState<string>("U");
  const [sizeSearch, setSizeSearch] = useState<string>("");
  const [selectedClothingTypes, setSelectedClothingTypes] = useState<string[]>(
    [],
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const filteredSizes = sizeOptions.filter((size) => {
    return size.value.toUpperCase().includes(sizeSearch.toUpperCase());
  });
  useEffect(() => {
    if (filters && !isFiltersLoading) {
      setMaxPrice(filters.maxPrice);
      setGender(filters.gender);
      if (filters.types.length === 0) {
        setSelectedClothingTypes(clothingTypes.slice(0));
      } else setSelectedClothingTypes(filters.types);
      setSelectedSizes(filters.sizes);
      void refetchListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, isFiltersLoading]);

  const {
    data: recommendations,
    isLoading: isRecommendationsLoading,
    refetch: refetchListings,
    isRefetching: isRefetchingListings,
  } = useQuery(["listings"], () =>
    getAllListings(userId as string, true, undefined),
  );

  const {
    data: cart,
    isLoading: isCartLoading,
    refetch: refetchCart,
    isRefetching: isRefetchingCart,
  } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: () => getListingsInCart(userId as string),
  });
  const [cartCount, setCartCount] = useState(cart?.length || 0);
  useEffect(() => {
    if (cart !== undefined) {
      setCartCount(cart?.length);
    }
  }, [cart]);

  const filterListings = () => {
    updateUserFilters();
    setIndex(0);
    setKeyboardVisible(false);
    Keyboard.dismiss();
    setSwipedAll(false);
    setFilterModified(false);
  };

  //for glowing dislike, add to cart, and like buttons as someone swipes
  const [isGlowingLeft, setGlowingLeft] = useState(false);
  const [isGlowingRight, setGlowingRight] = useState(false);
  const [isGlowingDown, setGlowingDown] = useState(false);

  Keyboard.addListener("keyboardWillHide", () => {
    setKeyboardVisible(false);
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  /* ANIMATIONS */
  const [showFilter, setShowFilter] = useState(false);
  const likeSize = useSharedValue(100);
  const likeOpacity = useSharedValue(0.8);
  const likeStyle = useAnimatedStyle(() => {
    return {
      height: likeSize.value,
      width: likeSize.value,
      opacity: likeOpacity.value,
    };
  });
  const dislikeSize = useSharedValue(100);
  const dislikeOpacity = useSharedValue(0.8);
  const dislikeStyle = useAnimatedStyle(() => {
    return {
      height: dislikeSize.value,
      width: dislikeSize.value,
      opacity: dislikeOpacity.value,
    };
  });
  const cartSize = useSharedValue(100);
  const cartOpacity = useSharedValue(0.8);
  const cartStyle = useAnimatedStyle(() => {
    return {
      height: cartSize.value,
      width: cartSize.value,
      // opacity: cartOpacity.value,
    };
  });
  useEffect(() => {
    if (isGlowingRight) {
      likeSize.value = withTiming(60, { duration: 80 });
      likeOpacity.value = withTiming(1, { duration: 80 });
    } else {
      likeSize.value = withTiming(50, { duration: 200 });
      likeOpacity.value = withTiming(0.9, { duration: 200 });
    }
    if (isGlowingLeft) {
      dislikeSize.value = withTiming(60, { duration: 80 });
      dislikeOpacity.value = withTiming(1, { duration: 80 });
    } else {
      dislikeSize.value = withTiming(50, { duration: 200 });
      dislikeOpacity.value = withTiming(0.9, { duration: 200 });
    }
    if (isGlowingDown) {
      cartSize.value = withTiming(75, { duration: 80 });
      cartOpacity.value = withTiming(1, { duration: 80 });
    } else {
      cartSize.value = withTiming(64, { duration: 200 });
      cartOpacity.value = withTiming(0.8, { duration: 200 });
    }
  }, [
    dislikeSize,
    isGlowingLeft,
    dislikeOpacity,
    isGlowingRight,
    likeSize,
    likeOpacity,
    cartSize,
    cartOpacity,
    isGlowingDown,
  ]);
  const underlineSize = useSharedValue(0);
  const topPadding = useSharedValue(0);
  const topPaddingStyle = useAnimatedStyle(() => {
    return {
      paddingTop: topPadding.value,
    };
  });
  const filterOpacity = useSharedValue(0);
  const filterContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: filterOpacity.value,
    };
  });
  useEffect(() => {
    if (showFilter) {
      topPadding.value = withTiming(160, { duration: 500 });
      underlineSize.value = withTiming(0, { duration: 500 });
      filterOpacity.value = withTiming(1, { duration: 500 });
    } else {
      topPadding.value = withTiming(75, { duration: 500 });
      underlineSize.value = withTiming(100, { duration: 500 });
      filterOpacity.value = withTiming(0, { duration: 500 });
    }
  }, [topPadding, showFilter, underlineSize, filterOpacity]);

  const onSwipedAll = () => {
    setSwipedAll(true);
  };

  const onLikeListing = (listing: ListingType) => {
    likeListing(userId as string, listing.id)
      .then((_) => {
        console.log(`User ${userId} successfully liked listing ${listing.id}.`);
      })
      .catch((err) => console.log(err));
  };

  const onDislikeListing = (listing: ListingType) => {
    dislikeListing(userId as string, listing.id)
      .then((_) => {
        console.log(
          `User ${userId} successfully disliked listing ${listing.id}.`,
        );
      })
      .catch((err) => console.log(err));
  };

  const onAddToCart = (listing: ListingType) => {
    //will not add item to cart if there's more than 30 items in the cart
    if (cartCount > 29) {
      swiperRef.current?.swipeBack();
      Alert.alert(
        "Cannot add this item to cart",
        "You're cart is full. You're limited to 30 items at a time",
        [
          {
            text: "Ok",
            onPress: () => {
              setSwipedAll(false);
            },
          },
        ],
      );
    } else {
      addListingToCart(userId as string, listing.id)
        .then((_) => {
          console.log(
            `User ${userId} successfully added listing ${listing.id}. to their cart.`,
          );
          void refetchCart();
        })
        .catch((err) => console.log(err));
    }
  };

  const onAddToSaved = (listing: ListingType) => {
    addToSavedForLater(userId as string, listing.id)
      .then((_) => {
        console.log(
          `User ${userId} successfully added listing ${listing.id} to saved`,
        );
      })
      .catch((err) => console.log(err));
  };

  //previousSwipe is cart | dislike | like | back for reverting
  //prevListingID is the last swiped listing id and prevListingIndex is it's index for the swiper
  const [previousSwipe, setPreviousSwipe] = useState("");
  const [prevListingID, setPrevListingID] = useState("");
  const [prevListingIndex, setPrevListingIndex] = useState(0);
  const onSwipedBottom = (index: number, listings: ListingType[]) => {
    setPreviousSwipe("cart");
    const currentListing = listings[index];
    if (currentListing === undefined) return;
    else onAddToCart(currentListing);
    setPrevListingID(currentListing.id);
    setPrevListingIndex(index);
  };
  const onSwipedLeft = (index: number, listings: ListingType[]) => {
    setPreviousSwipe("dislike");
    const currentListing = listings[index];
    if (currentListing === undefined) return;
    else onDislikeListing(currentListing);
    setPrevListingID(currentListing.id);
    setPrevListingIndex(index);
  };
  const onSwipedRight = (index: number, listings: ListingType[]) => {
    setPreviousSwipe("like");
    const currentListing = listings[index];
    if (currentListing === undefined) return;
    else onLikeListing(currentListing);
    setPrevListingID(currentListing.id);
    setPrevListingIndex(index);
  };
  const onSwipedTop = (index: number, listings: ListingType[]) => {
    setPreviousSwipe("saved");
    const currentListing = listings[index];
    if (currentListing === undefined) return;
    else onAddToSaved(currentListing);
    setPrevListingID(currentListing.id);
    setPrevListingIndex(index);
  };
  const onSwipeAborted = () => {
    setGlowingLeft(false);
    setGlowingRight(false);
    setGlowingDown(false);
  };
  const onSwiped = () => {
    setIndex(index + 1);
    setGlowingDown(false);
    setGlowingLeft(false);
    setGlowingRight(false);
  };

  const { mutate: removeFromCart } = useMutation({
    mutationKey: ["/api/cart/remove"],
    mutationFn: (listingId: string) =>
      removeListingFromCart(userId as string, listingId),
    onSuccess: () => {
      // Refetch
      void refetchCart();
    },
  });

  const { mutate: removeFromSaved } = useMutation({
    mutationKey: ["/api/saved/remove"],
    mutationFn: (listingId: string) =>
      removeFromSavedForLater(userId as string, listingId),
  });

  const { mutate: removeLikeFromListing } = useMutation({
    mutationKey: ["/api/listings/like/remove"],
    mutationFn: (listingId: string) => removeLike(userId as string, listingId),
  });

  const { mutate: removeDislikeFromListing } = useMutation({
    mutationKey: ["/api/listings/dislike/remove"],
    mutationFn: (listingId: string) =>
      removeDislike(userId as string, listingId),
  });

  const onSwipeReverted = () => {
    if (previousSwipe === "back") {
      Alert.alert("You can only go back to one previous listing!");
    } else if (previousSwipe === "cart") {
      //swipes back and removes from cart
      swiperRef.current?.jumpToCardIndex(prevListingIndex);
      setSwipedAll(false);
      setShowFilter(false);
      setIndex(prevListingIndex);
      if (prevListingID) {
        removeFromCart(prevListingID);
      }
    } else if (previousSwipe === "like") {
      //swipes back and removes like
      swiperRef.current?.swipeBack();
      setSwipedAll(false);
      setShowFilter(false);
      setIndex(prevListingIndex);
      if (prevListingID) {
        removeLikeFromListing(prevListingID);
      }
    } else if (previousSwipe === "dislike") {
      //swipes back and removes dislike
      swiperRef.current?.swipeBack();
      setSwipedAll(false);
      setShowFilter(false);
      setIndex(prevListingIndex);
      if (prevListingID) {
        removeDislikeFromListing(prevListingID);
      }
    } else if (previousSwipe === "saved") {
      //swipes back and removes save
      swiperRef.current?.swipeBack();
      setSwipedAll(false);
      setShowFilter(false);
      setIndex(prevListingIndex);
      if (prevListingID) {
        removeFromSaved(prevListingID);
      }
    }
    setPreviousSwipe("back");
  };

  interface GlowCoords {
    x: number;
    y: number;
  }

  const SwipingGlow: React.FC<GlowCoords> = ({ x, y }) => {
    if (y > 160) {
      setGlowingDown(true);
      setGlowingLeft(false);
      setGlowingRight(false);
    } else if (x < -90) {
      setGlowingLeft(true);
      setGlowingRight(false);
      setGlowingDown(false);
    } else if (x > 90) {
      setGlowingLeft(false);
      setGlowingRight(true);
      setGlowingDown(false);
    } else {
      setGlowingDown(false);
      setGlowingRight(false);
      setGlowingLeft(false);
    }
    return null;
  };

  const BottomButtons: React.FC = () => {
    return (
      <View className="absolute bottom-16 h-16 w-full flex-row items-center justify-center space-x-3">
        <View className="flex-row items-center space-x-8">
          <Animated.View
            className={"items-center justify-center"}
            style={{ height: 40, width: 40 }}
          >
            <Pressable
              onPress={() => onSwipeReverted()}
              className={`z-50 h-full w-full items-center justify-center rounded-full border-2 border-[#C9C9C9]`}
            >
              <AntDesign name="back" size={18} color="#C9C9C9" />
            </Pressable>
          </Animated.View>

          <Animated.View
            className={"items-center justify-center"}
            style={dislikeStyle}
          >
            <Pressable
              onPress={() => {
                swiperRef.current?.swipeLeft();
                setGlowingLeft(true);
              }}
              className={`z-50 h-full w-full items-center justify-center rounded-full border-2 border-[#FF8181] pt-1 `}
            >
              <Dislike />
            </Pressable>
          </Animated.View>
        </View>
        <Animated.View
          className={"z-50 mt-28 items-center justify-center"}
          style={cartStyle}
        >
          <Pressable
            onPress={() => {
              swiperRef.current?.swipeBottom();
              setGlowingDown(true);
            }}
            className={`bg-primary-400 shadow-primary-100 z-50 h-full w-full items-center justify-center rounded-3xl shadow-xl`}
          >
            {isGlowingDown ? (
              <MaterialCommunityIcons
                name="cart-check"
                size={35}
                color="ivory"
              />
            ) : (
              <MaterialCommunityIcons name={"cart"} size={35} color={"ivory"} />
            )}
            {isGlowingDown ? (
              <View className="absolute h-0" />
            ) : (
              <View
                className={
                  cartCount === 0
                    ? "absolute"
                    : "absolute right-3 top-2 h-4 w-4 items-center justify-center rounded-full bg-gray-100/80"
                }
              >
                <Text className="font-general-sans-medium text-xs text-gray-500">
                  {cartCount === 0 ? "" : cartCount}
                </Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        <View className="flex-row items-center space-x-8">
          <Animated.View
            className={"items-center justify-center"}
            style={likeStyle}
          >
            <Pressable
              onPress={() => {
                swiperRef.current?.swipeRight();
                setGlowingRight(true);
              }}
              className={`z-50 h-full w-full items-center justify-center rounded-full border-2 border-[#99D6AE] pb-1`}
            >
              <Like />
            </Pressable>
          </Animated.View>
          <Animated.View
            className={
              swipedAll
                ? "items-center justify-center opacity-0"
                : "items-center justify-center opacity-100"
            }
            style={{ height: 40, width: 40 }}
          >
            <Pressable
              onPress={() => {
                swiperRef.current?.swipeTop();
              }}
              className={`z-50 h-full w-full items-center justify-center rounded-full border-2 border-[#C9C9C9]`}
            >
              <FontAwesome5 name="bookmark" size={18} color="#C9C9C9" />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  };

  const BottomFilters: React.FC = () => {
    return (
      <>
        <Pressable
          className={`z-0 mx-2 h-full items-center justify-center rounded-2xl px-2 ${
            selectedClothingTypes.length != clothingTypes.length
              ? "bg-secondary-400 border border-white"
              : "bg-secondary-400/50 border-white"
          }`}
          onPress={() => {
            if (selectedClothingTypes.length != clothingTypes.length)
              setFilterModified(true);
            setSelectedClothingTypes(clothingTypes.slice(0));
          }}
        >
          <Text
            className={`font-general-sans-medium text-l text-center  ${
              selectedClothingTypes.length != clothingTypes.length
                ? "text-white"
                : "text-white/80"
            }`}
          >
            Select All
          </Text>
        </Pressable>
        <Pressable
          className={`z-0 mx-2 h-full items-center justify-center rounded-2xl px-2 ${
            selectedClothingTypes.length != 0
              ? "bg-secondary-400 border border-white"
              : "bg-secondary-400/50 border-white"
          }`}
          onPress={() => {
            if (selectedClothingTypes.length != 0) setFilterModified(true);
            setSelectedClothingTypes([]);
          }}
        >
          <Text
            className={`font-general-sans-medium text-l text-center  ${
              selectedClothingTypes.length != 0 ? "text-white" : "text-white/80"
            }`}
          >
            Deselect All
          </Text>
        </Pressable>
        {clothingTypes.map((type, index) => (
          <Pressable
            key={index}
            className={`z-0 mx-2 h-full items-center justify-center rounded-2xl px-2 ${
              selectedClothingTypes.includes(type)
                ? "bg-primary-400 border border-white"
                : "border border-neutral-500 bg-neutral-200"
            }`}
            onPress={() => {
              setFilterModified(true);
              selectedClothingTypes.includes(type)
                ? setSelectedClothingTypes(
                    selectedClothingTypes.filter((item) => item !== type),
                  )
                : setSelectedClothingTypes([...selectedClothingTypes, type]);
            }}
          >
            <Text
              className={`font-general-sans-medium text-l text-center  ${
                selectedClothingTypes.includes(type)
                  ? "text-white"
                  : "text-neutral-500"
              }`}
            >
              {type}
            </Text>
          </Pressable>
        ))}

        <View className="h-full w-4" />
      </>
    );
  };

  return (
    <SafeAreaView className="h-full w-full bg-[#F5F5F5]">
      <Animated.View
        style={topPaddingStyle}
        className="justify-top h-full w-full items-center"
      >
        <Stack.Screen
          options={{
            animation: "none",
            headerBackVisible: false,
            headerStyle: {
              backgroundColor: COLORS.primary[500],
            },
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {keyboardVisible && showFilter && (
          <ScrollView
            keyboardShouldPersistTaps={"always"}
            className="absolute top-40 z-50 h-[65%] w-full bg-neutral-200/90 p-4"
          >
            {filteredSizes.map((size, index) => (
              <Pressable
                key={index}
                className="shadow-primary-400/50 my-1 h-12 w-full justify-center rounded-3xl bg-white shadow-sm"
                onPress={() => {
                  setFilterModified(true);
                  if (selectedSizes.includes(size.value)) return;
                  else {
                    setSelectedSizes([size.value, ...selectedSizes]);
                    setSizeSearch("");
                  }
                }}
              >
                <Text className="font-general-sans-medium px-4">
                  {size.value}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        <View className="absolute top-1 z-50 w-full items-center rounded-full px-5 py-2">
          <View className="w-full flex-row items-center justify-between">
            <View className="w-28 items-center justify-center">
              <Text className="font-satoshi-black text-primary-400 text-center text-4xl tracking-wide">
                Sprift
              </Text>
            </View>
            <View className="font-general-sans-medium h-8 flex-row items-center justify-between space-x-3">
              {filterModified ? (
                isRefetchingListings ||
                isUpdatingFilters ||
                isFiltersLoading ||
                isRecommendationsLoading ? (
                  <ActivityIndicator color={COLORS.primary[400]} />
                ) : (
                  <Pressable
                    onPress={() => void filterListings()}
                    className="border-primary-400 rounded-full border bg-white px-2 py-1"
                    disabled={
                      isRefetchingListings ||
                      isRecommendationsLoading ||
                      isFiltersLoading ||
                      isUpdatingFilters
                    }
                  >
                    <Text className="text-primary-400">Apply Filters!</Text>
                  </Pressable>
                )
              ) : (
                <Ionicons
                  onPress={() => {
                    setShowFilter(!showFilter);
                    setSizeSearch("");
                    setKeyboardVisible(false);
                    Keyboard.dismiss();
                  }}
                  name={showFilter ? "filter-sharp" : "filter-outline"}
                  color={"black"}
                  size={25}
                />
              )}
              <Ionicons
                onPress={() => {
                  router.push("notifications");
                }}
                name="notifications-outline"
                color={"black"}
                size={27}
              />
              {notifications?.length != undefined &&
                notifications.filter((item) => !item.viewed).length > 0 && (
                  <View className="bg-primary-400 absolute right-8 top-0 h-4 w-4 items-center justify-center rounded-full">
                    <Text className="font-general-sans-medium text-xs text-white">
                      {notifications.filter((item) => !item.viewed).length}
                    </Text>
                  </View>
                )}
              <AntDesign
                name="message1"
                color={"black"}
                size={22}
                onPress={() => {
                  router.push("chat-list");
                }}
              />
            </View>
          </View>
        </View>

        {showFilter && (
          <Animated.View
            className="absolute top-16 z-50 items-center justify-center "
            style={filterContainerStyle}
          >
            <View className="mb-3 h-10 w-full flex-row items-center justify-center space-x-5 pl-4">
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                className="h-full w-full pr-2"
              >
                <BottomFilters />
              </ScrollView>
            </View>
            <View className=" h-10 w-full flex-row items-center justify-center space-x-5 pl-4">
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                className="h-full w-full pr-2"
              >
                <Pressable className="bg-primary-400 mx-2 h-full flex-row items-center justify-center rounded-2xl px-2">
                  <TextInput
                    className="h-full pl-1  pr-2 text-white"
                    placeholder="Sizes:"
                    placeholderTextColor={"white"}
                    onChangeText={(text) => {
                      setSizeSearch(text);
                    }}
                    value={sizeSearch}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      setSizeSearch("");
                      setKeyboardVisible(false);
                    }}
                    onPressIn={() => {
                      setKeyboardVisible(true);
                    }}
                  />
                </Pressable>

                {selectedSizes.map((size, index) => (
                  <Pressable
                    key={index}
                    className={`bg-primary-400/80 mx-2 h-full flex-row items-center justify-center rounded-2xl border border-white px-2`}
                    onPress={() => {
                      setFilterModified(true);
                      setSelectedSizes(
                        selectedSizes.filter((item) => item !== size),
                      );
                    }}
                  >
                    <Text
                      className={`font-general-sans-medium text-l pr-2 text-center text-white`}
                    >
                      {size}
                    </Text>
                    <Ionicons name="close" color={"white"} size={12} />
                  </Pressable>
                ))}

                <Pressable
                  onPress={() => {
                    setKeyboardVisible(false);
                  }}
                  className="bg-primary-400 mx-2 h-full flex-row items-center justify-center rounded-2xl px-2"
                >
                  <Text className="font-general-sans-medium px-2 text-white">
                    Max Price:
                  </Text>
                  {maxPrice != Number.MAX_SAFE_INTEGER && (
                    <FontAwesome name="dollar" color={"ivory"} size={13} />
                  )}
                  <TextInput
                    className="h-full pr-2 text-white"
                    onPressIn={() => {
                      setKeyboardVisible(false);
                      setMaxPrice(Number.MAX_SAFE_INTEGER);
                    }}
                    placeholder={
                      maxPrice === Number.MAX_SAFE_INTEGER
                        ? "none"
                        : maxPrice.toString()
                    }
                    placeholderTextColor={COLORS.primary[50]}
                    returnKeyType="done"
                    keyboardType="numeric"
                    value={
                      maxPrice === Number.MAX_SAFE_INTEGER
                        ? ""
                        : maxPrice.toString()
                    }
                    onChangeText={(text) => {
                      setFilterModified(true);
                      if (text == "") {
                        setMaxPrice(Number.MAX_SAFE_INTEGER);
                      } else {
                        setMaxPrice(parseFloat(text));
                      }
                    }}
                  />
                </Pressable>

                <Pressable
                  className={`border-primary-400 mx-2 h-full w-32 flex-row items-center justify-evenly rounded-2xl border bg-white px-2`}
                  onPress={() => {
                    setFilterModified(true);
                    if (gender == "F") setGender("M");
                    if (gender == "M") setGender("U");
                    if (gender == "U") setGender("F");
                  }}
                >
                  <Text className={` text-primary-400 text-center font-bold`}>
                    {gender == "U" && "Gender: All"}
                    {gender == "M" && "Men's Only"}
                    {gender == "F" && "Women's Only"}
                  </Text>
                </Pressable>
                <View className="h-full w-4" />
              </ScrollView>
            </View>
          </Animated.View>
        )}
        {swipedAll ||
        (!isRecommendationsLoading &&
          recommendations &&
          recommendations.listings &&
          recommendations.listings.length === 0) ? (
          <View className="absolute top-12 h-full w-full items-center justify-center">
            <View className="aspect-square w-[90%]  items-center justify-center">
              <Text className="font-satoshi-bold text-secondary-900 text-center  text-2xl">
                You{"'"}ve reached the end.
              </Text>
              <Text className="font-general-sans-medium text-md text-secondary-800 w-full self-center pt-2 text-center">
                Modify your filters to see any items you missed,{"\n"} or come
                back later to see new listings.
              </Text>
              <Text className="font-satoshi-medium text-secondary-900 pt-5 text-center text-xl">
                Thank you for swiping with us!
              </Text>
            </View>
          </View>
        ) : (
          <View className="h-[80%] w-[93%] items-center justify-center">
            {isRecommendationsLoading ||
            isRefetchingListings ||
            isFiltersLoading ||
            isUpdatingFilters ||
            !recommendations ||
            !recommendations.listings ? (
              <View className=" h-[90%] w-full items-center justify-center rounded-3xl  bg-white">
                <ListingCardSkeleton />
              </View>
            ) : (
              <AnimatedListingSwiper
                swiperRef={swiperRef}
                listings={recommendations.listings}
                currentIndex={index}
                onSwipedAll={onSwipedAll}
                onSwipedBottom={onSwipedBottom}
                onSwipedLeft={onSwipedLeft}
                onSwipedRight={onSwipedRight}
                onSwipedTop={onSwipedTop}
                onSwiping={(x: number, y: number) => SwipingGlow({ x, y })}
                onSwipeAborted={onSwipeAborted}
                onSwiped={onSwiped}
              />
            )}
          </View>
        )}

        {swipedAll ||
        (!isRecommendationsLoading &&
          recommendations &&
          recommendations.listings.length === 0) ? (
          <Pressable
            onPress={() => {
              router.push("cart");
            }}
            className={`bg-primary-400 absolute bottom-2 z-50 h-16 w-16 items-center justify-center rounded-3xl shadow-xl`}
            disabled={isRefetchingCart || isCartLoading}
          >
            <MaterialCommunityIcons name={"cart"} size={35} color={"ivory"} />
          </Pressable>
        ) : (
          <BottomButtons />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

export default MainScreen;
