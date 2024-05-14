import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Checkbox from "expo-checkbox"; // You may need to install expo-checkbox

const Stack = createStackNavigator();

function HomeScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState(
    route.params?.editedText || ""
  );
  const [barcodeData, setBarcodeData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  const scanBarcode = () => {
    setScanned(false);
    setIsScanning(true);
  };
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsScanning(false);
    setBarcodeData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  const toggleScanning = () => {
    setIsScanning(!isScanning);
  };

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

    if (!result.cancelled) {
      let uri = result.assets[0].uri;
      setImage(uri);
      uploadImage(uri);
    }
  };

  const selectImage = async (setImage, setChecked) => {
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

    if (!result.cancelled) {
      let uri = result.assets[0].uri;
      setImage(uri);
      setChecked(true);
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No URI provided");
      return;
    }

    setLoading(true);

    // Replace the URL with your actual endpoint
    let responseFetch = await fetch("http://192.168.0.5:8080/extract_text", {
      method: "POST",
      body: createFormData(uri),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    let json = await responseFetch.json();
    console.log(json);

    setExtractedText(json.extracted_text);
    setLoading(false);

    // Navigate to Confirmation screen with extracted text
    navigation.navigate("Confirmation", { extractedText: json.extracted_text });
  };

  const createFormData = (uri) => {
    let formData = new FormData();
    let uriParts = uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    formData.append("image", {
      uri,
      name: `image.${fileType}`,
      type: `image/${fileType}`,
    });

    return formData;
  };
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        paddingBottom: 30,
      }}
    >
      <Text style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
        Take a photo of the product nutation table :{" "}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={selectImageFromCamera}
        >
          <Text>Take a Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttons}
          onPress={selectImageFromGallery}
        >
          <Text>Upload a Photo</Text>
        </TouchableOpacity>
      </View>
      <Text>This is the extracted text: {extractedText}</Text>
      <Text>Scan the product's Barcode :</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttons} onPress={scanBarcode}>
          <Text>Scan Barcode</Text>
        </TouchableOpacity>
      </View>
      <Text>this is the extracted Barcode :{barcodeData}</Text>
      {isScanning && (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned}
      <View style={styles.photoButtonContainer}>
        <View style={styles.photoButtonWrapper}>
          <TouchableOpacity
            style={styles.buttons2}
            onPress={() => selectImage(setImage1, setChecked1)}
          >
            <Text>Take Photo 1</Text>
          </TouchableOpacity>
          <Checkbox
            style={styles.checkbox}
            value={checked1}
            onValueChange={setChecked1}
          />
          {image1 && <Image source={{ uri: image1 }} style={styles.image} />}
        </View>
        <View style={styles.photoButtonWrapper}>
          <TouchableOpacity
            style={styles.buttons2}
            onPress={() => selectImage(setImage2, setChecked2)}
          >
            <Text>Take Photo 2</Text>
          </TouchableOpacity>
          <Checkbox
            style={styles.checkbox}
            value={checked2}
            onValueChange={setChecked2}
          />
          {image2 && <Image source={{ uri: image2 }} style={styles.image} />}
        </View>
        <View style={styles.photoButtonWrapper}>
          <TouchableOpacity
            style={styles.buttons2}
            onPress={() => selectImage(setImage3, setChecked3)}
          >
            <Text>Take Photo 3</Text>
          </TouchableOpacity>
          <Checkbox
            style={styles.checkbox}
            value={checked3}
            onValueChange={setChecked3}
          />
          {image3 && <Image source={{ uri: image3 }} style={styles.image} />}
        </View>
      </View>
    </View>
  );
}

function ConfirmationScreen({ route, navigation }) {
  const { extractedText } = route.params;
  const [editedText, setEditedText] = useState(extractedText);
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    // Navigate back to HomeScreen with the edited text
    navigation.navigate("Home", { editedText });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {isEditing ? (
        <TextInput
          value={editedText}
          onChangeText={setEditedText}
          style={styles.textInput}
        />
      ) : (
        <Text style={styles.extractedText}>Extracted Text: {editedText}</Text>
      )}
      <View style={styles.buttonsContainer}>
        <Button title="Edit" onPress={() => setIsEditing(true)} />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
}

export default function CombinedScreen() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
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
  buttons2: {
    width: 100,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20, // This will make the TextInput circular
  },
  photoButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-starts",
    width: "100%",
    paddingHorizontal: 0,
    marginTop: 0,
  },
  photoButtonWrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 0,
  },
  checkbox: {
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  extractedText: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer2: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
