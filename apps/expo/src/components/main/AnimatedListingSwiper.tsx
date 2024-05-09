import { type RefObject } from "react";
import { Text, View } from "react-native";
import Swiper from "react-native-deck-swiper";

import { type ListingType } from "~/utils/mockData";
import ListingCard from "./ListingCard";

interface AnimatedListingSwiperProps {
  swiperRef: RefObject<Swiper<ListingType>>;
  listings: ListingType[];
  currentIndex: number;
  onSwipedAll: () => void;
  onSwipedBottom: (index: number, listings: ListingType[]) => void;
  onSwipedLeft: (index: number, listings: ListingType[]) => void;
  onSwipedRight: (index: number, listings: ListingType[]) => void;
  onSwipedTop: (index: number, listings: ListingType[]) => void;
  onSwiping: (x: number, y: number) => void;
  onSwipeAborted: () => void;
  onSwiped: () => void;
}

const AnimatedListingSwiper: React.FC<AnimatedListingSwiperProps> = ({
  swiperRef,
  listings,
  currentIndex,
  onSwipedAll,
  onSwipedBottom,
  onSwipedLeft,
  onSwipedRight,
  onSwipedTop,
  onSwiping,
  onSwipeAborted,
  onSwiped,
}) => {
  return (
    <Swiper
      ref={swiperRef}
      cards={listings}
      cardIndex={currentIndex}
      renderCard={(listing) => <ListingCard listing={listing} />}
      cardStyle={{height: "152%"}}
      backgroundColor="transparent"
      onSwipedTop={(index: number) => onSwipedTop(index, listings)}
      onSwipedAll={onSwipedAll}
      onSwipedBottom={(index: number) => onSwipedBottom(index, listings)}
      onSwipedLeft={(index: number) => onSwipedLeft(index, listings)}
      onSwipedRight={(index: number) => onSwipedRight(index, listings)}
      onSwiping={onSwiping}
      onSwipedAborted={onSwipeAborted}
      animateOverlayLabelsOpacity
      showSecondCard
      swipeBackCard
      stackSize={10}
      onSwiped={onSwiped}
      stackSeparation={0}
      stackAnimationFriction={200}
      stackAnimationTension={600}
      outputRotationRange={["-12deg", "0deg", "12deg"]}
      onTapCardDeadZone={200}
      cardHorizontalMargin={5}
      cardVerticalMargin={5}
      overlayLabels={{
        left: {
          element: (
            <View className="absolute right-7 h-[65%] w-1/2 items-center justify-center rounded-3xl bg-red-600/50">
              <Text className="font-general-sans-medium text-3xl text-white">
                Dislike
              </Text>
              <Text className="font-general-sans-base text-m px-3 pt-12 text-center text-white">
                Dislikes tell our algorithm to show you less listings like this.
              </Text>
            </View>
          ),
          title: "DISLIKE",
          style: {
            label: {
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              borderWidth: 1,
            },
            wrapper: {
              flexDirection: "row",
            },
          },
        },
        right: {
          element: (
            <View className="absolute left-0 h-[65%] w-1/2 items-center justify-center rounded-3xl bg-green-600/50">
              <Text className="font-general-sans-medium text-3xl text-white">
                Like
              </Text>
              <Text className="font-general-sans-base text-m px-3 pt-10 text-center text-white">
                Likes tell our algorithm to show you more listings like this!
              </Text>
            </View>
          ),
          title: "LIKE",
          style: {
            label: {
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              borderWidth: 1,
            },
            wrapper: {
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            },
          },
        },
        bottom: {
          element: (
            <View className="absolute left-0 top-0 h-[30%] w-[93%] items-center justify-center rounded-3xl bg-secondary-400/50">
              <Text className="font-general-sans-medium text-3xl text-white">
                Add to Cart
              </Text>
              <Text className="font-general-sans-base text-m px-3 pt-12 text-center text-white">
                Get it before someone else does!
              </Text>
            </View>
          ),
          title: "CART",
          style: {
            label: {
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              borderWidth: 1,
            },
            wrapper: {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            },
          },
        },
        top: {
          element: (
            <View className="absolute top-[35%] left-0 h-[30%] w-[93%] items-center justify-center rounded-3xl bg-primary-300/50">
              <Text className="font-general-sans-medium text-3xl text-white">
                Save For Later
              </Text>
              <Text className="font-general-sans-base text-m px-3 pt-12 w-[70%] text-center text-white">
                On the fence? Save the item and come back to it later!
              </Text>
            </View>
          ),
          title: "SAVED",
          style: {
            label: {
              backgroundColor: "black",
              borderColor: "black",
              color: "white",
              borderWidth: 1,
            },
            wrapper: {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            },
          },
        },
      }}
    />
  );
};

export default AnimatedListingSwiper;
