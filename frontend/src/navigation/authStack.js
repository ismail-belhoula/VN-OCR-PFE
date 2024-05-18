import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../screens 1/SignInScreen";
import SignUpScreen from "../screens 1/SignUpScreen";
import ForgotPasswordScreen from "../screens 1/ForgotPaswwordScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Sign In"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Sign Up" component={SignUpScreen} />
      <Stack.Screen name="Forgot Password" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
