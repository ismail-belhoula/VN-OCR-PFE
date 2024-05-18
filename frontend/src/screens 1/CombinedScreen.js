import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { createStackNavigator } from "@react-navigation/stack";
import Checkbox from "expo-checkbox"; // You may need to install expo-checkbox
import {
  saveDataToFirestore,
  uploadPhoto,
} from "../../config/firebaseFunctions";
// adjust the import path as necessary

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

  const [bdcolor, setbdcolor] = useState("#0099FF");
  const [bdcolor2, setbdcolor2] = useState("#0099FF");
  const [bdcolor3, setbdcolor3] = useState("#0099FF");

  const [bbcolor, setbbcolor] = useState("#0099FF");
  const [bcolor2, setbbcolor2] = useState("#0099FF");
  const [bbcolor3, setbbcolor3] = useState("#0099FF");
  const [cbcolor, setcbcolor] = useState("#0099FF");

  const changeBackgroundColorToLightGreen = () => {
    setbdcolor("#90EE90"); // Light green color code
  };
  const changeBackgroundColorToLightGreen2 = () => {
    setbdcolor2("#90EE90"); // Light green color code
  };
  const changeBackgroundColorToLightGreen3 = () => {
    setbdcolor3("#90EE90"); // Light green color code
  };
  const changeConfirmButtonColorToLightGreen = () => {
    setbdcolor3("#90EE90"); // Light green color code
  };

  const scanBarcode = () => {
    setScanned(false);
    setIsScanning(true);
  };
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsScanning(false);
    setBarcodeData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    changeBackgroundColorToLightGreen2();
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

  const handleAllChecked = () => {
    if (checked1 && checked2 && checked3) {
      changeBackgroundColorToLightGreen3();
    }
  };
  useEffect(() => {
    handleAllChecked();
  }, [checked1, checked2, checked3]);

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No URI provided");
      return;
    }

    setLoading(true);

    // Replace the URL with your actual endpoint
    let responseFetch = await fetch("http://192.168.0.4:8080/extract_text", {
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
    changeBackgroundColorToLightGreen();

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

  const handleConfirmData = async () => {
    // Upload images
    const photoUrls = await Promise.all([
      uploadPhoto(image1, "photo1.jpg"),
      uploadPhoto(image2, "photo2.jpg"),
      uploadPhoto(image3, "photo3.jpg"),
    ]);

    // Save extracted text and barcode
    await saveDataToFirestore(extractedText, barcodeData);

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
      <View style={{ justifyContent: "center", alignContent: "center" }}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: "#FFF",
              overflow: "hidden",
              borderRadius: 50,
              marginVertical: 10,
              marginHorizontal: 7,
              width: "97%",
              paddingHorizontal: 20,
              paddingTop: 20,
              borderWidth: 3, // Border width
              borderColor: bdcolor, // Border color
              borderRadius: 50, // Border radius
            },
          ]}
        >
          <Text
            style={{
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            Take/Upload a photo of the product nutation table :
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttons}
              onPress={selectImageFromCamera}
            >
              <Text style={styles.confirmButtonText}>Take a Photo</Text>
              <MaterialIcons name="add-a-photo" size={24} color="#0099FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttons}
              onPress={selectImageFromGallery}
            >
              <Text style={styles.confirmButtonText}>Upload a Photo</Text>
              <MaterialIcons
                name="add-photo-alternate"
                size={24}
                color="#0099FF"
              />
            </TouchableOpacity>
          </View>
          <Text>This is the extracted text: </Text>
          <Text
            style={{
              alignSelf: "center",
              paddingTop: 20,
            }}
          >
            {extractedText}
          </Text>
        </View>
        <View
          style={[
            styles.box,
            {
              backgroundColor: "#FFF",
              overflow: "hidden",
              borderRadius: 50,
              marginVertical: 10,
              marginHorizontal: 7,
              width: "97%",
              paddingHorizontal: 20,
              paddingTop: 20,
              borderWidth: 3, // Border width
              borderColor: bdcolor2, // Border color
              borderRadius: 50, // Border radius
            },
          ]}
        >
          <Text>Scan the product's Barcode :</Text>
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
          <Text style={{ paddingBottom: 10 }}>
            this is the extracted Barcode :{barcodeData}
          </Text>
          {isScanning && (
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          {scanned}
        </View>
        <View
          style={[
            styles.box,
            {
              backgroundColor: "#FFF",
              overflow: "hidden",
              borderRadius: 50,
              marginVertical: 10,
              marginHorizontal: 7,
              width: "97%",
              paddingHorizontal: 20,
              paddingTop: 10,
              borderWidth: 3, // Border width
              borderColor: bdcolor3, // Border color
              borderRadius: 50, // Border radius
            },
          ]}
        >
          <View style={styles.photoButtonContainer}>
            <View style={styles.photoButtonWrapper}>
              <TouchableOpacity
                style={styles.buttons2}
                onPress={() => selectImage(setImage1, setChecked1)}
              >
                <Text style={styles.confirmButtonText}>Take Photo 1</Text>
              </TouchableOpacity>
              <Checkbox
                style={styles.checkbox}
                value={checked1}
                onValueChange={setChecked1}
              />
              {image1 && (
                <Image source={{ uri: image1 }} style={styles.image} />
              )}
            </View>
            <View style={styles.photoButtonWrapper}>
              <TouchableOpacity
                style={styles.buttons2}
                onPress={() => selectImage(setImage2, setChecked2)}
              >
                <Text style={styles.confirmButtonText}>Take Photo 2</Text>
              </TouchableOpacity>
              <Checkbox
                style={styles.checkbox}
                value={checked2}
                onValueChange={setChecked2}
              />
              {image2 && (
                <Image source={{ uri: image2 }} style={styles.image} />
              )}
            </View>
            <View style={styles.photoButtonWrapper}>
              <TouchableOpacity
                style={styles.buttons2}
                onPress={() => selectImage(setImage3, setChecked3)}
              >
                <Text style={styles.confirmButtonText}>Take Photo 3</Text>
              </TouchableOpacity>
              <Checkbox
                style={styles.checkbox}
                value={checked3}
                onValueChange={setChecked3}
              />
              {image3 && (
                <Image source={{ uri: image3 }} style={styles.image} />
              )}
            </View>
          </View>
        </View>
        {/* Confirm Button */}
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
        </View>
      </View>
    </ScrollView>
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
    <View
      style={[
        styles.box,
        {
          backgroundColor: "#FFF",
          overflow: "hidden",
          borderRadius: 50,
          marginVertical: 10,
          marginHorizontal: 7,
          width: "97%",
          paddingHorizontal: 20,
          paddingTop: 10,
          borderWidth: 3, // Border width
          borderColor: "#0099FF", // Border color
          borderRadius: 50, // Border radius
        },
      ]}
    >
      {isEditing ? (
        <TextInput
          value={editedText}
          onChangeText={setEditedText}
          style={styles.textInput}
        />
      ) : (
        <View>
          <Text>Extracted Text:</Text>
          <Text style={styles.extractedText}> {editedText}</Text>
        </View>
      )}
      <View style={styles.buttonContainer2}>
        <TouchableOpacity
          style={styles.confirmButton2}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.confirmButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton2} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CombinedScreen() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Confirmation"
        component={ConfirmationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  buttons: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 50, // Border radius
    width: 150,
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
  buttons2: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 50, // Border radius
    width: 115,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    margin: 10,
    height: 55,
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: "#FFF",
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
  buttons: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 50, // Border radius
    width: 115,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    margin: 10,
    height: 55,
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: "#FFF",
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
  buttons4: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 50, // Border radius
    width: 115,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    margin: 10,
    height: 55,
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: "#FFF",
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
    paddingHorizontal: 10,
  },
  buttonContainer2: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-around",
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
    marginBottom: 20,
  },
  image: {
    width: 110,
    height: 110,
    margin: 10,
  },
  extractedText: {
    fontSize: 16,
    marginBottom: 20,
    alignSelf: "center",
    paddingTop: 20,
  },
  buttonsContainer2: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  confirmButton: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 10, // Border radiuse
    backgroundColor: "#25aae1",
    padding: 15,
    borderRadius: 50,
    marginTop: "auto",
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    backgroundColor: "#FFF",
    width: 150,
  },
  confirmButton2: {
    borderWidth: 2, // Border width
    borderColor: "#0099FF", // Border color
    borderRadius: 10, // Border radiuse
    backgroundColor: "#25aae1",
    padding: 15,
    borderRadius: 50,
    marginTop: "auto",
    justifyContent: "center",
    alignSelf: "center",
    paddingTop: 10,
    width: 150,
    backgroundColor: "#FFF",
  },
  confirmButtonText: {
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: "10",
    alignSelf: "center",
  },
});
