import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { createStackNavigator } from "@react-navigation/stack";
import Checkbox from "expo-checkbox";
import {
  saveDataToFirestore,
  uploadPhoto,
} from "../../config/firebaseFunctions";
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const Stack = createStackNavigator();

function MainScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [checkedImages, setCheckedImages] = useState([false, false, false]);
  const [images, setImages] = useState([null, null, null]);
  const [borderColors, setBorderColors] = useState([
    "#0099FF",
    "#0099FF",
    "#0099FF",
  ]);
  const [bbcolor, setbbcolor] = useState(["#0099FF", "#0099FF", "#0099FF"]);
  const [cbcolor, setcbcolor] = useState("#0099FF");
  const barcodeData = route.params?.barcodeData || "";
  const editedText = route.params?.editedText;
  const ResetBarCodeData = route.params?.ResetBarCodeData;
  const { user } = useAuthentication();
  const useremail = user?.email;

  const updateBorderColor = (index, color) => {
    setBorderColors((prevColors) => {
      const newColors = [...prevColors];
      newColors[index] = color;
      return newColors;
    });
  };

  const changeBackgroundColor = (index, color) => {
    updateBorderColor(index, color);
  };

  const scanBarcode = () => {
    navigation.navigate("ScanBarcodeScreen", {
      onConfirm: () => changeBackgroundColor(1, "#90EE90"),
      handleResetData: handleResetData,
    });
  };

  const selectImage = async (index) => {
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
      setImages((prevImages) => {
        const newImages = [...prevImages];
        newImages[index] = uri;
        return newImages;
      });
      setCheckedImages((prevChecked) => {
        const newChecked = [...prevChecked];
        newChecked[index] = true;
        return newChecked;
      });
      if (index === 0) {
        uploadImage(uri);
      }
    }
  };

  const handleAllChecked = () => {
    if (checkedImages.every((checked) => checked)) {
      changeBackgroundColor(2, "#90EE90");
    }
  };

  useEffect(() => {
    if (editedText) {
      setExtractedText(editedText);
    }
  }, [editedText]);

  useEffect(() => {
    handleAllChecked();
  }, [checkedImages]);

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No URI provided");
      return;
    }
    setLoading(true);
    let responseFetch = await fetch("http://192.168.1.16:8080/extract_text", {
      method: "POST",
      body: createFormData(uri),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let json = await responseFetch.json();
    console.log(json);
    setLoading(false);
    if (!json.extracted_text) {
      alert("No text detected, please retake the photo");
      selectImage(0); // restart the function
      return;
    }
    setExtractedText(json.extracted_text);
    changeBackgroundColor(0, "#90EE90");
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

  const handleResetData = async () => {
    setExtractedText("");
    ResetBarCodeData();
    setImages([null, null, null]);
    setCheckedImages([false, false, false]);
    setBorderColors(["#0099FF", "#0099FF", "#0099FF"]);
    setbbcolor(["#0099FF", "#0099FF", "#0099FF"]);
    setcbcolor("#0099FF");
  };

  const handleConfirmData = async () => {
    const photoUrls = await Promise.all(images.map(uploadPhoto));
    await saveDataToFirestore(extractedText, barcodeData, useremail);
    alert("Data saved successfully!");
    console.log("Data saved successfully!");
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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "lightblue" }}
    >
      <ImageBackground
        source={require("../../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View
            style={[styles.box, styles.Views, { borderColor: borderColors[1] }]}
          >
            <Text style={styles.subtitle}>Scan the product's Barcode :</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttons} onPress={scanBarcode}>
                <Text style={styles.confirmButtonText}>Scan Barcode</Text>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={24}
                  color="#0099FF"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text style={{ paddingBottom: 40 }}>
                this is the extracted Barcode :{barcodeData}
              </Text>
            </View>
          </View>
          <View
            style={[styles.box, styles.Views, { borderColor: borderColors[0] }]}
          >
            <Text style={styles.subtitle}>
              Take/Upload a photo of the product nutation table :
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => selectImage(0)}
              >
                <Text style={styles.confirmButtonText}>Take a Photo</Text>
                <MaterialIcons name="add-a-photo" size={24} color="#0099FF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttons}
                onPress={() => selectImage(0)}
              >
                <Text style={styles.confirmButtonText}>Upload a Photo</Text>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={24}
                  color="#0099FF"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              <Text style={{ paddingTop: 10 }}>
                This is the extracted text:{" "}
              </Text>
              <Text style={styles.extractedText}>{extractedText}</Text>
            </View>
          </View>
          <View
            style={[styles.box, styles.Views, { borderColor: borderColors[2] }]}
          >
            <Text style={styles.subtitle}>
              Take different angle photos of the product:
            </Text>
            <View style={styles.photoButtonContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.photoButtonWrapper}>
                  <TouchableOpacity
                    style={styles.buttons2}
                    onPress={() => selectImage(index)}
                  >
                    <Text style={styles.confirmButtonText}>
                      Photo N°{index + 1}
                    </Text>
                  </TouchableOpacity>
                  <Checkbox
                    style={styles.checkbox}
                    value={checkedImages[index]}
                    onValueChange={(checked) =>
                      setCheckedImages((prev) => {
                        const newChecked = [...prev];
                        newChecked[index] = checked;
                        return newChecked;
                      })
                    }
                  />
                  {image && (
                    <Image source={{ uri: image }} style={styles.image} />
                  )}
                </View>
              ))}
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "auto",
              paddingTop: 30,
              paddingBottom: 20,
            }}
          >
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmData}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetData}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

function ConfirmationScreen({ route }) {
  const { extractedText } = route.params;
  const [text, setText] = useState(extractedText);

  const handleSave = () => {
    navigation.navigate("MainScreen", { editedText: text });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        multiline
        style={styles.textInput}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
        <Text style={styles.confirmButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

function ScanBarcodeScreen({ navigation, route }) {
  const { onConfirm, handleResetData } = route.params;
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    navigation.navigate("MainScreen", { barcodeData: data });
    if (onConfirm) onConfirm();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ScanBarcodeScreen"
        component={ScanBarcodeScreen}
        options={{ title: "Scan Barcode" }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ title: "Edit Extracted Text" }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "lightblue",
  },
  backgroundImage: { flex: 1, resizeMode: "cover" },
  Views: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 3,
    marginTop: 20,
    paddingBottom: 5,
  },
  form: { alignItems: "center" },
  confirmButton: {
    backgroundColor: "#0099FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  confirmButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  box: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 3,
    padding: 10,
  },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around" },
  buttons: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderColor: "#0099FF",
    borderWidth: 3,
  },
  buttons2: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor: "#0099FF",
    borderWidth: 3,
  },
  subtitle: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 5,
  },
  textInput: {
    width: "100%",
    height: 200,
    padding: 10,
    backgroundColor: "white",
    borderColor: "#0099FF",
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  photoButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  photoButtonWrapper: { alignItems: "center" },
  checkbox: { marginTop: 10 },
  image: { width: 100, height: 100, borderRadius: 10, marginTop: 10 },
  extractedText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    paddingTop: 10,
  },
});
