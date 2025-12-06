// src/components/EditProduct.jsx
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../firebase";
import { uploadToCloudinary } from "../cloudinary/upload";

const categoriesList = ["Men", "Women", "Kids", "Accessories"];

export default function EditProduct({ product, onClose, onUpdate }) {
  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || 0);
  const [quantity, setQuantity] = useState(product.quantity || 0);
  const [categories, setCategories] = useState(product.categories || []);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleCategory = (cat) => {
    if (cat === "Kids" || cat === "Accessories") {
      setCategories([cat]);
      return;
    }
    const rest = categories.filter(c => c !== "Kids" && c !== "Accessories");
    if (rest.includes(cat)) {
      setCategories(rest.filter(c => c !== cat));
    } else {
      setCategories([...rest, cat]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let imageUrl = product.image || "";

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const docRef = doc(db, "Products", product.id);
      await updateDoc(docRef, {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
        image: imageUrl,
        categories,
      });

      toast.success("Updated");
      onUpdate && onUpdate();
      onClose && onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-3">Edit Product</h3>
      <input value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
      <input value={price} onChange={e => setPrice(e.target.value)} type="number" className="w-full border px-3 py-2 rounded mb-2" />
      <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" className="w-full border px-3 py-2 rounded mb-2" />

      <div className="mb-2">
        <label className="block mb-1">Change Image</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
      </div>

      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {categoriesList.map(cat => (
            <button key={cat} type="button" onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded ${categories.includes(cat) ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
        <button onClick={handleSave} disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
