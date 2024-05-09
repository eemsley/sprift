import { View } from "react-native";

interface ContainerProps {
  children: React.ReactNode;
  variant?: "small" | "regular" | "large";
}

const Container: React.FC<ContainerProps> = ({
  children,
  variant = "regular",
}) => {
  const marginSizes = { small: "mx-5", regular: "mx-8", large: "mx-12" };

  return <View className={`${marginSizes[variant]}`}>{children}</View>;
};

export default Container;
