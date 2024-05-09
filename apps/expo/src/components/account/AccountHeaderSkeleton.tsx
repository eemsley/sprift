import { View } from "react-native";
import ContentLoader from "react-native-easy-content-loader";

const AccountHeaderSkeleton: React.FC = ({}) => {
  return (
    <View className="h-[36.5%] w-full flex-row flex-wrap items-center justify-center rounded-b-3xl bg-white pt-6">
      {/* @ts-expect-error Server Component */}

      <ContentLoader
        active
        pRows={3}
        pHeight={10}
        tHeight={0}
        pWidth={"100%"}
        paragraphStyles={{ borderRadius: 15, marginBottom: 5 }}
        containerStyles={{ width: "20%", marginRight: 30 }}
      />
      {/* @ts-expect-error Server Component */}

      <ContentLoader
        active
        tHeight={0}
        pRows={0}
        avatar
        avatarStyles={{ width: "100%", aspectRatio: 1, borderRadius: 100 }}
        containerStyles={{ width: "25%", paddingTop: 10 }}
      />
      {/* @ts-expect-error Server Component */}

      <ContentLoader
        active
        pRows={3}
        pHeight={10}
        tHeight={0}
        pWidth={"100%"}
        paragraphStyles={{ borderRadius: 15, marginBottom: 5 }}
        containerStyles={{ width: "20%", marginLeft: 30 }}
      />
      {/* @ts-expect-error Server Component */}

      <ContentLoader
        active
        pRows={4}
        pHeight={10}
        tHeight={0}
        pWidth={["88%", "100%", "84%", "92%"]}
        paragraphStyles={{ borderRadius: 15, marginBottom: 5 }}
        containerStyles={{
          width: "70%",
          marginTop: 70,
        }}
      />
    </View>
  );
};

export default AccountHeaderSkeleton;
