import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Camera from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAuthentication } from "../../../utils/hooks/useAuthentication";
import Checkbox from "expo-checkbox"; // You may need to install expo-checkbox
import {
  saveDataToFirestore,
  uploadPhoto,
} from "../../../config/firebaseFunctions";

function MainScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [barcodeData, setBarcodeData] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const [images, setImages] = useState([null, null, null]);
  const [checked, setChecked] = useState([false, false, false]);
  const [borderColors, setBorderColors] = useState([
    "#0099FF",
    "#0099FF",
    "#0099FF",
  ]);

  const { user } = useAuthentication();
  const useremail = user?.email;

  useEffect(() => {
    const { status } = BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  }, []);

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
      setChecked((prevChecked) => {
        const newChecked = [...prevChecked];
        newChecked[index] = true;
        return newChecked;
      });
      setBorderColors((prevColors) => {
        const newColors = [...prevColors];
        newColors[index] = "#90EE90"; // Light green color code
        return newColors;
      });
    }
  };

  const handleResetData = () => {
    setExtractedText("");
    setBarcodeData("");
    setImages([null, null, null]);
    setChecked([false, false, false]);
    setBorderColors(["#0099FF", "#0099FF", "#0099FF"]);
  };

  const handleConfirmData = async () => {
    const photoUrls = await Promise.all(images.map(uploadPhoto));
    await saveDataToFirestore(extractedText, barcodeData, useremail);
    alert("Data saved successfully!");
    console.log("Data saved successfully!");
  };

  const renderImage = (uri, index) => {
    if (uri) {
      return <Image source={{ uri }} style={styles.image} />;
    }
    return null;
  };

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
        source={require("../../../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        <View style={{ justifyContent: "center", alignContent: "center" }}>
          <View style={[styles.box, { borderColor: borderColors[0] }]}>
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
          <View style={[styles.box, { borderColor: borderColors[1] }]}>
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
          <View style={[styles.box, { borderColor: borderColors[2] }]}>
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
              style={styles.confirmButton}
              onPress={handleResetData}
            >
              <Text style={styles.confirmButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    overflow: "hidden",
    borderRadius: 50,
    marginVertical: 10,
    marginHorizontal: 7,
    width: "97%",
    paddingHorizontal: 20,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingTop: 30,
    paddingBottom: 20,
  },
  confirmButton: {
    borderWidth: 2,
    borderColor: "#0099FF",
    borderRadius: 10,
    backgroundColor: "#25aae1",
    padding: 15,
    marginTop: 10,
    backgroundColor: "#FFF",
    width: 150,
    marginHorizontal: 10,
  },
  confirmButtonText: {
    color: "#0099FF",
    fontSize: 13,
    fontWeight: "bold",
    padding: 10,
    alignSelf: "center",
  },
  image: {
    width: 110,
    height: 110,
    margin: 10,
    borderRadius: 10,
    borderColor: "#0099FF",
    borderWidth: 2,
  },
});

export default MainScreen;
