// firebase.js
import { GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCn2AVWc8N9sLdmXgvVdaUCp2HtcIK8qvs",
  authDomain: "vn-ocr-pfe.firebaseapp.com",
  projectId: "vn-ocr-pfe",
  storageBucket: "vn-ocr-pfe.appspot.com",
  messagingSenderId: "88922293716",
  appId: "1:88922293716:web:884c4fd2b72a3c4f08c241",
  measurementId: "G-MMPXXLQZDS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
