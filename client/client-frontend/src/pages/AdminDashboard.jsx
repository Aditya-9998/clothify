// src/pages/AdminDashboard.jsx
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EditProduct from "../components/EditProduct";
import { db, storage } from "../firebase";

const categoriesList = ["Men", "Women", "Kids", "Accessories"];

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Products"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    } catch (err) {
      toast.error("Failed to fetch products.");
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !quantity || categories.length === 0) {
      toast.error("Please fill in all the fields and select category.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in as admin.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const imageRef = ref(storage, `products/${fileName}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "Products"), {
        name: name.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: imageUrl,
        categories,
        createdAt: Timestamp.now(),
      });

      toast.success("✅ Product added successfully!");

      // Reset form
      setName("");
      setPrice("");
      setQuantity("");
      setImageFile(null);
      setCategories([]);
      fetchProducts();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("❌ Failed to upload product.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      toast.success("🗑️ Product deleted.");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("❌ Failed to delete.");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  // Category button click logic
  const toggleCategory = (cat) => {
    if (cat === "Kids" || cat === "Accessories") {
      setCategories([cat]); // single-select
    } else {
      // Men/Women multi-select, remove Kids/Accessories if any
      const newCats = categories.filter((c) => c !== "Kids" && c !== "Accessories");
      if (categories.includes(cat)) {
        setCategories(newCats.filter((c) => c !== cat));
      } else {
        setCategories([...newCats, cat]);
      }
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <h2 className="text-3xl font-bold text-indigo-700 dark:text-white mb-4">
        Admin Dashboard
      </h2>

      {/* Add Product */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-md">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-4 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-4 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border px-4 py-2 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full"
        />

        {/* Category Selection */}
        <div className="mb-2">
          <h3 className="font-medium mb-1 text-gray-700 dark:text-gray-200">Category</h3>
          <div className="flex gap-2 flex-wrap">
            {categoriesList.map((cat) => {
              const selected = categories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded transition ${
                    selected
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "➕ Add Product"}
        </button>
      </form>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 shadow dark:bg-gray-800 dark:border-gray-700"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <h3 className="text-lg font-bold dark:text-white">{product.name}</h3>
            <p className="dark:text-gray-300">₹{product.price}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Qty: {product.quantity}
            </p>
            <p className="text-sm mt-1">
              Categories: {product.categories?.join(", ")}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditProduct
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onUpdate={() => {
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
