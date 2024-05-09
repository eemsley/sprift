import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "@tanstack/react-query";

import { mockKeywords, mockStyleSelection } from "~/utils/mockData";
import { COLORS } from "~/utils/theme";
import Keyword from "~/components/onboarding/Keyword";
import OnboardingNav from "~/components/onboarding/OnboardingNav";
import StyleSelectionCard from "~/components/onboarding/StyleSelectionCard";
import AppButton from "~/components/shared/AppButton";
import Container from "~/components/shared/Container";
import useAPI from "~/hooks/useAPI";

enum StyleQuizCurrentScreen {
  STYLE_SELECTION_SCREEN = "STYLE_SELECTION_SCREEN",
  KEYWORD_SELECTION_SCREEN = "KEYWORD_SELECTION_SCREEN",
}

const StyleQuiz = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const { addUserStyleTags: addUserStyleTagsCall } = useAPI();
  const [styles, setStyles] = useState<StyleSelection[]>(mockStyleSelection);
  const [keywords, setKeywords] = useState<KeywordSelection[]>(mockKeywords);
  const [currentScreen, setCurrentScreen] = useState<StyleQuizCurrentScreen>(
    StyleQuizCurrentScreen.STYLE_SELECTION_SCREEN,
  );

  // Call to remove listing from cart
  const { mutate: addUserStyleTags } = useMutation({
    mutationKey: ["/api/user/add-user-style-tags"],
    mutationFn: (tags: string[]) =>
      addUserStyleTagsCall(userId as string, tags),
    onSuccess: () => {
      router.replace("settings/onboarding");
    },
  });

  const selectStyle = (style: StyleSelection) => {
    const styleIndex = styles.findIndex((s) => s.tagName === style.tagName);
    if (styleIndex !== -1) {
      const updatedStyles: StyleSelection[] = [...styles];
      if (updatedStyles[styleIndex] !== undefined) {
        updatedStyles[styleIndex] = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...updatedStyles[styleIndex]!,
          selected: !updatedStyles[styleIndex]?.selected,
        };
      }
      setStyles(updatedStyles);
    }
  };

  const selectKeyword = (keyword: KeywordSelection) => {
    const keywordIndex = keywords.findIndex(
      (k) => k.keyword === keyword.keyword,
    );
    if (keywordIndex !== -1) {
      const updatedKeywords: KeywordSelection[] = [...keywords];
      if (updatedKeywords[keywordIndex] !== undefined) {
        updatedKeywords[keywordIndex] = {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...updatedKeywords[keywordIndex]!,
          selected: !updatedKeywords[keywordIndex]?.selected,
        };
      }
      setKeywords(updatedKeywords);
    }
  };

  const getSelectedStyles = (): string[] => {
    return styles.filter((style) => style.selected).map((style) => style.name);
  };

  const getSelectedKeywords = (): string[] => {
    return keywords
      .filter((keyword) => keyword.selected)
      .map((keyword) => keyword.keyword);
  };

  const onAddStyles = () => {
    console.log(getSelectedStyles());
    setCurrentScreen(StyleQuizCurrentScreen.KEYWORD_SELECTION_SCREEN);
  };

  const onAddKeywords = () => {
    if (getSelectedKeywords().length >= 3) {
      addUserStyleTags(getSelectedKeywords());
    } else {
      alert("Please select at least 3 keywords");
    }
  };

  interface StyleSelection {
    name: string;
    tagName: string;
    imageSrc: string;
    selected: boolean;
  }

  interface KeywordSelection {
    keyword: string;
    selected: boolean;
  }

  // Currently on style selection screen
  if (currentScreen === StyleQuizCurrentScreen.STYLE_SELECTION_SCREEN) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <Container>
          <Stack.Screen
            options={{
              animation: "fade",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <OnboardingNav
            backHidden
            progress={2 / 4}
            onBack={() =>
              setCurrentScreen(StyleQuizCurrentScreen.STYLE_SELECTION_SCREEN)
            }
          />
          <View className="mt-5 h-full">
            <View className="space-y-2">
              <Text className="font-satoshi-bold text-primary-500 text-2xl">
                Select the styles below you&apos;d be interested in shopping
                for.
              </Text>
              <Text className="font-general-sans-medium text-sm text-neutral-600">
                You will be able to select more styles later.
              </Text>
            </View>

            <View className="h-[60%]">
              <ScrollView
                contentContainerStyle={{
                  marginTop: 20,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                {styles.map((style: StyleSelection, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeIn.delay(800 + 100 * index)}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => selectStyle(style)}
                    >
                      <View className="w-40 p-1">
                        <StyleSelectionCard
                          selected={style.selected}
                          name={style.name}
                          imageSrc={style.imageSrc}
                          tagName={style.tagName}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </Animated.View>
                ))}
              </ScrollView>
            </View>
            <View>
              <AppButton
                onPress={onAddStyles}
                title={"Select Styles"}
                backgroundColor={COLORS.primary[500]}
                highlightedColor={COLORS.primary[600]}
                textColor="white"
              />
            </View>
          </View>
        </Container>
      </SafeAreaView>
    );
  }

  // Currently on keyword selection screen
  if (currentScreen === StyleQuizCurrentScreen.KEYWORD_SELECTION_SCREEN) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-50">
        <Container>
          <Stack.Screen
            options={{
              animation: "fade",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <OnboardingNav
            progress={3 / 4}
            onBack={() => {
              setCurrentScreen(StyleQuizCurrentScreen.STYLE_SELECTION_SCREEN);
            }}
          />
          <View className="mt-5 h-full">
            <View className="space-y-2">
              <Text className="font-satoshi-bold text-primary-500 text-2xl">
                Select the keywords below which best describe your style.
              </Text>
              <Text className="font-general-sans-medium text-sm text-neutral-600">
                You will be able to select more keywords later.
              </Text>
            </View>

            <View className="my-3 h-[60%]">
              <ScrollView>
                <View className="flex-row flex-wrap items-center justify-center">
                  {keywords.map((keyword: KeywordSelection, index) => (
                    <Animated.View key={index} entering={FadeIn.delay(200)}>
                      <Pressable onPress={() => selectKeyword(keyword)}>
                        <Keyword
                          keyword={keyword.keyword}
                          selected={keyword.selected}
                        />
                      </Pressable>
                    </Animated.View>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View>
              <AppButton
                onPress={onAddKeywords}
                title={"Select Keywords"}
                backgroundColor={COLORS.primary[500]}
                highlightedColor={COLORS.primary[600]}
                textColor="white"
              />
            </View>
          </View>
        </Container>
      </SafeAreaView>
    );
  }
};

export default StyleQuiz;
