/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useSignUp } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

import { COLORS } from "~/utils/theme";
import {
  registerFormSchema,
  type RegisterFormSchemaType,
} from "~/utils/validators";
import AuthInput from "~/components/onboarding/AuthInput";
import FormErrorDisplay from "~/components/onboarding/FormErrorDisplay";
import OnboardingNav from "~/components/onboarding/OnboardingNav";
import SecureAuthInput from "~/components/onboarding/SecureAuthInput";
// import SocialButton from "~/components/onboarding/SocialButton";
import AppButton from "~/components/shared/AppButton";
import Container from "~/components/shared/Container";

// For Google/Apple oauth
WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = () => {
  const router = useRouter();
  const [registerFormError, setRegisterFormError] = useState("");
  const [agreed, setAgreed] = useState(false);

  const {
    control,
    handleSubmit,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const openTOSDoc = async () => {
    await WebBrowser.openBrowserAsync("https://thesprift.com/tos.pdf");
  };

  const checkAgreed = () => {
    if (!agreed) {
      Alert.alert(
        "Whoops!",
        "Please agree to the Terms and Conditions to continue.",
      );
      return false;
    }
    return true;
  };

  // const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
  //   strategy: "oauth_google",
  // });
  // const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
  //   strategy: "oauth_apple",
  // });

  const { isLoaded, signUp, setSession } = useSignUp();

  // const registerWithGoogle = useCallback(async () => {
  //   try {
  //     const { createdSessionId, setActive } = await startGoogleOAuthFlow({});

  //     if (createdSessionId) {
  //       await setActive?.({ session: createdSessionId });
  //       // TODO: Create user record on successful sign in
  //       router.replace("/style-quiz");
  //     }
  //   } catch (err) {
  //     console.error("OAuth error", err);
  //   }
  // }, []);

  // const registerWithApple = useCallback(async () => {
  //   try {
  //     const { createdSessionId, setActive } = await startAppleOAuthFlow({});

  //     if (createdSessionId) {
  //       await setActive?.({ session: createdSessionId });
  //       // TODO: Create user record on successful sign in
  //       router.replace("/style-quiz");
  //     }
  //   } catch (err) {
  //     console.error("OAuth error", err);
  //   }
  // }, []);

  const onRegister: SubmitHandler<RegisterFormSchemaType> = async (data) => {
    if (!isLoaded || !checkAgreed()) {
      return;
    }

    // Clear previous errors
    clearErrors();
    setRegisterFormError("");

    try {
      const completeSignUp = await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await setSession(completeSignUp.createdSessionId);
      // TODO: Create user record on successful sign in
      router.replace("/create-username");
    } catch (err: any) {
      console.log(JSON.stringify(err));

      resetField("password");
      resetField("confirmPassword");

      if (err.errors[0].code === "form_password_pwned") {
        setRegisterFormError(
          "Password is not strong enough, please use a stronger password.",
        );
      } else {
        setRegisterFormError(err.errors[0].message as string);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="flex-1 bg-neutral-50">
          <Stack.Screen
            options={{
              animation: "fade",
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Container>
            <OnboardingNav progress={1 / 4} onBack={() => router.back()} />

            <View className="mt-5 h-full">
              <View className="space-y-2">
                <Text className="font-satoshi-bold text-accent-900 text-2xl">
                  Welcome
                </Text>
                <Text className="font-general-sans-medium text-sm text-neutral-600">
                  Create an account to start shopping on Sprift.
                </Text>
              </View>

              {/* Form */}
              <View className="my-10 space-y-1">
                <View className="my-1">
                  <Controller
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <AuthInput
                        placeholder="Email"
                        onBlur={onBlur}
                        onTextChange={onChange}
                        errorExists={!!errors.email || !!registerFormError}
                        value={value}
                      />
                    )}
                    name="email"
                  />
                  <FormErrorDisplay
                    hasError={!!errors.email}
                    errorMessage={errors.email?.message}
                  />
                </View>

                <View className="my-1">
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SecureAuthInput
                        placeholder="Password"
                        onBlur={onBlur}
                        onTextChange={onChange}
                        value={value}
                        errorExists={!!errors.password || !!registerFormError}
                      />
                    )}
                    name="password"
                  />
                  <FormErrorDisplay
                    hasError={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                </View>

                <View className="space-y-1">
                  <Controller
                    control={control}
                    rules={{
                      maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SecureAuthInput
                        placeholder="Confirm Password"
                        onBlur={onBlur}
                        onTextChange={onChange}
                        value={value}
                        errorExists={
                          !!errors.confirmPassword || !!registerFormError
                        }
                      />
                    )}
                    name="confirmPassword"
                  />
                  <FormErrorDisplay
                    hasError={!!errors.confirmPassword}
                    errorMessage={errors.confirmPassword?.message}
                  />
                </View>

                {/*  Display Clerk Errors */}
                <FormErrorDisplay
                  hasError={
                    !!registerFormError &&
                    !errors.email &&
                    !errors.password &&
                    !errors.confirmPassword
                  }
                  errorMessage={registerFormError}
                />
              </View>

              {/* <View>
                <View className="align-center top-2 flex-row">
                  <View className="w-full border-t border-gray-300" />
                </View>
                <View className="relative flex-row justify-center">
                  <Text className="font-general-sans-medium bg-neutral-50 px-3 text-neutral-500">
                    Or continue with
                  </Text>
                </View>
              </View>

              <View className="my-5">
                {Platform.OS === "ios" ? (
                  <View className="flex-row">
                    <View className="w-1/2 items-center">
                      <View className="w-[95%]">
                        <SocialButton
                          onPress={() => {
                            if (!checkAgreed()) return;
                            void registerWithApple();
                          }}
                          iconName="apple1"
                        />
                      </View>
                    </View>
                    <View className="w-1/2 items-center">
                      <View className="w-[95%]">
                        <SocialButton
                          onPress={() => {
                            if (!checkAgreed()) return;
                            void registerWithGoogle();
                          }}
                          iconName="google"
                        />
                      </View>
                    </View>
                  </View>
                ) : (
                  // Show only log in with google on android
                  <View className="flex flex-row">
                    <View className="w-full">
                      <SocialButton
                        onPress={() => {
                          if (!checkAgreed()) return;
                          void registerWithGoogle();
                        }}
                        iconName="google"
                      />
                    </View>
                  </View>
                )}
              </View> */}

              <View className="mx-8 mb-4 mt-2 flex-row items-center justify-center">
                <View className="flex h-full">
                  <BouncyCheckbox
                    size={25}
                    fillColor={COLORS.accent[500]}
                    unfillColor="#FFFFFF"
                    iconStyle={{
                      borderColor: COLORS.primary[900],
                      borderRadius: 5,
                    }}
                    innerIconStyle={{ borderWidth: 2, borderRadius: 5 }}
                    textStyle={{}}
                    onPress={(isChecked: boolean) => setAgreed(isChecked)}
                  />
                </View>
                <TouchableWithoutFeedback onPress={() => void openTOSDoc()}>
                  <View className="mx-2 mb-5 bg-neutral-50">
                    <Text className="font-sm font-general-sans-semibold text-neutral-600">
                      By registering, you accept our{" "}
                      <Text className="font-sm font-general-sans-semibold text-primary-400">
                        Terms & Conditions{" "}
                      </Text>
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <AppButton
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onPress={handleSubmit(onRegister)}
                title="Create Account"
                backgroundColor={COLORS.primary[500]}
                highlightedColor={COLORS.primary[600]}
                textColor="white"
              />
            </View>
          </Container>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
