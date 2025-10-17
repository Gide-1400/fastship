// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChPGP2JICwH_IGs7BT-DDZH2LzuK7_L58",
  authDomain: "fastship-2026.firebaseapp.com",
  projectId: "fastship-2026",
  storageBucket: "fastship-2026.firebasestorage.app",
  messagingSenderId: "646769615933",
  appId: "1:646769615933:web:5fd3c82c31969192f9f654"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
