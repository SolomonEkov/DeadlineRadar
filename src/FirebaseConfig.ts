import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtKwltX4GE7mov9_aczASKKEitDSPBwMc",
  authDomain: "deadline-radar-8f6da.firebaseapp.com",
  projectId: "deadline-radar-8f6da",
  storageBucket: "deadline-radar-8f6da.firebasestorage.app",
  messagingSenderId: "549562183427",
  appId: "1:549562183427:web:a60bd306ba290341850336",
  measurementId: "G-FPBZTPLSSG",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
