import { View } from "react-native";

import { COLORS } from "~/utils/theme";

interface OnboardingProgressProps {
  progress: number;
  color?: string;
  onBack: () => void;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  progress,
  color = COLORS.primary[400],
}) => {
  return (
    <View>
      <View className="h-1 w-44 rounded-lg bg-[#D9D9D9]" />
      <View
        style={{ width: 180 * progress, backgroundColor: color }}
        className={`-top-1 h-1 rounded-lg`}
      />
    </View>
  );
};

export default OnboardingProgress;
