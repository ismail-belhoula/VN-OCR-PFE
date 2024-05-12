import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "../../../config/firebase.js";
import { ProfileScreen, CombinedScreen } from "../../screens 1/screens.js"; // Import from screens.js
import RootNavigation from "../../navigation/index.js";
import ForgotPasswordScreen from "../../screens 1/ForgotPaswwordScreen.js";
import CustomHeader from "../../screens 1/CustomHeader.js";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Account">
        <Drawer.Screen name="Combined" component={CombinedScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Account" options={{ headerShown: false }}>
          {(props) => (
            <RootNavigation
              {...props}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              header={(props) => (
                <CustomHeader
                  {...props}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              )}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
