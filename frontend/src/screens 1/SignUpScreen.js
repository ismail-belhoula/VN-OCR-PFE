import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Button } from "react-native-elements";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
    <View
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, marginTop: 40 }}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>
          Create a free account with your email.
        </Text>
        <View style={styles.formContainer}>
          <Input
            placeholder="Email"
            containerStyle={{ marginTop: 8, width: "auto" }}
            value={email}
            onChangeText={(text) => setEmail(text)}
            leftIcon={<Icon name="envelope" size={16} />}
          />

          <Input
            placeholder="Password"
            containerStyle={{ marginTop: 8, width: "auto" }}
            value={password}
            onChangeText={(value) => validateAndSet(value, setPassword)}
            secureTextEntry
            leftIcon={<Icon name="key" size={16} />}
          />

          <Input
            placeholder="Confirm Password"
            containerStyle={{ marginTop: 8, width: "auto" }}
            value={confirmPassword}
            onChangeText={(value) => validateAndSet(value, setConfirmPassword)}
            secureTextEntry
            leftIcon={<Icon name="key" size={16} />}
            onBlur={() => checkPassword(password, confirmPassword)}
          />
        </View>
        {validationMessage ? (
          <Text style={styles.error}>{validationMessage}</Text>
        ) : null}
        <Button title="Sign up" onPress={createAccount} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
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
  error: {
    marginTop: 10,
    color: "red",
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

export default SignUpScreen;
