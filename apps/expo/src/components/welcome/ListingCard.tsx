import { Image, View } from "react-native";

import Dislike from "../shared/icons/Dislike";
import Like from "../shared/icons/Like";

const ListingCard: React.FC = () => {
  return (
    <View className="align-center h-80 w-72 justify-center rounded-3xl bg-neutral-100 shadow-xl">
      <Image
        className="mt-2 self-center"
        alt="mens jacket"
        source={require("../../../assets/mens-jacket.png")}
      />
      <View className="absolute bottom-5 w-full flex-row justify-between px-7">
        <View className="aspect-square h-12 items-center justify-center rounded-full border-2 border-[#FF8181] opacity-50">
          <View className="pt-1">
            <Dislike />
          </View>
        </View>
        <View className="aspect-square h-12 items-center justify-center rounded-full border-2 border-[#99D6AE] opacity-50">
          <View className="">
            <Like />
          </View>
        </View>
      </View>
    </View>
  );
};

export default ListingCard;
