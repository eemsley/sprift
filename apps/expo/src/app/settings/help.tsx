import { Pressable, SafeAreaView, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const HelpScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-primary-500 flex h-full w-full">
      <Stack.Screen options={{ animation: "slide_from_right" }} />
      <View className="h-16 flex-row items-center justify-center rounded-b-2xl">
        <Pressable onPress={() => router.back()} className="absolute left-4">
          <Ionicons name="chevron-back" size={24} color={"white"} />
        </Pressable>
        <Text className="font-satoshi-bold text-3xl text-white">Help</Text>
      </View>
      <View className="h-full w-full items-center bg-neutral-200 pt-8">
        <Text className="text-primary-800 font-satoshi-medium text-center text-lg">
          For support, please contact us at: support@thesprift.com
        </Text>
        <Text className="text-primary-800 font-satoshi-medium px-4 pt-10 text-center text-lg">
          If you are using TestFlight and you encounter a bug, please take a
          screenshot of the app wherever it fails, then select &quot;done&quot;,
          then &quot;share beta feedback&quot;. We appreciate your feedback!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default HelpScreen;
