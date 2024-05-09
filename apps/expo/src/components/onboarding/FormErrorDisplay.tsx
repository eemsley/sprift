import { Text, View } from "react-native";

interface FormErrorDisplayProps {
  hasError: boolean;
  errorMessage: string | undefined;
}

const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  hasError,
  errorMessage,
}) => {
  return (
    <View className="my-1">
      {hasError && (
        <Text className="font-general-sans-medium mx-3 text-sm text-red-500">
          ⓘ {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default FormErrorDisplay;
