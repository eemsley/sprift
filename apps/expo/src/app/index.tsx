import React from "react";
import { ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-expo";

import MainScreen from "./main";
import WelcomeScreen from "./welcome";

const SpreeApp = () => {
  return (
    <ClerkLoaded>
      <SignedIn>
        <MainScreen />
      </SignedIn>
      <SignedOut>
        <WelcomeScreen />
      </SignedOut>
    </ClerkLoaded>
  );
};

export default SpreeApp;
