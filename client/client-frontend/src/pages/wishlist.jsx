// src/pages/wishlist.jsx
import React from "react";
import { useWishlist } from "../contexts/WishlistContext";

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold">Your Wishlist is Empty ❤️</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wishlist ❤️</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-40 w-40 object-cover rounded-md mb-2"
            />
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-gray-600">₹{item.price}</p>
            <button
              onClick={() => toggleWishlist(item)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ THIS LINE IS CRUCIAL
export default WishlistPage;
