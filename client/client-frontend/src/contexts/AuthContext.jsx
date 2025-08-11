import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import app from "../firebase";

const db = getFirestore(app);
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        setIsAdmin(role === "admin");
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Registered successfully!");

      await setDoc(doc(db, "users", res.user.uid), {
        email,
        role: "user",
      });

      return res;
    } catch (err) {
      toast.error("Registration failed: " + err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      return res;
    } catch (err) {
      toast.error("Login failed: " + err.message);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    // toast removed from here to avoid double message
  };

  const value = {
    user,
    register,
    login,
    logout,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </>
      )}
    </AuthContext.Provider>
  );
};
