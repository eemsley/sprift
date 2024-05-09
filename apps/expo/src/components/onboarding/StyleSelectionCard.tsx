import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface StyleSelection {
  name: string;
  tagName: string;
  imageSrc: string;
  selected: boolean;
}

const StyleSelectionCard: React.FC<StyleSelection> = ({
  name,
  imageSrc,
  selected,
}) => {
  return (
    <View className="items-end">
      {selected && (
        <View
          className="items-center justify-center rounded-lg bg-green-500 p-1"
          style={{
            marginTop: -20,
            top: 30,
            right: 10,
            zIndex: 10,
            width: 20,
            height: 20,
          }}
        >
          <AntDesign size={14} name="check" color="white" />
        </View>
      )}

      <View className="h-40 w-full">
        <ImageBackground
          source={{ uri: imageSrc }}
          resizeMode="cover"
          imageStyle={{ borderRadius: 20, flex: 1 }}
        >
          <View className="h-full flex-row justify-center">
            <View className="mb-2 self-end rounded-lg bg-black p-2">
              <Text className="font-satoshi-medium text-white">{name}</Text>
            </View>
          </View>
        </ImageBackground>
        <View
          className="absolute bottom-0 left-0 right-0 top-0 bg-white"
          style={{ borderRadius: 20, opacity: selected ? 0.3 : 0 }}
        />
      </View>
    </View>
  );
};

export default StyleSelectionCard;
