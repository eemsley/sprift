import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { listings } from "~/utils/mockData";
import ListingSquare from "~/components/account/ListingSquare";

const ArchivedScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="h-full w-full bg-white">
      <View className="bg-primary-500 absolute top-0 z-50 h-28 w-full flex-row items-center justify-between rounded-b-3xl px-4 pt-12">
        <Pressable
          style={{ width: 28 }}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="chevron-back" color={"white"} size={28} />
        </Pressable>
        <Text className="font-general-sans-medium text-3xl text-white">
          Archive
        </Text>
        <Ionicons name="chevron-back" color={"transparent"} size={28} />
      </View>
      <ScrollView className="h-full w-full pt-20">
        <View className="flex-row flex-wrap px-4">
          {listings.map((item) => (
            <ListingSquare
              accessedFrom="archive"
              listing={item}
              listingSquareKey={item.id}
              key={item.id}
            />
          ))}
        </View>
        <View className="p-11" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArchivedScreen;
