import React from "react";
import { Text, View } from "react-native";

interface KeywordSelection {
  keyword: string;
  selected: boolean;
}

const Keyword: React.FC<KeywordSelection> = ({ keyword, selected }) => {
  return (
    <View
      className={
        selected
          ? "bg-secondary-800 m-2 h-auto w-auto items-center justify-center rounded-full border border-blue-300 px-4 py-2"
          : "bg-secondary-400 m-2 h-auto w-auto items-center justify-center rounded-full border border-blue-200 px-4 py-2"
      }
    >
      <Text
        style={{ fontSize: 16 }}
        className={
          selected
            ? "font-satoshi-medium text-white"
            : "font-satoshi-medium text-slate-100"
        }
      >
        {keyword}
      </Text>
    </View>
  );
};

export default Keyword;
