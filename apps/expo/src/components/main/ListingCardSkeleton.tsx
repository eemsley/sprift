import React from "react";
import { ActivityIndicator, View } from "react-native";
import ContentLoader from "react-native-easy-content-loader";

// Fills the parent view fully, pass in one listing as prop
const ListingCardSkeleton: React.FC = () => {
  return (
    <View className="h-full w-full items-center justify-center rounded-3xl">
      <View className="absolute left-2 top-1 h-12 w-full flex-row items-center justify-center">
        {/* @ts-expect-error Server Component */}
        <ContentLoader
          active
          tHeight={0}
          tWidth={0}
          pRows={1}
          pHeight={25}
          pWidth={"100%"}
          paragraphStyles={{ borderRadius: 7 }}
          containerStyles={{ width: "30%" }}
        />
        {/* @ts-expect-error Server Component */}
        <ContentLoader
          active
          tHeight={0}
          tWidth={0}
          pRows={1}
          pHeight={25}
          pWidth={"100%"}
          paragraphStyles={{ borderRadius: 7 }}
          containerStyles={{ width: "30%" }}
        />
        {/* @ts-expect-error Server Component */}
        <ContentLoader
          active
          tHeight={0}
          tWidth={0}
          pRows={1}
          pHeight={25}
          pWidth={"100%"}
          paragraphStyles={{ borderRadius: 7 }}
          containerStyles={{
            width: "15%",
            marginLeft: 55,
          }}
        />
      </View>

      <View className="absolute bottom-2 right-4 h-12 w-full flex-row justify-end">
        {/* @ts-expect-error Server Component */}
        <ContentLoader
          avatar
          avatarStyles={{ width: "100%", aspectRatio: 1 }}
          tHeight={0}
          tWidth={0}
          pRows={0}
          paragraphStyles={{ borderRadius: 7 }}
          containerStyles={{ width: "15%" }}
        />
      </View>
      <ActivityIndicator />
    </View>
  );
};

export default ListingCardSkeleton;
