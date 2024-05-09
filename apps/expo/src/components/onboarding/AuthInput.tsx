import { TextInput, View } from "react-native";

import { COLORS } from "~/utils/theme";

interface AuthInputProps {
  onTextChange: () => void;
  onBlur: () => void;
  isSecure?: boolean;
  value: string;
  placeholder: string;
  placeholderTextColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  errorExists: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  onTextChange,
  onBlur,
  isSecure = false,
  value,
  placeholder,
  placeholderTextColor = COLORS.neutral[500],
  textColor = "#1a1b2a",
  backgroundColor = "white",
  errorExists,
}) => {
  return (
    <View className="space-y-2">
      <TextInput
        value={value}
        onChangeText={onTextChange}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={isSecure}
        className={`h-12 ${
          errorExists ? "border-red-500" : "border-neutral-300"
        } bg-${backgroundColor} rounded-xl text-${textColor} border px-5`}
      />
    </View>
  );
};

export default AuthInput;
