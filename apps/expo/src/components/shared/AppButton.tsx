import { Text, TouchableHighlight } from "react-native";

import { COLORS } from "~/utils/theme";

interface AppButtonProps {
  title: string;
  rounded?: boolean;
  onPress?: () => void;
  highlightedColor?: string;
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  rounded = true,
  onPress = () => {
    return;
  },
  highlightedColor = COLORS.neutral[400],
  backgroundColor = "neutral-300",
  textColor = COLORS.primary[600],
  disabled = false,
}) => {
  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={onPress}
      underlayColor={highlightedColor}
      style={{ backgroundColor, borderRadius: rounded ? 15 : 0 }}
      className={`align-center h-12 justify-center`}
    >
      <Text
        style={{ color: textColor }}
        className={`font-general-sans-semibold text-center`}
      >
        {title}
      </Text>
    </TouchableHighlight>
  );
};

export default AppButton;
