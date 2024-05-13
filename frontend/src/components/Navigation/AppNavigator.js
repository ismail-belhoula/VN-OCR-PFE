import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "../../../config/firebase.js";
import { ProfileScreen, CombinedScreen } from "../../screens 1/screens.js"; // Import from screens.js
import RootNavigation from "../../navigation/index.js";
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Account">
        <Drawer.Screen name="Combined" component={CombinedScreen} />
        <Drawer.Screen
          name="Account"
          component={RootNavigation}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
