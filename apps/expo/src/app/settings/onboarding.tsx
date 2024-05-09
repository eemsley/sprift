import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Circle, G, Svg } from "react-native-svg";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "~/utils/theme";

const SettingsScreen = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const carouselData = [
    {
      image: "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/likedislike.gif",
      title: "Swipe right to like, left to dislike.",
      description:
        "Our algorithm will learn your style preferences the more you swipe!",
    },
    {
      image: "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/cart.gif",
      title: "Swipe down to add to your cart.",
      description: "Click the cart to checkout!",
    },
    {
      image: "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/saved.gif",
      title: "Swipe up to save a listing for later!",
      description: "Click the thumb icon to view saved items.",
    },
    {
      image: "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/revert.gif",
      title: "Click the back arrow to revert a swipe!",
      description: "View the previous listing again if you swiped too quick.",
    },
    {
      image: "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/chat.gif",
      title: "Message sellers with questions!",
      description: "Click the message bubble icon to view all open chats.",
    },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const slidesRef = useRef<any>(null);

  //CIRCLE STUFF
  const size = 80;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = ((currentIndex + 1) * 100) / carouselData.length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progressAnimation = useRef<any>(new Animated.Value(0)).current;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progressRef = useRef<any>(null);
  const animation = (toValue: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    animation(percentage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    progressAnimation.addListener((value: { value: number }) => {
      const strokeDashoffset =
        circumference - (circumference * value.value) / 100;

      if (progressRef?.current) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage]);

  const scrollTo = () => {
    if (currentIndex < carouselData.length - 1) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      slidesRef?.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("main");
    }
  };

  const viewableItemsChanged = useRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ viewableItems }: { viewableItems: any }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setCurrentIndex(viewableItems[0].index);
    },
  ).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const CarouselItem: React.FC<{
    currentItem: { image: string; description?: string; title?: string };
  }> = ({ currentItem }) => {
    return (
      <View className="h-full  pt-4" style={{ width }}>
        <View className=" h-[10%] w-full items-center justify-center  ">
          <Text className="font-general-sans-medium text-secondary-600 w-[90%] text-center text-lg">
            {currentItem.title}
          </Text>
          <Text className="font-general-sans-medium text-secondary-600 w-[90%] text-center text-sm">
            {currentItem.description}
          </Text>
        </View>
        <View className=" h-[85%] w-full items-center  justify-center pt-6">
          {/* <Text className="font-satoshi-medium text-primary-500 absolute top-2 z-50 text-lg">
            {currentItem.description}
          </Text> */}
          <Image
            source={{ uri: currentItem.image }}
            style={{
              width: width * 0.68,
              height: "100%",
              borderColor: COLORS.primary[500],
              borderWidth: 4,
              borderRadius: 15,
            }}
            alt="image"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className=" flex h-full w-full bg-white">
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackVisible: false,
          headerShown: false,
        }}
      />
      <FlatList
        data={carouselData}
        renderItem={({ item }) => <CarouselItem currentItem={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slidesRef}
        removeClippedSubviews={true}
      />
      <View className="w-full items-center justify-center pt-4">
        <View className="items-center justify-center rounded-full">
          <Svg width={size} height={size}>
            <G rotation="-90" origin={center}>
              <Circle
                stroke={COLORS.neutral[200]}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                ref={progressRef}
                stroke={COLORS.primary[300]}
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
              />
            </G>
          </Svg>
          <TouchableOpacity
            onPress={scrollTo}
            className="bg-primary-500 absolute h-10 w-10 items-center justify-center rounded-full"
          >
            <Ionicons name="arrow-forward-sharp" color={"white"} size={16} />
          </TouchableOpacity>
        </View>
        {/* <View className="h-[5%] flex-row items-center justify-center space-x-2">
          {carouselData.map((_, index) => {
            return (
              <View
                className={`${
                  index == currentIndex
                    ? "bg-secondary-500"
                    : "bg-secondary-200/30"
                } h-2 w-2 rounded-full`}
                key={index}
              />
            );
          })}
        </View> */}
      </View>
    </SafeAreaView>
  );
};
export default SettingsScreen;
