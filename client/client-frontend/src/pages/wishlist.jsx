import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {wishlist.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded" />
              <h3 className="text-xl font-semibold mt-2">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(item)}
                className="ml-2 mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
