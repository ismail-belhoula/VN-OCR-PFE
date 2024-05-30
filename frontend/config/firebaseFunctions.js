// firebaseFunctions.js
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase"; // adjust the import path as necessary
const saveDataToFirestore = async (text, barcode, email) => {
  try {
    if (!email) {
      email = "Unknown";
    }
    const docRef = await addDoc(collection(db, "extractedData"), {
      text: text,
      barcode: barcode,
      email: email,
      timestamp: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const uploadPhoto = async (photoUri, photoName) => {
  const response = await fetch(photoUri);
  const blob = await response.blob();
  const storageRef = ref(storage, `photos/${photoName}`);

  try {
    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("File available at", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file: ", error);
  }
};

export { saveDataToFirestore, uploadPhoto };
