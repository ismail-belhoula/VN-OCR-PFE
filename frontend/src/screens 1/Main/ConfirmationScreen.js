import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

function ConfirmationScreen({ navigation, route }) {
  const { extractedText } = route.params;
  const [text, setText] = useState(extractedText);

  const handleEditText = () => {
    navigation.navigate("Main", { editedText: text });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmation Screen</Text>
      <Text style={styles.subtitle}>Edit Extracted Text:</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={10}
        onChangeText={setText}
        value={text}
      />
      <Button title="Confirm Edit" onPress={handleEditText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 200,
    padding: 10,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: "top",
  },
});

export default ConfirmationScreen;
