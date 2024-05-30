import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./MainScreen";
import ScanBarcodeScreen from "./ScanBarcodeScreen";
import ConfirmationScreen from "./ConfirmationScreen";

const Stack = createStackNavigator();

export default function CombinedScreen1() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="ScanBarcodeScreen"
        component={ScanBarcodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
