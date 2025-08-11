// contexts/WishlistContext.jsx
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const wishlistRef = collection(db, "users", user.uid, "wishlist");

    const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        docId: doc.id, // Store Firestore doc ID
      }));
      setWishlist(data);
    });

    return unsubscribe;
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user) return alert("Login required");
    const wishlistRef = collection(db, "users", user.uid, "wishlist");

    const existing = await getDocs(
      query(wishlistRef, where("id", "==", product.id))
    );
    if (!existing.empty) return alert("Already in wishlist");

    await addDoc(wishlistRef, product);
  };

  const removeFromWishlist = async (productId) => {
    const ref = collection(db, "users", user.uid, "wishlist");
    const existing = await getDocs(query(ref, where("id", "==", productId)));

    existing.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "users", user.uid, "wishlist", docSnap.id));
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
