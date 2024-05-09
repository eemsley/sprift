import { TouchableWithoutFeedback, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { COLORS } from "~/utils/theme";

interface SocialButtonProps {
  iconName: "apple1" | "google";
  onPress: () => void | Promise<void>;
  disabled?: boolean;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  iconName,
  onPress,
  disabled,
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <TouchableWithoutFeedback onPress={onPress} disabled={disabled || false}>
      <View className="h-14 w-full items-center justify-center rounded-xl bg-neutral-300">
        <AntDesign name={iconName} size={26} color={COLORS.neutral[600]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SocialButton;
