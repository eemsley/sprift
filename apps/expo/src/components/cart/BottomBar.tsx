import React from "react";
import { Text, View } from "react-native";

import { COLORS } from "~/utils/theme";
import AppButton from "~/components/shared/AppButton";

interface BottomBarProps {
  subtotal: number;
  isCreatingPaymentIntent: boolean;
  setAddressSheetVisible: (isVisible: boolean) => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  subtotal,
  isCreatingPaymentIntent,
  setAddressSheetVisible,
}) => {
  return (
    <View className="w-full rounded-lg border-t-[1px] border-neutral-300 bg-neutral-50 p-5">
      <View className="mb-5 space-y-4">
        <View className="flex-row">
          <View>
            <Text className="text-accent-900 font-general-sans-medium text-lg">
              Subtotal
            </Text>
          </View>
          <View className="ml-auto">
            <Text className="text-accent-900 font-general-sans-medium ml-auto text-lg">
              ${subtotal?.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <View className="mb-5">
        <AppButton
          disabled={isCreatingPaymentIntent}
          onPress={() => {
            setAddressSheetVisible(true);
          }}
          title="Checkout"
          rounded
          backgroundColor={COLORS.primary[500]}
          textColor={COLORS.neutral[50]}
        />
      </View>
    </View>
  );
};

export default BottomBar;
