import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import "../styles/AdminDashboard.css";

import { db } from "../firebase";
import { uploadToCloudinary } from "../cloudinary/upload";

const categoriesList = ["Men", "Women", "Kids", "Accessories"];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);

  // Add Product
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit Product States
  const [editMode, setEditMode] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
      const snap = await getDocs(collection(db, "Products"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle category selection
  const toggleCategory = (cat, mode = "add") => {
    if (mode === "edit") {
      setEditProduct((prev) => {
        const updated = prev.categories.includes(cat)
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat];
        return { ...prev, categories: updated };
      });
    } else {
      setCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
      );
    }
  };

  // Add product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !quantity || categories.length === 0) {
      toast.error("Fill all fields and choose category");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

      if (imageFile) imageUrl = await uploadToCloudinary(imageFile);

      await addDoc(collection(db, "Products"), {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
        image: imageUrl,
        categories,
        createdAt: Timestamp.now(),
      });

      toast.success("Product added ✔");
      setName("");
      setPrice("");
      setQuantity("");
      setImageFile(null);
      setCategories([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Start Editing
  const startEdit = (product) => {
    setEditProduct(product);
    setEditMode(true);
  };

  // Save Edited Data
  const saveEdit = async () => {
    if (!editProduct.name || !editProduct.price || !editProduct.quantity) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = editProduct.image;

      if (editImageFile) {
        imageUrl = await uploadToCloudinary(editImageFile);
      }

      await updateDoc(doc(db, "Products", editProduct.id), {
        name: editProduct.name,
        price: Number(editProduct.price),
        quantity: Number(editProduct.quantity),
        categories: editProduct.categories,
        image: imageUrl,
      });

      toast.success("Product Updated ✔");
      setEditMode(false);
      setEditImageFile(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      toast.success("Deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">Admin Dashboard</h2>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-xl shadow-md max-w-lg mb-10">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            type="number"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1 rounded ${
                  categories.includes(cat)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* Edit Product POPUP */}
      {editMode && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-indigo-700">
              Edit Product
            </h3>

            <input
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              value={editProduct.price}
              type="number"
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <input
              value={editProduct.quantity}
              type="number"
              onChange={(e) =>
                setEditProduct({ ...editProduct, quantity: e.target.value })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
              className="mb-3"
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {categoriesList.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat, "edit")}
                  className={`px-3 py-1 rounded ${
                    editProduct.categories.includes(cat)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl shadow border hover:shadow-xl transition"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-indigo-700 font-semibold">₹{p.price}</p>
            <p className="text-gray-600 text-sm">Qty: {p.quantity}</p>
            <p className="text-sm">Categories: {p.categories?.join(", ")}</p>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(p.id)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Copy ID
              </button>

              <button
                onClick={() => startEdit(p)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
