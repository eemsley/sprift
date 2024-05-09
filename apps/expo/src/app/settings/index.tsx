import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Switch,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "@clerk/clerk-expo";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";

import { COLORS } from "~/utils/theme";
import useAPI from "~/hooks/useAPI";

const SettingsScreen = () => {
  const { signOut, userId } = useAuth();
  const { getProfileById, enableNotifications } = useAPI();

  const router = useRouter();

  const {
    data: profile,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile by id"],
    queryFn: () => getProfileById(userId as string),
  });
  const { mutate: updateNotifPrefs, isLoading: isUpdatingNotifs } = useMutation(
    {
      mutationKey: ["/api/profile/update/bio"],
      mutationFn: ({ notifsEnabled }: { notifsEnabled: boolean }) =>
        enableNotifications(userId as string, notifsEnabled),
      onSuccess: (res) => {
        console.log(res);
        void refetchProfile();
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  const updateNotifs = () => {
    if (!isProfileLoading && profile) {
      setLocalNotifsEnabled(!localNotifsEnabled);
      updateNotifPrefs({ notifsEnabled: !profile.notificationsEnabled });
    }
  };
  const [localNotifsEnabled, setLocalNotifsEnabled] = useState(false);
  useEffect(() => {
    if (!isProfileLoading && profile) {
      setLocalNotifsEnabled(profile.notificationsEnabled);
    }
  }, [isProfileLoading, profile]);

  const logout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {
          return;
        },
      },
      {
        text: "Logout",
        onPress: () => {
          void onLogout();
        },
      },
    ]);
  };

  const onLogout = async () => {
    try {
      await signOut();
      router.replace("/welcome");
    } catch (err: unknown) {
      console.log(err);
    }
  };

  const openTOSDoc = async () => {
    await WebBrowser.openBrowserAsync("https://thesprift.com/tos.pdf");
  };

  return (
    <SafeAreaView className="flex h-full w-full bg-neutral-50">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      {/* <View className="bg-primary-500 absolute top-0 z-50 h-28 w-full flex-row items-center justify-between rounded-b-3xl px-4 pt-12">
        <Pressable
          style={{ width: 28 }}
          onPress={() => {
            router.replace("/account");
          }}
        >
          <Ionicons name="chevron-back" color={"white"} size={28} />
        </Pressable>
        <Text className="font-general-sans-medium text-3xl text-white">
          Settings
        </Text>
        <Ionicons name="chevron-back" color={"transparent"} size={28} />
      </View>
      <View className="h-16 w-full bg-neutral-50" /> */}
      <View className="z-50 w-full rounded-full px-5 pt-4">
        <View className="w-full flex-row items-center justify-between">
          <Pressable onPress={() => router.replace("/account")}>
            <Ionicons
              name="chevron-back-outline"
              color={COLORS.neutral[600]}
              size={24}
            />
          </Pressable>
          <Text className="font-satoshi-bold text-primary-500 text-3xl font-bold">
            Settings
          </Text>
          <Ionicons name="chevron-back-outline" color="transparent" size={24} />
        </View>
      </View>
      <ScrollView className="bg-neutral-50 px-3 py-4">
        <Text className="font-general-sans-medium px-3 py-1 text-lg text-neutral-700">
          Seller Settings
        </Text>
        <View className="mb-4 rounded-2xl bg-white pl-3 shadow-lg shadow-neutral-300">
          <Pressable
            onPress={() => {
              router.push("/sales");
            }}
            className="w-full flex-row items-center justify-evenly p-4"
          >
            <FontAwesome name="dollar" size={19} color={"black"} />
            <Text className="font-general-sans-medium w-full  pl-5 text-left text-sm text-neutral-600">
              My Sales
            </Text>
          </Pressable>

          {/* <Pressable
            onPress={() => {
              console.log("boost");
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-300 p-4"
          >
            <FontAwesome name="bolt" size={20} color={"gray"} />
            <Text className="font-general-sans-medium pl-5 text-sm text-neutral-500/50">
              Boost My Listings
            </Text>
            <Text className="font-general-sans-medium text-primary-500  pl-24 pr-8 text-left text-sm">
              Coming Soon!
            </Text>
          </Pressable> */}
          {/* <Pressable
            onPress={() => {
              router.push("settings/archived");
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-300 p-4"
          >
            <Feather name="archive" size={18} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Archived Listings
            </Text>
          </Pressable> */}
        </View>
        <Text className="font-general-sans-medium px-3 py-1 text-lg text-neutral-700">
          Shopper Settings
        </Text>
        <View className="mb-4 rounded-2xl bg-white px-3 shadow-xl shadow-neutral-300">
          <Pressable
            onPress={() => {
              router.push("/purchases");
            }}
            className="w-full flex-row items-center justify-evenly p-4"
          >
            <Ionicons name="receipt-outline" size={19} color={"black"} />
            <Text className="font-general-sans-medium w-full pl-5 text-left text-sm text-neutral-600">
              My Purchases
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert("Retake Style Quiz?", "", [
                {
                  text: "Cancel",
                  onPress: () => {
                    return;
                  },
                },
                {
                  text: "Let's Go!",
                  onPress: () => {
                    router.push("/style-quiz");
                  },
                },
              ]);
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <Ionicons name="shirt-outline" size={20} color="black" />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Style Preferences
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Alert.alert("Retake Tutorial?", "", [
                {
                  text: "Cancel",
                  onPress: () => {
                    return;
                  },
                },
                {
                  text: "Let's Go!",
                  onPress: () => {
                    router.push("settings/onboarding");
                  },
                },
              ]);
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <Ionicons name="play-circle-outline" size={20} color="black" />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Tutorial
            </Text>
          </Pressable>
        </View>

        <Text className="font-general-sans-medium px-3 py-1 text-lg text-neutral-700">
          Account Settings
        </Text>
        <View className="mb-4 rounded-2xl bg-white px-3 shadow-xl shadow-neutral-300">
          <Pressable className="w-full flex-row items-center justify-between py-2 pl-2 pr-2">
            <View className="flex-row">
              <Entypo name="bell" size={20} color={"black"} />
              <Text className="font-general-sans-medium pl-3 text-left text-sm text-neutral-600">
                Enable Notifications
              </Text>
            </View>
            <Switch
              value={localNotifsEnabled}
              onChange={updateNotifs}
              disabled={isUpdatingNotifs || isProfileLoading}
              thumbColor={
                localNotifsEnabled ? COLORS.neutral[200] : COLORS.primary[500]
              }
              ios_backgroundColor={
                localNotifsEnabled ? COLORS.primary[500] : COLORS.neutral[200]
              }
              // trackColor={localNotifsEnabled ? COLORS.primary[500] : COLORS.neutral[200]}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("settings/photo");
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <FontAwesome name="user-circle-o" size={20} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Change Profile Photo
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.push("settings/username");
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <AntDesign name="user" size={20} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Change Username
            </Text>
          </Pressable>
          {/* <Pressable
            onPress={() => {
              return;
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <AntDesign name="lock" size={20} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Change Password
            </Text>
          </Pressable> */}

          <Pressable
            onPress={() => {
              router.push("settings/bio");
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <Entypo name="text" size={20} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Change Bio
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              router.push("settings/shipping");
            }}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <Feather name="package" size={19} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Shipping Settings
            </Text>
          </Pressable>
          <Pressable
            onPress={() => void openTOSDoc()}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <AntDesign name="filetext1" size={17} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Terms and Conditions
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("settings/help")}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <AntDesign name="questioncircleo" size={17} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Help and Support
            </Text>
          </Pressable>
          <Pressable
            onPress={logout}
            className="w-full flex-row items-center justify-evenly border-t border-neutral-200 p-4"
          >
            <AntDesign name="logout" size={17} color={"black"} />
            <Text className="font-general-sans-medium w-full   pl-5 text-left text-sm text-neutral-600">
              Logout
            </Text>
          </Pressable>
        </View>

        <View className="h-16 w-full" />
      </ScrollView>
    </SafeAreaView>
  );
};
export default SettingsScreen;
