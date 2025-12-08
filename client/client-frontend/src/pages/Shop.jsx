// Shop.jsx

import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { db } from "../firebase";

const itemsPerPage = 9;

export default function Shop() {
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [adminProducts, setAdminProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch products from Firestore only
  useEffect(() => {
    async function fetchAdminProducts() {
      try {
        const snap = await getDocs(collection(db, "Products"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          quantity: doc.data().quantity ?? 100,
          ...doc.data(),
        }));
        setAdminProducts(data);
      } catch (err) {
        console.error("Error loading admin products:", err);
      }
    }
    fetchAdminProducts();
  }, []);

  const allProducts = [...adminProducts]; // 🔥 Only Firestore products

  // Filtering logic
  const filtered = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? product.categories?.includes(selectedCategory) : true;

    let matchesPrice = true;
    if (priceRange === "under1000") matchesPrice = product.price < 1000;
    if (priceRange === "above1000") matchesPrice = product.price >= 1000;

    if (priceRange === "custom") {
      const min = parseInt(minPrice) || 0;
      const max = parseInt(maxPrice) || Infinity;
      matchesPrice = product.price >= min && product.price <= max;
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categories = ["All", "Men", "Women", "Kids", "Accessories"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-indigo-700 tracking-wide mb-10">
        Shop Our Collection
      </h2>

      {/* Category Filters */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat === "All" ? "" : cat);
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full text-sm font-medium shadow-md transition 
              ${
                selectedCategory === (cat === "All" ? "" : cat)
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-200"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search + Filter + Sort */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg shadow-sm w-60"
        />

        <select
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg shadow-sm w-44"
        >
          <option value="all">All Prices</option>
          <option value="under1000">Under ₹1000</option>
          <option value="above1000">₹1000 & Above</option>
          <option value="custom">Custom Range</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-lg shadow-sm w-44"
        >
          <option value="default">Sort By</option>
          <option value="lowToHigh">Price: Low → High</option>
          <option value="highToLow">Price: High → Low</option>
        </select>
      </div>

      {/* Custom Price Inputs */}
      {priceRange === "custom" && (
        <div className="flex justify-center gap-4 mb-8">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border px-4 py-2 rounded-lg w-32 shadow-sm"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border px-4 py-2 rounded-lg w-32 shadow-sm"
          />
        </div>
      )}

      {/* Products Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
        {paginated.map((product) => {
          const cartItem = cartItems.find((i) => i.id === product.id);
          const cartQty = cartItem?.quantity || 0;
          const outOfStock = product.quantity === 0;
          const maxReached = cartQty >= product.quantity;
          const inWishlist = isInWishlist(product.id);

          return (
            <div
              key={product.id}
              className="bg-white p-5 rounded-xl border shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-lg mb-4 hover:scale-105 transition"
                />
              </Link>

              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-indigo-700 font-bold text-xl mb-2">₹{product.price}</p>

              {outOfStock && <p className="text-red-600 font-medium">Out of Stock</p>}
              {maxReached && <p className="text-yellow-600 font-medium">Max Limit Reached</p>}

              <button
                disabled={outOfStock || maxReached}
                onClick={() => addToCart(product)}
                className={`w-full mt-3 py-2 rounded-lg font-medium transition 
                  ${
                    outOfStock || maxReached
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }
                `}
              >
                {outOfStock ? "Out of Stock" : maxReached ? "Max Limit" : "Add to Cart"}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full mt-3 py-2 rounded-lg font-medium flex justify-center items-center gap-2 
                  ${inWishlist ? "bg-red-500 text-white" : "bg-pink-500 text-white"}
                `}
              >
                <span className="bg-white text-xl rounded-full p-1">
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
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 border rounded-lg shadow hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold text-lg">
            Page {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-5 py-2 border rounded-lg shadow hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
