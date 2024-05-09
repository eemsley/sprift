import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  InputToolbar,
  MessageImage,
  Send,
  type IMessage,
} from "react-native-gifted-chat";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

interface Message {
  id: string | number;
  senderExternalId: string | number;
  recipientExternalId: string | number;
  createdAt: number | Date;
  updatedAt: number | Date;
  content: string;
  listingDescription: string | null;
  image: string | null;
}

const ChatScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { sellerName, recipientId, listingId } = params;
  const {
    getAllMessagesInChat,
    createMessageInChat,
    getProfileById,
    getListingById,
  } = useAPI();
  const [iMessages, setIMessages] = useState<IMessage[]>([]);
  const { userId } = useAuth();

  const { data: allMessages, isLoading: areMessagesLoading } = useQuery({
    queryKey: ["get messages"],
    queryFn: () =>
      getAllMessagesInChat(userId as string, recipientId as string),
    refetchInterval: iMessages.length === 0 ? false : 1000,
  });

  const { data: sellerProfile } = useQuery({
    queryKey: ["seller profile"],
    queryFn: () => getProfileById(recipientId as string),
  });

  const { data: listing } = useQuery({
    queryKey: ["listing"],
    queryFn: () => getListingById(listingId as string),
  });

  const [firstMessage, setFirstMessage] = useState(true);

  useEffect(() => {
    const ConvertToIMessage = (message: Message): IMessage => {
      return {
        _id: message.id,
        text: message.listingDescription
          ? message.listingDescription + "\n\n" + message.content
          : message.content,
        image: message.image || "",
        createdAt: message.createdAt,
        user: {
          _id: message.senderExternalId,
          name:
            message.senderExternalId === userId ? "" : (sellerName as string),
          avatar:
            message.senderExternalId === userId
              ? undefined
              : sellerProfile?.profilePic || undefined,
        },
      };
    };
    const ConvertArrayToIMessage = (messages: Message[]): IMessage[] => {
      return messages.reverse().map(ConvertToIMessage);
    };
    if (allMessages) {
      if (iMessages.length <= allMessages?.length) {
        setIMessages(ConvertArrayToIMessage(allMessages));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessages]);

  const onSend = useCallback(
    (messages: IMessage[] = []) => {
      const onCreateMessage = (content: string) => {
        if (firstMessage && listingId) {
          setFirstMessage(false);
          createMessageInChat(
            userId as string,
            recipientId as string,
            content,
            listingId as string,
          )
            .then((_) => {
              console.log("sent message")
            })
            .catch((err) => console.log(err));
        } else {
          createMessageInChat(userId as string, recipientId as string, content)
            .then((_) => {
              console.log("sent message");
            })
            .catch((err) => console.log(err));
        }
      };
      setIMessages((previousMessages: IMessage[] | undefined) =>
        GiftedChat.append(previousMessages, messages),
      );
      if (messages[0] !== undefined) {
        onCreateMessage(messages[0].text);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createMessageInChat, recipientId, userId],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "white",
          },
        }}
        wrapperStyle={{
          right: {
            backgroundColor: COLORS.primary[500],
          },
        }}
      />
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMessageImage = (props: any) => {
    return (
      <MessageImage
        {...props}
        lightboxProps={{
          disabled: true,
        }}
      />
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderInputToolbar = (props: any) => {
    return (
      <View className="w-full">
        {firstMessage && listingId ? (
          <View className="absolute flex-row -top-10 bg-neutral-50 w-full justify-evenly items-center rounded-lg pb-1">
            <Image
              className="h-9 w-9 rounded-lg"
              source={{ uri: listing?.imagePaths[0] }}
              alt=""
            />
            <Text className="w-2/3 text-sm font-general-sans-regular text-gray-600">{listing?.description}</Text>
          </View>
        ) : (
          <></>
        )}
        <InputToolbar
          {...props}
          containerStyle={{
            borderRadius: 20,
            borderTopWidth: 2,
            borderTopColor: COLORS.neutral[50],
            shadowColor: COLORS.neutral[400],
            shadowRadius: 15,
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: -20 },
            backgroundColor: COLORS.neutral[50],
            paddingHorizontal: 3,
          }}
        />
      </View>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSend = (props: any) => {
    return (
      <Send
        {...props}
        containerStyle={{ shadowColor: "transparent" }}
        textStyle={{ color: COLORS.primary[500] }}
      />
    );
  };

  const renderChatEmpty = () => {
    if (areMessagesLoading) {
      return (
        <View className="h-full w-full items-center justify-center">
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View
        style={{ transform: [{ scaleY: -1 }] }}
        className="h-full w-full items-center justify-center"
      >
        <Text className="font-general-sans-medium text-lg text-neutral-700">
          No messages yet!
        </Text>
        <Text className="font-general-sans-regular text-md text-neutral-600">
          Send a message to start chatting.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full bg-neutral-50">
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
            <Ionicons name="chevron-back" size={27} color={"black"} />
          </Pressable>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "other-user-account",
                params: { id: recipientId },
              })
            }
          >
            <Text className="font-general-sans-medium text-primary-500 pl-2 text-3xl">
              {sellerName}
            </Text>
          </Pressable>

          <Ionicons name="chevron-back" size={27} color={"transparent"} />
        </View>
      </View>
      {/* <View className="h-20 bg-transparent"/> */}
      <GiftedChat
        messages={iMessages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userId as string }}
        onPressAvatar={() =>
          router.push({
            pathname: "other-user-account",
            params: { id: recipientId },
          })
        }
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        placeholder={"Type a message"}
        renderChatEmpty={renderChatEmpty}
        renderSend={renderSend}
        renderMessageImage={renderMessageImage}
        messagesContainerStyle={{
          backgroundColor: COLORS.neutral[50],
          paddingTop: 70,
          paddingBottom: 42,
        }}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
