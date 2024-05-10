import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "../../../config/firebase.js";
import AuthStack from "../../navigation/authStack.js";
import {
  CameraScreen,
  ProfileScreen,
  CombinedScreen,
} from "../../screens 1/screens.js"; // Import from screens.js
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="AuthStack">
        <Drawer.Screen name="Camera" component={CameraScreen} />
        <Drawer.Screen name="Combined" component={CombinedScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
