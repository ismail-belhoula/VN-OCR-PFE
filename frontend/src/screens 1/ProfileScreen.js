import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import React, { useState } from "react";
import { Input } from "react-native-elements";

const ProfileScreen = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  const handleUpdateProfile = () => {
    console.log({ name, email });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.profileText}>Name: {name}</Text>
        <Text style={styles.profileText}>Email: {email}</Text>
        <Input
          leftIcon={{ type: "feather", name: "user" }}
          placeholder="New Name"
          onChangeText={(text) => setName(text)}
        />
        <Input
          leftIcon={{ type: "font-awesome", name: "envelope-o" }}
          placeholder="New Email"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Update Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Aligns items at the top and bottom
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
  },
  content: {
    borderWidth: 5,
    borderColor: "rgba(54, 54, 54, 0.6)",
    flex: 1, // Take up all available space
    justifyContent: "flex-start", // Align content at the top
    alignItems: "stretch", // Center content horizontally
    padding: 10,
    width: "100%", // Occupy full width
  },
  profileText: {
    borderWidth: 1,
    borderColor: "rgba(54, 54, 54, 0.6)",
    padding: 10,
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#141414",
    borderWidth: 1,
    borderColor: "rgba(54, 54, 54, 0.6)",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
});
