import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Enter your credentials to sign in.</Text>
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
        <Button title="Sign in" onPress={login} />
      </View>
      <View style={styles.formSection}>
        <Text>
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
      <Button
        title="skip to OCR"
        buttonStyle={{ marginTop: 200 }}
        onPress={() => navigation.navigate("Combined")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 40,
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
    fontSize: 14,
    color: "#666",
  },
  formContainer: {
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginVertical: 8,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSection: {
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
});

export default SignInScreen;
