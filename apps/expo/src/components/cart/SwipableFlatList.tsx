import React, { useCallback, type ReactNode } from "react";
import { FlatList, type FlatListProps } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { type SwipeableProps } from "react-native-gesture-handler/lib/typescript/components/Swipeable";

export interface SwipeableFlatListProps<T> extends FlatListProps<T> {
  renderLeftActions?: (item: T) => ReactNode;
  renderRightActions?: (item: T) => ReactNode;
  swipeableProps?: SwipeableProps;
}

const SwipeableFlatList = <T,>({
  data,
  keyExtractor,
  renderItem,
  renderLeftActions,
  renderRightActions,
  swipeableProps,
  ...rest
}: SwipeableFlatListProps<T>) => {
  const renderSwipeableItem = useCallback(
    ({ item, index }: { item: T; index: number }) => {
      const leftAction = renderLeftActions
        ? () => renderLeftActions(item)
        : undefined;
      const rightAction = renderRightActions
        ? () => renderRightActions(item)
        : undefined;

      const separators = {
        highlight: () => {
          return;
        },
        unhighlight: () => {
          return;
        },
        updateProps: () => {
          return;
        },
      };

      if (!renderItem) {
        return null;
      }

      return (
        <Swipeable
          {...swipeableProps}
          renderRightActions={rightAction}
          renderLeftActions={leftAction}
        >
          {renderItem({ item, index, separators })}
        </Swipeable>
      );
    },
    [renderItem, renderLeftActions, renderRightActions, swipeableProps],
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        {...rest}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderSwipeableItem}
      />
    </GestureHandlerRootView>
  );
};

export default SwipeableFlatList;
