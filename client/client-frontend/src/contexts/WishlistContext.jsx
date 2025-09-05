import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { collection, doc, onSnapshot, setDoc, deleteDoc } from "firebase/firestore";

// Create context
const WishlistContext = createContext();

// Hook to use Wishlist
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist in real-time
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const wishlistRef = collection(db, "users", user.uid, "wishlist");

    const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWishlist(items);
    });

    return () => unsubscribe();
  }, [user]);

  // Toggle wishlist item (add/remove)
  const toggleWishlist = async (item) => {
    if (!user) {
      alert("Please login to manage wishlist");
      return;
    }

    const itemRef = doc(db, "users", user.uid, "wishlist", item.id.toString());
    const exists = wishlist.find((w) => w.id === item.id);

    if (exists) {
      await deleteDoc(itemRef);
    } else {
      await setDoc(itemRef, {
        name: item.name,
        price: item.price,
        image: item.image,
        createdAt: new Date(),
      });
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
