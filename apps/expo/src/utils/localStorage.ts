import * as SecureStore from "expo-secure-store";

export const getRememberMeEmail = async (): Promise<string | null> => {
  try {
    const username = await SecureStore.getItemAsync("remember-me-email");
    if (username !== null) {
      return username;
    }
  } catch (error) {
    console.log("Error when getting remember me email.");
  }
  return null;
};

export const setRememberMeEmail = async (email: string) => {
  try {
    await SecureStore.setItemAsync("remember-me-email", email);
  } catch (error) {
    console.log("Error when setting remember me email.");
  }
};
