// ✅ src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  getIdTokenResult,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();

            // ✅ Check both: custom claim & Firestore role
            const tokenResult = await getIdTokenResult(firebaseUser, true);
            const isAdminClaim = tokenResult.claims?.admin || false;
            const isAdminRole = firestoreData.role === "admin";
            const finalIsAdmin = isAdminClaim || isAdminRole;

            const mergedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName:
                firestoreData.displayName ||
                firebaseUser.displayName ||
                "",
              role: finalIsAdmin ? "admin" : firestoreData.role || "user",
            };

            setUser(mergedUser);
            setIsAdmin(finalIsAdmin);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Register user
  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const newUser = userCredential.user;

    if (name?.trim()) {
      await updateProfile(newUser, { displayName: name.trim() });
    }

    const userDocData = {
      uid: newUser.uid,
      email: newUser.email,
      displayName: name || newUser.displayName || "",
      role: "user",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", newUser.uid), userDocData);

    // ✅ Ensure context updates immediately
    setUser(userDocData);
    setIsAdmin(false);

    return userCredential;
  };

  // ✅ Login user
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // ✅ Logout user
  const logout = () => signOut(auth);

  const value = {
    user,
    isAdmin,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
          <p className="text-lg">Checking session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
