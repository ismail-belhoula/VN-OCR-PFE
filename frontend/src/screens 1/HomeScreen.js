import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { Button } from "react-native-elements";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export default function HomeScreen({ navigation }) {
  const { user } = useAuthentication();
  return (
    <View style={styles.container}>
      <Text>Welcome {user?.email} !</Text>
      <View style={styles.photoButtonContainer}>
        <TouchableOpacity
          style={styles.confirmButton2}
          onPress={() => signOut(auth)}
        >
          <Text style={styles.confirmButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton2}
          onPress={() => navigation.navigate("Combined")}
        >
          <Text style={styles.confirmButtonText}>Use OCR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  photoButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",

    paddingVertical: 30,
    marginTop: 0,
  },
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
  confirmButton2: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 10, // Border radiuse
    backgroundColor: "#25aae1",
    padding: 15,
    borderRadius: 50,
    marginTop: "auto",
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 10,
    width: 150,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
  },
  confirmButtonText: {
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: "10",
    alignSelf: "center",
  },
});
