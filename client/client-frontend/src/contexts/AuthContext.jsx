import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firebase state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore me user ka doc fetch karo
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = snap.exists() ? snap.data() : null;

        // Merge Firebase Auth + Firestore data
        const mergedUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: data?.displayName || firebaseUser.displayName || "",
          role: data?.role || "user",
        };

        setUser(mergedUser);
        setIsAdmin(mergedUser.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  // 🔹 Register function
  const register = async (email, password, name) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Update Firebase Auth profile
    if (name?.trim()) {
      await updateProfile(res.user, { displayName: name.trim() });
    }

    // Save user data to Firestore
    await setDoc(
      doc(db, "users", res.user.uid),
      {
        uid: res.user.uid,
        email: res.user.email,
        displayName: name || res.user.displayName || "",
        role: "user",
        createdAt: new Date(),
      },
      { merge: true }
    );

    // Update state immediately
    setUser({
      uid: res.user.uid,
      email: res.user.email,
      displayName: name || res.user.displayName,
      role: "user",
    });

    return res;
  };

  // 🔹 Login function (no need name)
  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);

    // Firestore se user ka name fetch
    const snap = await getDoc(doc(db, "users", res.user.uid));
    const data = snap.exists() ? snap.data() : {};

    const mergedUser = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: data?.displayName || res.user.displayName || "",
      role: data?.role || "user",
    };

    setUser(mergedUser);
    setIsAdmin(mergedUser.role === "admin");

    return res;
  };

  // 🔹 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const value = { user, isAdmin, loading, register, login, logout };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
