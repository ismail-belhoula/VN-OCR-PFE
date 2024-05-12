import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const CustomHeader = ({ isDarkMode, toggleTheme }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleTheme}>
        <Text>{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: "#f0f0f0", // Change the background color as needed
  },
});

export default CustomHeader;
