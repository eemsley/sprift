import { View } from "react-native";
import ContentLoader from "react-native-easy-content-loader";

const ListingSkeleton: React.FC = ({}) => {
  return (
    <View className="h-full w-full flex-row items-center justify-center">
      <View className="h-full w-1/2">
        {/* @ts-expect-error Server Component */}
        <ContentLoader
          active
          tHeight={0}
          tWidth={0}
          pRows={5}
          pHeight={190}
          pWidth={"100%"}
          paragraphStyles={{ borderRadius: 15, marginBottom: 15 }}
        />
      </View>
      <View className="h-full w-1/2">
        {/* @ts-expect-error Server Component */}
        <ContentLoader
          active
          tHeight={0}
          tWidth={0}
          pRows={5}
          pHeight={190}
          pWidth={"100%"}
          paragraphStyles={{ borderRadius: 15, marginBottom: 15 }}
        />
      </View>
    </View>
  );
};

export default ListingSkeleton;
