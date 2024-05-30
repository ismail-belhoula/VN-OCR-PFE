import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
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
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter your email address below to receive a password reset link.
        </Text>
        <View style={styles.form}>
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              placeholderTextColor={"#0099FF"}
              value={email}
              onChangeText={(text) => setEmail(text)}
              containerStyle={{ marginTop: 10, width: 350 }}
              leftIcon={<Icon name="envelope" color="#0099FF" size={16} />}
            />
            {errorMessage ? (
              <Text style={styles.error}>{errorMessage}</Text>
            ) : null}
            {resetSuccess ? (
              <Text style={styles.success}>
                Password reset email sent successfully!
              </Text>
            ) : null}
          </View>
        </View>
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    borderWidth: 3,
    borderColor: "#0099FF",
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    marginVertical: 8,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  form: {
    position: "relative",
    flexDirection: "column",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    paddingTop: 20,
    paddingBottom: 20,
    borderWidth: 3,
    borderColor: "#0099FF",
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
  subtitle: {
    paddingBottom: 40,
    paddingTop: 40,
    marginTop: 40,
    borderWidth: 3,
    borderColor: "#0099FF",
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
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginBottom: 30,
  },
  success: {
    color: "green",
    marginBottom: 30,
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
  buttonText: {
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: 10,
    alignSelf: "center",
  },
});

export default ForgotPasswordScreen;
