import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "~/utils/theme";

interface SecureAuthInputProps {
  onTextChange: () => void;
  onBlur: () => void;
  value: string;
  placeholder: string;
  placeholderTextColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  errorExists: boolean;
}

const SecureAuthInput: React.FC<SecureAuthInputProps> = ({
  onTextChange,
  onBlur,
  value,
  placeholder,
  placeholderTextColor = COLORS.neutral[500],
  textColor = "#1a1b2a",
  backgroundColor = "white",
  errorExists,
}) => {
  const [isSecure, setIsSecure] = useState(true);
  return (
    <View
      className={`${
        errorExists ? "border-red-500" : "border-neutral-300"
      }  bg-${backgroundColor} flex-row items-center justify-between rounded-xl border pr-4`}
    >
      <TextInput
        value={value}
        onChangeText={onTextChange}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={isSecure}
        className={`h-12 rounded-xl text-${textColor}  w-[90%] px-5`}
      />
      <Pressable onPress={() => setIsSecure(!isSecure)}>
        <Ionicons name={isSecure ? "eye-off" : "eye"} size={20} color="black" />
      </Pressable>
    </View>
  );
};

export default SecureAuthInput;
