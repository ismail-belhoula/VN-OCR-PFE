import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ImageBackground } from "react-native";

const auth = getAuth();

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  let validateAndSet = (value, setValue) => {
    setValue(value);
  };

  function checkPassword(firstpassword, secondpassword) {
    if (firstpassword !== secondpassword) {
      setValidationMessage("Passwords do not match");
    } else setValidationMessage("");
  }

  async function createAccount() {
    if (email === "" || password === "" || confirmPassword === "") {
      setValidationMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setValidationMessage("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("Sign In");
    } catch (error) {
      setValidationMessage(error.message);
    }
  }

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.backgroundImage}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 40,
          marginTop: 40,
        }}
      >
        <View style={styles.form}>
          <View style={{ paddingBottom: 40 }}>
            <Text style={styles.subtitle}>
              Create an account with your email.
            </Text>
          </View>
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              placeholderTextColor={"#0099FF"}
              containerStyle={{ marginTop: 8, width: "auto" }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              leftIcon={<Icon name="envelope" color="#0099FF" size={16} />}
            />

            <Input
              placeholder="Password"
              placeholderTextColor={"#0099FF"}
              containerStyle={{ marginTop: 8, width: "auto" }}
              value={password}
              onChangeText={(value) => validateAndSet(value, setPassword)}
              secureTextEntry
              leftIcon={<Icon name="key" color="#0099FF" size={16} />}
            />

            <Input
              placeholder="Confirm Password"
              placeholderTextColor={"#0099FF"}
              containerStyle={{ marginTop: 8, width: "auto" }}
              value={confirmPassword}
              onChangeText={(value) =>
                validateAndSet(value, setConfirmPassword)
              }
              secureTextEntry
              leftIcon={<Icon name="key" color="#0099FF" size={16} />}
              onBlur={() => checkPassword(password, confirmPassword)}
            />
          </View>
          <View style={styles.formSection}>
            <Text>
              Have an account?{" "}
              <Text
                style={styles.formSectionLink}
                onPress={() => navigation.navigate("Sign In")}
              >
                Sign In Here
              </Text>
            </Text>
          </View>
          {validationMessage ? (
            <Text style={styles.error}>{validationMessage}</Text>
          ) : null}
          <TouchableOpacity style={styles.buttons} onPress={createAccount}>
            <Text style={styles.confirmButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
  },
  form: {
    marginBottom: 20,
    paddingTop: 40,
    position: "relative",
    flexDirection: "column",
    paddingVertical: 10,
    paddingHorizontal: 10,
    gap: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingBottom: 20,
    borderWidth: 3,
    borderColor: "#0099FF",
    borderRadius: 8,
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
    paddingTop: 20,
  },
  formContainer: {
    paddingBottom: 20,
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
  error: {
    marginTop: 10,
    color: "red",
  },
  formSection: {
    paddingTop: 100,
    borderWidth: 3,
    borderColor: "#0099FF",
    borderRadius: 8,
    padding: 16,
    paddingTop: 20,
    fontSize: 12,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
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
  confirmButtonText: {
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: 0,
    alignSelf: "center",
  },
});

export default SignUpScreen;
