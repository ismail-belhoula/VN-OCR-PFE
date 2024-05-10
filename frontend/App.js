import "./config/firebase";
import React from "react";
import RootNavigation from "./src/navigation";
import AppNavigator from "./src/components/Navigation/AppNavigator";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export default function App() {
  return <AppNavigator />;
}
