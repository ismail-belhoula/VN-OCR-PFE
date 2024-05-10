import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignInScreen from "../screens 1/SignInScreen";
import SignUpScreen from "../screens 1/SignUpScreen";
import {
  CameraScreen,
  ProfileScreen,
  CombinedScreen,
} from "../screens 1/screens"; // Import from screens.js

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Sign In" component={SignInScreen} />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
