// ✅ src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBroSZ_LxVbjsHiv_W4gR2XTA3-ux1xoBs",
  authDomain: "clothify-auth-1765.firebaseapp.com",
  projectId: "clothify-auth-1765",
  storageBucket: "clothify-auth-1765.appspot.com", // ✅ Correct bucket format
  messagingSenderId: "338860292137",
  appId: "1:338860292137:web:17e201e890c1ad8b7c8438",
  measurementId: "G-YC6FB3V5NM"
};

const app = initializeApp(firebaseConfig);

// ✅ Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
