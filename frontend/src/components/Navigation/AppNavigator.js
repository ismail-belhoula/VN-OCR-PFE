import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import "../../../config/firebase.js";
import CombinedScreen from "../../screens 1/CombinedScreen.js";
import RootNavigation from "../../navigation/index.js";
const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Account">
        <Drawer.Screen name="Home" component={CombinedScreen} />
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
