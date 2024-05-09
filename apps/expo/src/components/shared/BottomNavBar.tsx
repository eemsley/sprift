import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import useAPI from "~/hooks/useAPI";

interface NavBarPage {
  currPage: string;
}

const BottomNavBar: React.FC<NavBarPage> = ({ currPage }) => {
  const { userId } = useAuth();
  const { getListingsInCart } = useAPI();
  const { data: cart } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: () => getListingsInCart(userId as string),
  });
  const [cartCount, setCartCount] = useState(cart?.length || 0);
  useEffect(() => {
    if (cart !== undefined) {
      setCartCount(cart?.length);
    }
  }, [cart]);
  const router = useRouter();
  return (
    <View className="absolute bottom-0 h-28 w-full">
      <Image
        alt="nav"
        source={require("../../../assets/navbar.png")}
        className="absolute top-3 h-full w-full "
      />
      <View className="h-full w-full flex-row items-center justify-between px-4 pt-4">
        <Pressable
          onPress={() => router.replace("/main")}
          className={
            currPage == "/main"
              ? "h-12 w-12 items-center justify-center rounded-full pb-1"
              : "h-12 w-12 items-center justify-center rounded-full pb-1"
          }
        >
          <Feather
            name={"home"}
            size={27}
            color={
              currPage === "/main" || currPage === "/" ? "black" : "lightgray"
            }
            className="font-size-100"
          />
        </Pressable>
        <Pressable
          onPress={() => router.replace("/explore")}
          className={
            currPage == "/explore"
              ? "h-12 w-12 items-center justify-center rounded-full pb-1 "
              : "h-12 w-12 items-center justify-center rounded-full pb-1"
          }
        >
          <Feather
            name={"search"}
            size={27}
            color={currPage === "/explore" ? "black" : "lightgray"}
          />
        </Pressable>
        <Pressable
          onPress={() => router.push("/cart")}
          className={
            currPage == "/main" || currPage == "/"
              ? "mb-12 h-16 w-16 items-center justify-center rounded-3xl "
              : "bg-primary-400 shadow-primary-100 mb-[52px] h-16 w-16 items-center justify-center rounded-3xl shadow-md"
          }
        >
          <MaterialCommunityIcons
            name={"cart"}
            size={35}
            color={
              currPage == "/main" || currPage == "/" ? "transparent" : "white"
            }
          />
          {currPage == "/main" || currPage == "/" ? (
            <View className="absolute" />
          ) : (
            <View
              className={
                cartCount === 0
                  ? "absolute"
                  : "absolute right-3 top-2 h-4 w-4 items-center justify-center rounded-full bg-gray-100/80"
              }
            >
              <Text className="font-general-sans-medium text-xs text-gray-500">
                {cartCount === 0 ? "" : cartCount}
              </Text>
            </View>
          )}
        </Pressable>
        <Pressable
          onPress={() => router.replace("/liked")}
          className={
            currPage == "/liked"
              ? "h-12 w-12 items-center justify-center rounded-full pb-1"
              : "h-12 w-12 items-center justify-center rounded-full pb-1"
          }
        >
          <Feather
            name={"thumbs-up"}
            size={27}
            color={currPage === "/liked" ? "black" : "lightgray"}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            router.replace("/account");
          }}
          className={
            currPage == "/account"
              ? "h-12 w-12 items-center justify-center rounded-full pb-1"
              : "h-12 w-12 items-center justify-center rounded-full pb-1"
          }
        >
          <Feather
            name={"user"}
            size={27}
            color={currPage === "/account" ? "black" : "lightgray"}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default BottomNavBar;
