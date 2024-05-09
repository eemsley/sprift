import React from "react";
import { View } from "react-native";
import ContentLoader from "react-native-easy-content-loader";

// Fills the parent view fully, pass in one listing as prop
const NotificationsSkeleton: React.FC = () => {
  return (
    <View className="h-full w-[90%] items-center justify-start rounded-3xl pt-24">
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={60}
        pWidth={"100%"}
      />
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={40}
        pWidth={"100%"}
      />
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={50}
        pWidth={"100%"}
      />
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={60}
        pWidth={"100%"}
      />
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={90}
        pWidth={"100%"}
      />
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={30}
        pWidth={"100%"}
      />
      {/* @ts-expect-error Server Component */}
      <ContentLoader
        active
        pRows={1}
        tHeight={0}
        pHeight={50}
        pWidth={"100%"}
      />
    </View>
  );
};

export default NotificationsSkeleton;
