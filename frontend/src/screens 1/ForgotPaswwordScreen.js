import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Input, Button } from "react-native-elements";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Email address cannot be empty.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccess(true);
      setErrorMessage("");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMessage("Invalid email address. Please enter a valid email.");
          break;
        case "auth/invalid-credential":
          setErrorMessage("Invalid Password. Please enter a valid Password.");
          break;
        case "auth/user-not-found":
          setErrorMessage("User not found. Please check your email.");
          break;
        default:
          setErrorMessage("An error occurred. Please try again later.");
          break;
      }
      setResetSuccess(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address below to receive a password reset link.
      </Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        containerStyle={styles.inputContainer}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {resetSuccess ? (
        <Text style={styles.success}>
          Password reset email sent successfully!
        </Text>
      ) : null}

      <TouchableOpacity style={styles.buttons} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttons}
        onPress={() => navigation.navigate("Sign In")}
      >
        <Text style={styles.buttonText}>Sign In Here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  success: {
    color: "green",
    marginBottom: 10,
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
  buttonText: {
    color: "#fff",
  },
});

export default ForgotPasswordScreen;
