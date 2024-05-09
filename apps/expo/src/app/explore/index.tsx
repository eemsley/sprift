import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { AntDesign, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import useAPI from "~/hooks/useAPI";
import Following from "./Following";
import Popular from "./Popular";
import Random from "./Random";
import Recommended from "./Recommended";
import SellingSoon from "./SellingSoon";

const ExploreScreen = () => {
  const router = useRouter();
  const { searchProfiles, getProfileById, searchListings } = useAPI();
  const { userId } = useAuth();
  /* initial data */

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["/api/profile"],
    queryFn: () => getProfileById(userId as string),
  });

  /* SEARCHING */
  const {
    data: searchedProfiles,
    isLoading: isSearchedProfilesLoading,
    refetch: refetchSearchedProfiles,
    isRefetching: isRefetchingSearchedProfiles,
  } = useQuery({
    queryKey: ["/api/profile/search"],
    queryFn: () => searchProfiles(searchText),
  });
  const queryProfiles = async () => {
    await refetchSearchedProfiles();
  };

  const {
    data: searchedListings,
    isLoading: isSearchedListingsLoading,
    refetch: refetchSearchedListings,
    isRefetching: isRefetchingSearchedListings,
  } = useQuery({
    queryKey: ["/api/lisings/search"],
    queryFn: () => searchListings(searchText),
  });
  const querySearchedListings = async () => {
    await refetchSearchedListings();
  };
  const [keyBoardVisible, setKeyboardVisible] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchUsers, setSearchUsers] = useState(false);
  useEffect(() => {
    if (searchUsers) {
      void queryProfiles();
    } else {
      void querySearchedListings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, searchUsers]);

  /* ANIMATIONS */
  const topBarProgress = useSharedValue(120);
  const buttonProgress = useSharedValue(0);
  const filterButtonProgress = useSharedValue(0);
  const iconProgress = useSharedValue(1);
  const searchBarMargin = useSharedValue(5);
  const filterButtonStyle = useAnimatedStyle(() => {
    return {
      height: filterButtonProgress.value,
    };
  });
  const topBarStyles = useAnimatedStyle(() => {
    return {
      height: topBarProgress.value,
    };
  });
  const buttonAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonProgress.value }],
    };
  });
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconProgress.value }],
    };
  });
  const searchBarAnimatedStyles = useAnimatedStyle(() => {
    return {
      height: 35,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "black",
      width: `80%`,
      marginLeft: searchBarMargin.value,
    };
  });

  useEffect(() => {
    if (keyBoardVisible) {
      topBarProgress.value = withTiming(155, { duration: 200 });
      buttonProgress.value = withTiming(1, { duration: 500 });
      iconProgress.value = withTiming(0, { duration: 500 });
      searchBarMargin.value = withTiming(-20, { duration: 500 });
      filterButtonProgress.value = withTiming(30, { duration: 500 });
    } else {
      topBarProgress.value = withTiming(120, { duration: 500 });
      buttonProgress.value = withTiming(0, { duration: 500 });
      iconProgress.value = withTiming(1, { duration: 500 });
      searchBarMargin.value = withTiming(5, { duration: 500 });
      filterButtonProgress.value = withTiming(0, { duration: 300 });
    }
  }, [
    keyBoardVisible,
    topBarProgress,
    buttonProgress,
    iconProgress,
    searchBarMargin,
    filterButtonProgress,
  ]);
  /* TABS */
  const [selectedTab, setSelectedTab] = useState("Recommended");
  const [showFilter, setShowFilter] = useState(false);
  const FilterModal = () => {
    return (
      <Modal visible={showFilter} animationType="slide" transparent>
        <Animated.View
          entering={FadeIn.delay(500)}
          className="top-0 h-[70%] bg-black/50"
        />
        <SafeAreaView className="absolute bottom-0 h-1/3 w-full justify-center rounded-t-3xl bg-white">
          <View className="bg-primary absolute top-0 h-12 w-full flex-row items-center justify-center">
            <Pressable
              onPress={() => setShowFilter(false)}
              className="absolute left-4"
            >
              <Ionicons name={"close"} size={25} />
            </Pressable>
            <Text className="font-general-sans-medium">
              Filter your search!
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };
  const defaultBody = () => {
    return (
      <View className="h-full w-full items-center justify-center">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="absolute top-20 z-50 h-16 w-full flex-row space-x-4 bg-transparent px-4"
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={() => setSelectedTab("Recommended")}
            className={`${
              selectedTab == "Recommended"
                ? "bg-primary-300"
                : "border-primary-300 border bg-neutral-200"
            } rounded-full px-4 py-3`}
          >
            <Text
              className={`font-general-sans-medium ${
                selectedTab == "Recommended"
                  ? "text-neutral-100"
                  : "text-primary-500"
              }`}
            >
              Recommended
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab("Following")}
            className={`${
              selectedTab == "Following"
                ? "bg-primary-300"
                : "border-primary-300 border bg-neutral-200"
            } rounded-full px-4 py-3`}
          >
            <Text
              className={`font-general-sans-medium ${
                selectedTab == "Following"
                  ? "text-neutral-100"
                  : "text-primary-500"
              }`}
            >
              Following
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab("Popular")}
            className={`${
              selectedTab == "Popular"
                ? "bg-primary-300"
                : "border-primary-300 border bg-neutral-200"
            } rounded-full px-4 py-3`}
          >
            <Text
              className={`font-general-sans-medium ${
                selectedTab == "Popular"
                  ? "text-neutral-100"
                  : "text-primary-500"
              }`}
            >
              Popular
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab("Selling Soon!")}
            className={`${
              selectedTab == "Selling Soon!"
                ? "bg-primary-300"
                : "border-primary-300 border bg-neutral-200"
            } rounded-full px-4 py-3`}
          >
            <Text
              className={`font-general-sans-medium ${
                selectedTab == "Selling Soon!"
                  ? "text-neutral-100"
                  : "text-primary-500"
              }`}
            >
              Selling Soon!
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedTab("Random")}
            className={`${
              selectedTab == "Random"
                ? "bg-primary-300"
                : "border-primary-300 border bg-neutral-200"
            } rounded-full px-4 py-3`}
          >
            <Text
              className={`font-general-sans-medium ${
                selectedTab == "Random"
                  ? "text-neutral-100"
                  : "text-primary-500"
              }`}
            >
              Surprise Me!
            </Text>
          </Pressable>
          <View className="w-4" />
        </ScrollView>
        {selectedTab == "Recommended" && <Recommended />}
        {selectedTab == "Following" && <Following />}
        {selectedTab == "Popular" && <Popular />}
        {selectedTab == "Selling Soon!" && <SellingSoon />}
        {selectedTab == "Random" && <Random />}
      </View>
    );
  };
  const searchUsersBody = () => {
    if (
      isSearchedProfilesLoading ||
      isRefetchingSearchedProfiles ||
      !searchedProfiles
    ) {
      return (
        <View className="h-full w-full items-center justify-center">
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <ScrollView
          keyboardShouldPersistTaps="always"
          className="h-full w-full "
        >
          <View className="h-full w-full pt-32 ">
            {searchedProfiles.map((profile, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (profile.id != userId) {
                      router.push({
                        pathname: "other-user-account",
                        params: {
                          id: profile.id,
                          email: profile.email,
                        },
                      });
                    } else {
                      router.push({
                        pathname: "account",
                      });
                    }
                  }}
                  className="z-50 m-1 h-16 w-full flex-row items-center rounded-full bg-neutral-200 p-3 shadow-lg shadow-neutral-300"
                >
                  <View className="bg-primary-500 h-10 w-10 items-center justify-center rounded-full">
                    <Image
                      alt="profile"
                      source={{
                        uri: profile.profilePic,
                      }}
                      className="h-10 w-10 rounded-full"
                    />
                  </View>
                  <Text className="font-general-sans-medium pl-3 text-lg text-neutral-700 ">
                    {profile.username == "" ? profile.email : profile.username}
                  </Text>
                  {profile.id == userId && (
                    <Text className=" font-general-sans-medium text-primary-400 pl-2 text-xs ">
                      (Me)
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View className="h-72" />
        </ScrollView>
      );
    }
  };
  const searchListingsBody = () => {
    if (
      isSearchedListingsLoading ||
      isRefetchingSearchedListings ||
      isProfileLoading ||
      !profile ||
      !searchedListings
    ) {
      return (
        <View className="h-full w-full items-center justify-center">
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <ScrollView
          keyboardShouldPersistTaps="always"
          className="h-full w-full"
        >
          <View className="h-full w-full flex-row flex-wrap  pt-32">
            {searchedListings.map((listing, index) => {
              return (
                <View key={index} className="h-52 w-1/2 p-2 ">
                  <Pressable
                    className="h-full w-full rounded-xl bg-white shadow-md shadow-neutral-400"
                    onPress={() => {
                      router.push({
                        pathname: "/listing-details",
                        params: {
                          id: listing.id,
                          accessedFrom: "main",
                        },
                      });
                    }}
                  >
                    <Image
                      source={{ uri: listing.imagePaths[0] }}
                      alt="test"
                      className="h-full w-full rounded-xl "
                    />
                    <View className="absolute bottom-1 w-full flex-row justify-start space-x-1 rounded-full p-1">
                      <View className="bg-primary-500/80 flex-row items-center justify-evenly rounded-full p-1">
                        <Entypo name="ruler" color={"ivory"} size={13} />
                        <Text className="font-general-sans-medium text-center text-white">
                          {listing.size}
                        </Text>
                      </View>
                      <View className="bg-primary-800/80 flex-row items-center justify-center rounded-full px-2 py-1">
                        <FontAwesome name="dollar" color={"ivory"} size={13} />
                        <Text className="font-general-sans-medium text-center text-white">
                          {listing.price}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <View className="h-72" />
        </ScrollView>
      );
    }
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

      {/* TOP BAR  */}
      <Animated.View
        style={topBarStyles}
        className="shadow-primary-600/20 absolute top-0 z-50 w-full items-center rounded-b-3xl  bg-transparent bg-white px-5 pt-16 shadow-xl"
      >
        <View className="w-full flex-row justify-center">
          {/* SEARCH BAR  */}
          <Animated.View
            style={searchBarAnimatedStyles}
            className={"flex-row items-center rounded-full px-4"}
          >
            <Ionicons name="search-outline" color={"black"} size={15} />
            <TextInput
              className="font-general-sans-medium ml-2 h-full w-[90%]"
              placeholder="Explore"
              onPressIn={() => {
                setKeyboardVisible(true);
              }}
              onChangeText={(text) => {
                setSearchText(text);
              }}
              value={searchText}
            />
          </Animated.View>
          {keyBoardVisible ? (
            <Animated.View
              style={buttonAnimatedStyles}
              className="h-8 w-14 items-center justify-center"
            >
              <Pressable
                onPress={() => {
                  setKeyboardVisible(false);
                  Keyboard.dismiss();
                }}
                className="ml-1 h-full w-full items-center justify-center"
              >
                <Text className="text-blue-500">Cancel</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <Pressable
              onPress={() => {
                setShowFilter(!showFilter);
              }}
            >
              <Animated.View
                style={iconStyle}
                className="h-8 w-14 items-center justify-center pl-1"
              >
                <Ionicons
                  name={true ? "filter-sharp" : "filter-outline"}
                  color={"black"}
                  size={25}
                />
              </Animated.View>
            </Pressable>
          )}
        </View>
        {
          <View className="mt-2 h-10 w-full flex-row items-center justify-evenly ">
            <Animated.View
              style={filterButtonStyle}
              className={
                searchUsers
                  ? `h-8 w-[45%] items-center justify-center rounded-full bg-neutral-300`
                  : `bg-primary-500 h-8 w-[45%] items-center justify-center rounded-full`
              }
            >
              <Pressable
                onPress={() => {
                  setSearchUsers(false);
                }}
                className="h-full w-full items-center justify-center"
              >
                <Text
                  className={
                    searchUsers
                      ? "font-general-sans-medium "
                      : "font-general-sans-medium text-slate-100"
                  }
                >
                  Clothing
                </Text>
              </Pressable>
            </Animated.View>
            <Animated.View
              style={filterButtonStyle}
              className={
                !searchUsers
                  ? `h-8 w-[45%] items-center justify-center rounded-full bg-neutral-300`
                  : `bg-primary-500 h-8 w-[45%] items-center justify-center rounded-full`
              }
            >
              <Pressable
                onPress={() => {
                  setSearchUsers(true);
                }}
                className="h-full w-full items-center justify-center"
              >
                <Text
                  className={
                    !searchUsers
                      ? "font-general-sans-medium "
                      : "font-general-sans-medium text-slate-100"
                  }
                >
                  Sellers
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        }
      </Animated.View>

      {/* BODY  */}
      {!keyBoardVisible && defaultBody()}
      {keyBoardVisible && searchUsers && searchUsersBody()}
      {keyBoardVisible && !searchUsers && searchListingsBody()}
      <FilterModal />
    </SafeAreaView>
  );
};

export default ExploreScreen;
