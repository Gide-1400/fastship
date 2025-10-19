// =====================================
// FastShip - Firebase Configuration
// الملف: js/firebase-config.js
// =====================================

// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// إعدادات Firebase الخاصة بمشروعك
const firebaseConfig = {
  apiKey: "AIzaSyChPGP2JICwH_IGs7BT-DDZH2LzuK7_L58",
  authDomain: "fastship-2026.firebaseapp.com",
  // ✅ تم التعديل - المنطقة الصحيحة (آسيا)
  databaseURL: "https://fastship-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fastship-2026",
  storageBucket: "fastship-2026.firebasestorage.app",
  messagingSenderId: "646769615933",
  appId: "1:646769615933:web:5fd3c82c31969192f9f654"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تهيئة الخدمات
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

// إضافة للـ window للوصول العام
window.firebaseApp = app;
window.auth = auth;
window.db = db;
window.storage = storage;

console.log("✅ Firebase initialized successfully");
console.log("📍 Project:", firebaseConfig.projectId);
console.log("🌏 Database Region: Asia Southeast 1");
