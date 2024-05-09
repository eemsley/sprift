import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

const BioScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [complete, setComplete] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [codeError, setCodeError] = useState(false);
  useEffect(() => {
    if (password.length < 8 && password.length > 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [email, password]);

  const { isLoaded, signIn, setActive } = useSignIn();

  if (!isLoaded) {
    return null;
  }

  async function create() {
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setEmailError(false);
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error("error", err.errors[0].longMessage);
        setEmailError(true);
      });
  }

  async function reset() {
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
        } else if (result.status === "complete") {
          void setActive({ session: result.createdSessionId });
          setComplete(true);
          setCodeError(false);
        } else {
          console.log(result);
          setCodeError(true);
        }
      })
      .catch((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        console.error("error", err.errors[0].longMessage);
        setCodeError(true);
      });
  }

  return (
    <SafeAreaView className=" flex h-full w-full ">
      <View className="bg-primary-500 absolute top-0 z-50 h-24 w-full flex-row items-center justify-center rounded-b-3xl pt-12">
        {!complete && (
          <Pressable
            className="absolute left-4 top-14"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
        )}
        <Text className="font-general-sans-medium  text-xl text-white">
          Recover Password
        </Text>
      </View>
      <Stack.Screen
        options={{
          animation: "slide_from_right",
          headerBackVisible: false,
          headerShown: false,
        }}
      />

      <View className="h-full w-full items-center  pt-24">
        {successfulCreation && !complete && (
          <View className="h-full w-[95%] space-y-8">
            <Text className="font-general-sans-medium text-center text-neutral-500">
              A code has been sent to your email, enter this code and your new
              password to reset it!
            </Text>
            <View className="h-12 w-full flex-row items-center rounded-xl border border-neutral-400 px-4">
              <TextInput
                placeholder="New Password"
                className="h-full w-3/4 "
                value={password}
                secureTextEntry={!passwordVisible}
                onChange={(text) => setPassword(text.nativeEvent.text)}
              />
              <Pressable
                onPress={() => setPasswordVisible(!passwordVisible)}
                className=" absolute right-4 items-center justify-center"
              >
                <Ionicons
                  name={passwordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="black"
                />
              </Pressable>
            </View>
            <TextInput
              placeholder="Reset Password Code"
              className="h-12 w-full rounded-xl border border-neutral-400 px-4"
              value={code}
              keyboardType="numeric"
              onChange={(text) => {
                setCode(text.nativeEvent.text);
                setCodeError(false);
              }}
            />
            <Pressable
              onPress={() => {
                if (!successfulCreation) void create();
                else void reset();
              }}
              className="bg-primary-400 h-12 w-full items-center justify-center rounded-xl"
              disabled={passwordError || codeError || password.length == 0}
            >
              <Text className="font-general-sans-medium text-white">
                Reset!
              </Text>
            </Pressable>
            {passwordError && (
              <Text className="font-general-sans-medium text-red-400">
                Password must be at least 8 characters!
              </Text>
            )}
            {codeError && (
              <Text className="font-general-sans-medium text-red-400">
                Incorrect code!
              </Text>
            )}
          </View>
        )}
        {!successfulCreation && !complete && (
          <View className="h-full w-[95%] space-y-8">
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChange={(text) => {
                setEmail(text.nativeEvent.text);
                setEmailError(false);
              }}
              className="h-12 w-full rounded-xl border border-neutral-400 px-4"
            />

            <Pressable
              onPress={() => {
                if (!successfulCreation) void create();
                else reset;
              }}
              className="bg-primary-400 h-12 w-full items-center justify-center rounded-xl"
              disabled={emailError || email.length == 0}
            >
              <Text className="font-general-sans-medium text-white">
                Verify
              </Text>
            </Pressable>
            {emailError && (
              <Text className="font-general-sans-medium text-red-400">
                Email not found
              </Text>
            )}
          </View>
        )}
        <Text className="font-general-sans-medium pb-10 text-neutral-500">
          {complete && "Password changed successfully!"}
          {secondFactor && "Unexpected Error Occured"}
        </Text>
        {complete && (
          <Pressable
            onPress={() => router.replace("main")}
            className="bg-primary-500 h-12 w-[95%] items-center justify-center rounded-xl"
          >
            <Text className="font-general-sans-medium text-white">
              Enter Sprift!
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};
export default BioScreen;
