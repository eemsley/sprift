import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface CartItemProps {
  id: string;
  sellerName: string;
  description: string;
  price: number;
  uri: string;
  onRemoveFromCart: (id: string) => void;
  onSaveForLater: (id: string) => void;
}
const CartItem: React.FC<CartItemProps> = ({
  id,
  sellerName,
  description,
  price,
  uri,
  onRemoveFromCart,
  onSaveForLater,
}) => {
  return (
    <View className="mb-4 min-h-28">
      <View className="h-full flex-row items-center rounded-lg bg-[#e9ebec] py-1">
        <View className="w-[26%] items-center pt-1">
          <Image
            alt="item"
            source={{ uri: uri }}
            className="aspect-square h-[70%] rounded-lg"
          />
        </View>

        <View className="h-full w-[74%] p-1">
          <Text className="text-gray-800 font-general-sans-medium w-40">
            {sellerName}
          </Text>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            className="font-general-sans-regular text-neutral-500"
          >
            {description}
          </Text>
          <Text className="text-gray-800 text-md font-general-sans-semibold mt-2">
            ${price.toFixed(2)}
          </Text>
          <View className="mx-5 mt-2 flex-row justify-between">
            <Pressable onPress={() => onRemoveFromCart(id)}>
              <Text className="text-secondary-800 font-general-sans-semibold">
                Remove
              </Text>
            </Pressable>
            <Pressable onPress={() => onSaveForLater(id)}>
              <Text className="text-secondary-800 font-general-sans-semibold">
                Save for later
              </Text>
            </Pressable>
          </View>
        </View>
        <View className="h-full w-[26%] items-center justify-center pt-1">
          <Image
            alt="item"
            source={{ uri: uri }}
            className="aspect-square h-[70%] rounded-lg"
          />
          <Text className="text-accent-800 text-md font-general-sans-semibold text-center">
            ${price}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
