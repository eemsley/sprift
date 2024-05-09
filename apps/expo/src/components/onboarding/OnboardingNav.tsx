import { TouchableWithoutFeedback, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { COLORS } from "~/utils/theme";
import OnboardingProgress from "./OnboardingProgress";

interface OnboardingNavProps {
  progress?: number;
  onBack: () => void;
  backHidden?: boolean;
}

const OnboardingNav: React.FC<OnboardingNavProps> = ({
  progress,
  onBack,
  backHidden = false,
}) => {
  return (
    <View className="h-12 flex-row">
      <View className="h-12 flex-1 justify-center">
        {!backHidden && (
          <TouchableWithoutFeedback onPress={onBack}>
            <AntDesign name="arrowleft" size={20} color={COLORS.primary[400]} />
          </TouchableWithoutFeedback>
        )}
      </View>
      {progress && (
        <View className="h-14 flex-1 items-center justify-center">
          <OnboardingProgress progress={progress} onBack={onBack} />
        </View>
      )}
      <View className="flex-1" />
    </View>
  );
};

export default OnboardingNav;
