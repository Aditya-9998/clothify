// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDYqMFcxLoYWAQNHLvVUH6HmBNV7XEoeJw",
  authDomain: "clothify-auth-1765.firebaseapp.com",
  projectId: "clothify-auth-1765",
  storageBucket: "clothify-auth-1765.firebasestorage.app",
  messagingSenderId: "338860292137",
  appId: "1:338860292137:web:17e201e890c1ad8b7c8438",
  measurementId: "G-YC6FB3V5NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export needed Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
