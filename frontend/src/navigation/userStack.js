import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens 1/HomeScreen";
const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
