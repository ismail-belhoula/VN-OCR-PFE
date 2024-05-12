import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { Button } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export default function HomeScreen({ navigation }) {
  const { user } = useAuthentication();
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email}!</Text>
      <TouchableOpacity style={styles.buttons} onPress={() => signOut(auth)}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation.navigate("Combined")}
      >
        <Text>Use OCR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    width: 160,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    margin: 20,
    height: 55,
    textAlign: "center",
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#25aae1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4184ea",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.75,
    shadowRadius: 15,
    elevation: 8,
  },
  bn632HoverText: {
    color: "#fff",
  },
});
