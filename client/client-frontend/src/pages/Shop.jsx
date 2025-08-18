import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { db } from "../firebase";

import tshirtImg from "../assets/T-shirt.webp";
import jacketImg from "../assets/danim.webp";
import jeansImg from "../assets/jeans.webp";

const defaultProducts = [
  { id: "local-1", name: "T-Shirt", price: 499, image: tshirtImg, quantity: 5, categories: ["Men", "Women"] },
  { id: "local-2", name: "Jeans", price: 999, image: jeansImg, quantity: 2, categories: ["Men", "Women"] },
  { id: "local-3", name: "Jacket", price: 1499, image: jacketImg, quantity: 988, categories: ["Women"] },
];

const itemsPerPage = 6;

export default function Shop() {
  const { addToCart, cartItems } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [adminProducts, setAdminProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchAdminProducts() {
      try {
        const snapshot = await getDocs(collection(db, "Products"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          quantity: doc.data().quantity ?? 100,
          ...doc.data(),
        }));
        setAdminProducts(data);
      } catch (err) {
        console.error("Failed to fetch admin products:", err);
      }
    }
    fetchAdminProducts();
  }, []);

  const allProducts = [...defaultProducts, ...adminProducts];

  // Filtered products
  const filtered = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.categories?.includes(selectedCategory);

    let matchesPrice = true;
    if (priceRange === "under1000") matchesPrice = product.price < 1000;
    else if (priceRange === "above1000") matchesPrice = product.price >= 1000;
    else if (priceRange === "custom") {
      const min = parseInt(minPrice) || 0;
      const max = parseInt(maxPrice) || Infinity;
      matchesPrice = product.price >= min && product.price <= max;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sorted products
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = ["All", "Men", "Women", "Kids", "Accessories"];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">Shop Our Collection</h2>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat === "All" ? "" : cat)}
            className={`px-6 py-2 rounded-full font-medium transition border text-sm
              ${selectedCategory === cat || (cat === "All" && selectedCategory === "")
                ? "bg-indigo-100 text-indigo-800 border-indigo-200 shadow-md"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-4">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="border px-4 py-2 rounded w-full sm:w-60"
        />
        <select
          value={priceRange}
          onChange={(e) => { setPriceRange(e.target.value); setCurrentPage(1); }}
          className="border px-4 py-2 rounded w-full sm:w-44"
        >
          <option value="all">All Prices</option>
          <option value="under1000">Under ₹1000</option>
          <option value="above1000">₹1000 & Above</option>
          <option value="custom">Custom Range</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
          className="border px-4 py-2 rounded w-full sm:w-44"
        >
          <option value="default">Sort By</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Custom price */}
      {priceRange === "custom" && (
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-4 py-2 rounded w-32"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-4 py-2 rounded w-32"
          />
        </div>
      )}

      {/* Product Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {paginated.map((product) => {
          const outOfStock = product.quantity === 0;
          const cartItem = cartItems.find((item) => item.id === product.id);
          const cartQty = cartItem?.quantity || 0;
          const maxReached = cartQty >= product.quantity;
          const inWishlist = isInWishlist(product.id);

          return (
            <div key={product.id} className="border rounded-lg shadow p-4 flex flex-col items-center">
              <Link to={`/product/${product.id}`} className="mb-4 block">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-48 h-48 object-cover rounded hover:scale-105 transition"
                />
              </Link>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-700">₹{product.price}</p>
              {outOfStock && <span className="mt-1 text-sm font-medium text-red-600">Out of Stock</span>}
              {!outOfStock && maxReached && <span className="mt-1 text-sm font-medium text-yellow-600">Max Limit Reached</span>}
              <button
                onClick={() => addToCart(product)}
                disabled={outOfStock || maxReached}
                className={`mt-3 px-4 py-2 rounded-full transition ${outOfStock || maxReached ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
              >
                {outOfStock ? "Out of Stock" : maxReached ? "Max Limit" : "Add to Cart"}
              </button>
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
                className={`mt-2 px-4 py-2 rounded-full text-white flex items-center gap-1 ${inWishlist ? "bg-red-500" : "bg-pink-500"}`}
              >
                <span className="bg-white rounded-full p-1" role="img" aria-label={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                  {inWishlist ? "💔" : "💖"}
                </span>
                {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-50">Previous</button>
          <span className="font-medium">Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 border rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
