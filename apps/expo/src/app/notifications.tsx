import React, { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { ScrollView, Swipeable } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";

import NotificationsSkeleton from "~/components/main/NotificationsSkeleton";
import useAPI from "~/hooks/useAPI";

const NotificationsScreen = () => {
  const router = useRouter();
  const {
    getUserNotifications,
    deleteNotificationById,
    readUserNotifications,
  } = useAPI();
  const { userId } = useAuth();

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    refetch: refetchNotifs,
  } = useQuery({
    queryKey: ["user notifications"],
    queryFn: () => getUserNotifications(userId as string),
  });
  const { mutate: deleteNotif, isLoading: isDeletingNotif } = useMutation({
    mutationKey: ["/api/notifications/delete"],
    mutationFn: (notifcationId: string) =>
      deleteNotificationById(notifcationId),
    onSuccess: () => {
      void refetchNotifs();
    },
  });
  const { mutate: readNotifs } = useMutation({
    mutationKey: ["/api/notifications/update-read"],
    mutationFn: () => readUserNotifications(userId as string),
    onSuccess: () => {
      void refetchNotifs();
    },
  });
  const deleteNotification = (notificationId: string) => {
    deleteNotif(notificationId);
  };
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchNotifs();
    setRefreshing(false);
  };
  useEffect(() => {
    if (
      !isNotificationsLoading &&
      notifications &&
      //at least one notification is read
      notifications.some((notification) => notification.viewed == false)
    ) {
      void readNotifs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNotificationsLoading]);

  return (
    <SafeAreaView className="h-full w-full items-center">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackVisible: false,
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <View className="absolute top-0 z-40 w-full items-center rounded-b-3xl bg-neutral-50 px-4 pb-4 pt-16 shadow-xl">
        <View className="w-full flex-row items-center justify-between">
          <Pressable onPress={() => router.replace("main")}>
            <Ionicons name="chevron-back" size={27} color={"black"} />
          </Pressable>
          <Text className="font-general-sans-medium text-primary-500 pl-2 text-3xl">
            Notifications
          </Text>
          <Ionicons name="chevron-back" size={27} color={"transparent"} />
        </View>
      </View>

      {/* BODY  */}
      {notifications?.length == 0 && (
        <View className="h-full w-full items-center justify-center ">
          <Text className="font-general-sans-medium pb-12 text-neutral-500">
            Nothing here yet, check back later!
          </Text>
        </View>
      )}

      {isNotificationsLoading || !notifications || isDeletingNotif ? (
        <View className="h-full w-full items-center justify-center">
          <NotificationsSkeleton />
        </View>
      ) : (
        <ScrollView
          className={"mt-20 h-full w-full "}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => void onRefresh()}
            />
          }
        >
          <View className="h-full flex-row flex-wrap p-4">
            {notifications.map((notification, index) => {
              return (
                <Swipeable
                  containerStyle={{ width: "100%" }}
                  key={index}
                  renderRightActions={() => {
                    return (
                      <Pressable
                        onPress={() => {
                          void deleteNotification(notification.id);
                        }}
                        className="items-center justify-center px-2"
                      >
                        <Text className="text-red-500">Delete</Text>
                      </Pressable>
                    );
                  }}
                >
                  <View className="my-1 w-full flex-row items-center rounded-lg bg-white px-2 py-3 shadow-sm shadow-neutral-300">
                    {notification.notificationType == "PURCHASE" && (
                      <MaterialIcons
                        name="attach-money"
                        size={20}
                        color="black"
                      />
                    )}
                    {notification.notificationType == "FOLLOW" && (
                      <Feather name="user-plus" size={16} color={"black"} />
                    )}
                    {notification.notificationType == "SHIPPING" && (
                      <AntDesign name="message1" size={18} color="black" />
                    )}
                    {notification.notificationType == "CHAT" && (
                      <AntDesign name="message1" size={18} color="black" />
                    )}
                    <View className="h-full w-[80%] pl-2">
                      <Text className=" font-general-sans-medium mr-20 pl-2 text-left text-xs">
                        {notification.message}
                      </Text>
                    </View>
                    <Text className="font-general-sans-medium absolute right-6 text-xs">
                      {moment
                        .utc(notification.createdAt, "YYYY-MM-DD HH:mm:ss")
                        .local()
                        .startOf("seconds")
                        .fromNow()}
                    </Text>
                    <View
                      className={`absolute right-2 h-2 w-2 rounded-full ${
                        notification.viewed ? "bg-transparent" : "bg-red-500"
                      }`}
                    />
                  </View>
                </Swipeable>
              );
            })}
          </View>
          <View className={"h-24 w-full"} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NotificationsScreen;
