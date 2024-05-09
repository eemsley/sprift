/* eslint-disable react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

import { IN_DEV } from "~/utils/constants";
import { getRememberMeEmail, setRememberMeEmail } from "~/utils/localStorage";
import { COLORS } from "~/utils/theme";
import { loginFormSchema, type LoginFormSchemaType } from "~/utils/validators";
import AuthInput from "~/components/onboarding/AuthInput";
import FormErrorDisplay from "~/components/onboarding/FormErrorDisplay";
import OnboardingNav from "~/components/onboarding/OnboardingNav";
import SecureAuthInput from "~/components/onboarding/SecureAuthInput";
import SocialButton from "~/components/onboarding/SocialButton";
import AppButton from "~/components/shared/AppButton";
import Container from "../components/shared/Container";

// For Google/Apple oauth
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();
  const [loginFormError, setLoginFormError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [OAuthFlowStarted, setOAuthFlowStarted] = useState(false);
  // const [hidePassword, setHidePassword] = useState(true);

  const {
    control,
    handleSubmit,
    resetField,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const { isLoaded, signIn, setSession } = useSignIn();

  const loginWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow({});

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });

        setOAuthFlowStarted(false);
        // TODO: Create user record on successful sign in
        router.replace("/main");
      }

      setOAuthFlowStarted(false);
    } catch (err) {
      console.log(JSON.stringify(err));
      console.error("OAuth error", err);
      setOAuthFlowStarted(false);
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOAuthFlow({});

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        // TODOL Create user record on successful sign in
        setOAuthFlowStarted(false);
        router.replace("/main");
      }
      setOAuthFlowStarted(false);
    } catch (err) {
      console.error("OAuth error", err);
      setOAuthFlowStarted(false);
    }
  }, []);

  const onLogin: SubmitHandler<LoginFormSchemaType> = async (data) => {
    if (!isLoaded) {
      return;
    }

    // Clear previous errors
    clearErrors();
    setLoginFormError("");

    try {
      const completeSignIn = await signIn.create({
        identifier: data.email,
        password: data.password,
      });
      await setSession(completeSignIn.createdSessionId);

      if (rememberMe) {
        await setRememberMeEmail(data.email);
      }

      router.replace("/main");
    } catch (err: any) {
      resetField("password");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setLoginFormError(err.errors[0].message);
    }
  };

  useEffect(() => {
    void getRememberMeEmail().then((email) => {
      if (email !== null) {
        setValue("email", email);
      }
    });
  });

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
            <OnboardingNav onBack={() => router.back()} />

            <View className="mt-5 h-full">
              <View className="space-y-2">
                <Text className="font-satoshi-bold text-accent-900 text-2xl">
                  Welcome Back
                </Text>
                <Text className="font-general-sans-medium text-sm text-neutral-600">
                  Login to continue using Sprift.
                </Text>
              </View>

              {/* Form */}
              <View className="mt-10 space-y-1">
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
                        errorExists={!!errors.email || !!loginFormError}
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
                      <>
                        <SecureAuthInput
                          placeholder="Password"
                          onBlur={onBlur}
                          onTextChange={onChange}
                          value={value}
                          errorExists={!!errors.password || !!loginFormError}
                        />
                      </>
                    )}
                    name="password"
                  />
                  <FormErrorDisplay
                    hasError={!!errors.password}
                    errorMessage={errors.password?.message}
                  />
                </View>

                {/*  Display Clerk Errors */}
                <FormErrorDisplay
                  hasError={
                    !!loginFormError && !errors.email && !errors.password
                  }
                  errorMessage={loginFormError}
                />
              </View>

              <View className="mb-12 flex-row items-center">
                <View className="flex h-full">
                  <BouncyCheckbox
                    size={25}
                    fillColor="#168aad"
                    unfillColor="#FFFFFF"
                    iconStyle={{
                      borderColor: "#168aad",
                    }}
                    innerIconStyle={{ borderWidth: 2 }}
                    textStyle={{}}
                    onPress={(isChecked: boolean) => setRememberMe(isChecked)}
                  />
                </View>
                <View className="bg-neutral-50">
                  <Text className="font-sm font-general-sans-medium text-neutral-600">
                    Remember me
                  </Text>
                </View>
              </View>

              {IN_DEV && (
                <View>
                  <View>
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
                                setOAuthFlowStarted(true);
                                void loginWithApple();
                              }}
                              iconName="apple1"
                              disabled={OAuthFlowStarted}
                            />
                          </View>
                        </View>
                        <View className="w-1/2 items-center">
                          <View className="w-[95%]">
                            <SocialButton
                              onPress={() => {
                                setOAuthFlowStarted(true);
                                void loginWithGoogle();
                              }}
                              iconName="google"
                              disabled={OAuthFlowStarted}
                            />
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View className="flex flex-row">
                        <View className="w-full">
                          <SocialButton
                            onPress={() => {
                              setOAuthFlowStarted(true);
                              void loginWithGoogle();
                            }}
                            iconName="google"
                            disabled={OAuthFlowStarted}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}

              <View className="mt-6">
                {/* Login button */}
                <AppButton
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onPress={handleSubmit(onLogin)}
                  title="Login"
                  backgroundColor={COLORS.primary[500]}
                  highlightedColor={COLORS.primary[600]}
                  textColor="white"
                />
              </View>
              <Pressable onPress={() => router.push("settings/forgot")}>
                <Text className="font-general-sans-medium text-accent-400 w-full pt-16 text-center text-sm">
                  Forgot password?
                </Text>
              </Pressable>
            </View>
          </Container>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
