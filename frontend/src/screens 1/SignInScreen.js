import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ImageBackground } from "react-native";

const auth = getAuth();

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  async function login() {
    if (email === "" || password === "") {
      setValidationMessage("Email and password are required.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setValidationMessage(error.message);
      console.error(error); // Log the error
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/background2.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.skipbutton}
          onPress={() => navigation.navigate("Combined")}
        >
          <Text style={styles.confirmButtonText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              containerStyle={{ marginTop: 10, width: 300 }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              leftIcon={<Icon name="envelope" size={16} />}
            />

            <Input
              placeholder="Password"
              containerStyle={{ marginTop: 10, width: 300 }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={true}
              leftIcon={<Icon name="key" size={16} />}
            />
            {<Text style={styles.error}>{validationMessage}</Text>}
          </View>
          <View style={styles.formSection}>
            <Text style={{ paddingBottom: 10 }}>
              Don't have an account yet?{" "}
              <Text
                style={styles.formSectionLink}
                onPress={() => navigation.navigate("Sign Up")}
              >
                Sign Up Here
              </Text>
            </Text>
            <Text>
              Forgot Your Password?{" "}
              <Text
                style={styles.formSectionLink}
                onPress={() => navigation.navigate("Forgot Password")}
              >
                Reset it Here
              </Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.buttons} onPress={login}>
            <Text style={styles.confirmButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  form: {
    position: "relative",
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 20,
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
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginVertical: 8,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSection: {
    borderRadius: 8,
    padding: 16,
    fontSize: 12,
    backgroundColor: "#e0ecfb",
    shadowColor: "#000",
    justifyContent: "center",
    alignContent: "center",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  formSectionLink: {
    fontWeight: "bold",
    color: "#0066ff",
  },
  buttons: {
    alignSelf: "center",
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 50, // Border radius
    width: 200,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    margin: 20,
    height: 55,
    textAlign: "center",
    backgroundColor: "#FFF",
    overflow: "hidden",
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
  skipbutton: {
    margin: 5,
    marginBottom: 100,
    alignSelf: "flex-end",
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 50, // Border radius
    width: 100,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 1,
    height: 55,
    textAlign: "center",
    backgroundColor: "#FFF",
    overflow: "hidden",
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
  confirmButtonText: {
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: "10",
    alignSelf: "center",
  },
});

export default SignInScreen;
