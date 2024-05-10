// CameraScreen.js
import React, { useState, useRef } from "react";
import { View, Button, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function CameraScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const extractedTextRef = useRef(""); // Use a ref instead of a state

  const selectImageFromCamera = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
      let uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
      let uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No URI provided");
      return;
    }

    setLoading(true);

    let responseFetch = await fetch(uri);
    let blob = await responseFetch.blob();

    let formData = new FormData();
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    formData.append("image", {
      uri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
      data: blob,
    });

    let responsePost = await fetch("http://192.168.137.1:8080/extract_text", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    let json = await responsePost.json();
    console.log(json);

    setLoading(false);
    extractedTextRef.current = json.extracted_text; // Set the ref
    navigation.navigate("Text", { extractedText: json.extracted_text });
  };

  useFocusEffect(
    React.useCallback(() => {
      setImage(null);
      setLoading(false);
      extractedTextRef.current = "";
    }, [])
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Take Photo" onPress={selectImageFromCamera} />
      <Button
        title="Select Image from Gallery"
        onPress={selectImageFromGallery}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}
