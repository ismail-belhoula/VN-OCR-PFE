import React, { useState, useEffect } from "react";
import { ImageBackground } from "react-native";
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
import { useAuthentication } from "../../utils/hooks/useAuthentication";

const Stack = createStackNavigator();

function MainScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const editedText = route.params?.editedText;
  const [extractedText, setExtractedText] = useState("");
  const barcodeData = route.params?.barcodeData || "";
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

  const { user } = useAuthentication();
  const useremail = user?.email;

  const scanBarcode = () => {
    navigation.navigate("ScanBarcodeScreen", {
      onConfirm: changeBackgroundColorToLightGreen2,
    });
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
    if (editedText) {
      setExtractedText(editedText);
    }
  }, [editedText]);

  useEffect(() => {
    handleAllChecked();
  }, [checked1, checked2, checked3]);

  const uploadImage = async (uri) => {
    if (!uri) {
      console.log("No URI provided");
      return;
    }
    setLoading(true);
    let responseFetch = await fetch("http://192.168.0.8:8080/extract_text", {
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
      selectImageFromCamera(); // restart the function
      return;
    }
    setExtractedText(json.extracted_text);
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
      uploadPhoto(image1),
      uploadPhoto(image2),
      uploadPhoto(image3),
    ]);

    console.log("Photo URLs: ", photoUrls);

    // Save extracted text and barcode
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
            style={[
              styles.box,
              {
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                overflow: "hidden",
                borderRadius: 50,
                marginVertical: 10,
                marginHorizontal: 7,
                width: "97%",
                paddingHorizontal: 20,
                borderWidth: 5, // Border width
                borderColor: bdcolor, // Border color
                borderRadius: 50, // Border radius
              },
            ]}
          >
            <Text style={styles.subtitle}>
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
            <View style={styles.form}>
              <Text style={{ paddingTop: 10 }}>
                This is the extracted text:{" "}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  paddingTop: 20,
                  paddingBottom: 20,
                  textTransform: "capitalize",
                  textDecorationStyle: "solid",
                  textShadowColor: "#0099FF",
                }}
              >
                {extractedText}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.box,
              {
                justifyContent: "center",
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                overflow: "hidden",
                borderRadius: 50,
                marginVertical: 10,
                marginHorizontal: 7,
                width: "97%",
                paddingHorizontal: 20,
                borderWidth: 5, // Border width
                borderColor: bdcolor2, // Border color
                borderRadius: 50, // Border radius
              },
            ]}
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
            style={[
              styles.box,
              {
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                overflow: "hidden",
                borderRadius: 50,
                marginVertical: 10,
                marginHorizontal: 7,
                width: "97%",
                paddingHorizontal: 20,
                paddingTop: 10,
                borderWidth: 5, // Border width
                borderColor: bdcolor3, // Border color
                borderRadius: 50, // Border radius
              },
            ]}
          >
            <Text style={styles.subtitle}>
              Take different angle photos of the product:
            </Text>
            <View style={styles.photoButtonContainer}>
              <View style={styles.photoButtonWrapper}>
                <TouchableOpacity
                  style={styles.buttons2}
                  onPress={() => selectImage(setImage1, setChecked1)}
                >
                  <Text style={styles.confirmButtonText}>Photo N°1</Text>
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
                  <Text style={styles.confirmButtonText}>Photo N°2</Text>
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
                  <Text style={styles.confirmButtonText}>Photo N°3</Text>
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
      </ImageBackground>
    </ScrollView>
  );
}

function ConfirmationScreen({ route, navigation }) {
  const { extractedText } = route.params;
  const [editedText, setEditedText] = useState(extractedText);
  const [isEditing, setIsEditing] = useState(false);

  const handleConfirm = () => {
    // Navigate back to HomeScreen with the edited text
    navigation.navigate("Main", { editedText });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "lightblue" }}
    >
      <ImageBackground
        source={require("../../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        <View
          style={[
            styles.box,
            {
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: 20,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              overflow: "hidden",
              borderRadius: 50,
              marginVertical: 10,
              marginHorizontal: 7,
              width: "97%",
              paddingHorizontal: 20,
              paddingTop: 10,
              borderWidth: 5, // Border width
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
              <Text style={styles.subtitle}>Extracted Text:</Text>
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

            <TouchableOpacity
              style={styles.confirmButton2}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

function ScanBarcodeScreen({ navigation, route }) {
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState("");
  const { onConfirm } = route.params;

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "lightblue" }}
    >
      <ImageBackground
        source={require("../../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        <View
          style={[
            styles.box,
            {
              paddingBottom: 50,
              backgroundColor: "rgba(255, 255, 255, 0.85)",
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
          <Text style={styles.subtitle}>Scanned Barcode:</Text>
          {scanned ? (
            <TextInput
              value={barcodeData}
              onChangeText={setBarcodeData}
              style={styles.textInput}
            />
          ) : (
            <View>
              <Text style={styles.extractedText}> {barcodeData}</Text>
            </View>
          )}
          <View style={styles.buttonContainer2}>
            <TouchableOpacity
              style={styles.confirmButton2}
              onPress={() => setScanned(false)}
            >
              <Text style={styles.confirmButtonText}>Scan Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton2}
              onPress={() => {
                navigation.navigate("Main", { barcodeData });
                onConfirm();
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>

        {!scanned && (
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={[
              styles.box,
              {
                position: "absolute",
                left: 5,
                right: 5,
                top: 0,
                bottom: 0,
                borderColor: "#0099FF",
                borderWidth: 20,
                borderRadius: 50, // Add your desired border radius here
              },
            ]}
            f
          />
        )}
      </ImageBackground>
    </ScrollView>
  );
}

export default function CombinedScreen() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="ScanBarcodeScreen"
        component={ScanBarcodeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainScreen}
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
  subtitle: {
    paddingBottom: 20,
    paddingTop: 20,
    marginTop: 40,
    borderWidth: 3,
    borderColor: "#0099FF",
    fontWeight: "bold",
    fontSize: 20,
    color: "#0099FF",
    backgroundColor: "#fff",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 15,
    width: "100%",
    padding: 10,
    textAlign: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // or 'stretch' or 'contain'
  },
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
    paddingTop: 20,
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
    minHeight: 100,
    textAlignVertical: "auto",
    marginTop: 20,
    marginBottom: 20,
    height: 50,
    borderColor: "gray",
    borderWidth: 2,
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
    paddingTop: 20,
  },
  photoButtonWrapper: {
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 0,
    paddingBottom: 20,
  },
  checkbox: {
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: 110,
    height: 110,
    margin: 10,
    borderRadius: 10,
    borderColor: "#0099FF",
    borderWidth: 2,
  },
  extractedText: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderColor: "#0099FF",
    borderWidth: 2,
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
