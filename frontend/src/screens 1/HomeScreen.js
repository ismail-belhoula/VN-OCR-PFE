import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useAuthentication } from "../../utils/hooks/useAuthentication";
import { getAuth, signOut } from "firebase/auth";
import { ImageBackground } from "react-native";

const auth = getAuth();

export default function Welcome({ navigation }) {
  const { user } = useAuthentication();
  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.formContainer}>
        <Text style={styles.subtitle}>
          Welcome {user?.email} to our Mobile Application !
        </Text>
        <View style={styles.photoButtonContainer}>
          <TouchableOpacity
            style={styles.confirmButton2}
            onPress={() => signOut(auth)}
          >
            <Text style={styles.confirmButtonText}>Sign Out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton2}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.confirmButtonText}>Use OCR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    paddingBottom: 40,
    paddingTop: 40,
    marginTop: 40,
    borderWidth: 3,
    borderColor: "#0099FF",
    fontWeight: "bold",
    fontSize: 17,
    color: "#0099FF",
    backgroundColor: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    textAlign: "center",
  },
  formContainer: {
    marginTop: 150,
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "#0099FF",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginVertical: 8,
    width: "97%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  photoButtonContainer: {
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",

    paddingVertical: 30,
    marginTop: 0,
  },
  container: {
    flex: 1,

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
    marginTop: 10,
    marginBottom: 10,
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: "10",
    alignSelf: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
  },
});
