import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

const ChatList = () => {
  const router = useRouter();
  const { getChatList, getProfileById, searchProfiles } = useAPI();
  const { userId } = useAuth();

  const {
    data: chatList,
    isLoading: isChatLoading,
    refetch: refetchChatList,
  } = useQuery({
    queryKey: ["get chat list"],
    queryFn: () => getChatList(userId as string),
  });

  useEffect(() => {
    console.log(chatList);
  }, [chatList]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchChatList();
    setRefreshing(false);
  };

  const [isSearching, setIsSearching] = useState(false);

  interface Chat {
    externalId: string;
    username: string;
  }

  const ChatItem: React.FC<Chat> = ({ externalId, username }) => {
    const { data: sellerProfile, isLoading: isProfileLoading } = useQuery({
      queryKey: [externalId],
      queryFn: () => getProfileById(externalId),
    });
    return (
      <View className="h-24 w-[95%] pb-2">
        <Pressable
          onPress={() =>
            router.push({
              params: { sellerName: username || sellerProfile?.username || externalId, recipientId: externalId },
              pathname: "chat",
            })
          }
          className="h-full w-full flex-row items-center rounded-2xl bg-neutral-50 px-5 shadow-lg shadow-neutral-300"
        >
          <View className="w-[12%]">
            {isProfileLoading ? (
              <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <ActivityIndicator />
              </View>
            ) : (
              <Image
                source={{ uri: sellerProfile?.profilePic }}
                alt=""
                className="h-12 w-12 rounded-full"
              />
            )}
          </View>
          <View className="w-[80%] pl-5">
            <Text className="font-satoshi-bold text-base">
              {username || sellerProfile?.username || externalId}
            </Text>
          </View>
          <View className="w-[8%]">
            <Ionicons
              name="chevron-forward"
              size={27}
              color={COLORS.neutral[400]}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    void queryProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

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

  const SearchUsersBody = () => {
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
          className="h-full w-full pt-2"
        >
          <View className="h-full w-full">
            {searchedProfiles.map((profile, index) => {
              if (profile.id === userId) {
                return;
              }
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    if (profile.id != userId) {
                      setIsSearching(false);
                      router.push({
                        pathname: "chat",
                        params: {
                          sellerName:
                            profile.username ||
                            profile.email.slice(0, profile.email.indexOf("@")),
                          recipientId: profile.id,
                        },
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
                </Pressable>
              );
            })}
          </View>
          <View className="h-[450px]" />
        </ScrollView>
      );
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <View className="absolute top-0 z-40 w-full items-center rounded-b-3xl bg-neutral-50 px-4 pb-4 pt-16 shadow-xl">
        <View className="w-full flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-back-outline"
              size={27}
              color={COLORS.neutral[600]}
            />
          </Pressable>
          <Text className="font-general-sans-medium text-primary-500 pl-2 text-3xl">
            Chat List
          </Text>
          <Pressable onPress={() => setIsSearching(true)} className="w-7">
            <Feather name="edit" size={22} color={COLORS.neutral[600]} />
          </Pressable>
        </View>
      </View>
      {isChatLoading ? (
        <View className="items-center justify-center">
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <ScrollView
          className="mt-20 h-full w-full bg-transparent"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void onRefresh()}
            />
          }
        >
          <View className="w-full items-center justify-center bg-transparent pt-2">
            {chatList ? (
              chatList.map((chat) => (
                <ChatItem
                  username={chat.username}
                  externalId={chat.externalId}
                  key={chat.externalId}
                />
              ))
            ) : (
              <View className="items-center justify-center pt-48 text-center">
                <Text className="font-general-sans-medium text-lg text-gray-600">
                  No chats yet!
                </Text>
                <Text className="font-general-sans-regular text-md text-gray-500">
                  Click the draft icon to message someone.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <Modal
        className="h-full w-full"
        visible={isSearching}
        animationType="slide"
      >
        <SafeAreaView className="mt-12 h-full w-full">
          <View className="h-20 w-full flex-row items-center justify-between rounded-b-3xl bg-neutral-50 pl-4 pr-8 shadow-xl">
            <Pressable className="pr-3" onPress={() => setIsSearching(false)}>
              <Ionicons name="close" size={25} color={COLORS.neutral[600]} />
            </Pressable>
            <TextInput
              className="h-9 flex-grow rounded-full bg-neutral-300 px-4"
              placeholder="Search for user"
              onChangeText={(text) => {
                setSearchText(text);
              }}
              value={searchText}
              autoFocus
            />
          </View>
          <SearchUsersBody />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ChatList;
