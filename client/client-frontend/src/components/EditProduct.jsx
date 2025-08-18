// src/components/EditProduct.jsx
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const categoriesList = ["Men", "Women", "Kids", "Accessories"];

const EditProduct = ({ product, onClose, onUpdate }) => {
  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || "");
  const [quantity, setQuantity] = useState(product.quantity || 0);
  const [image, setImage] = useState(product.image || "");
  const [categories, setCategories] = useState(product.categories || []);

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

  const handleUpdate = async () => {
    const productRef = doc(db, "Products", product.id);

    await updateDoc(productRef, {
      name,
      price: Number(price),
      quantity: Number(quantity),
      image,
      categories,
    });

    onUpdate(); // refresh product list
    onClose();  // close modal/form
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="w-full border px-4 py-2 rounded mb-3"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price"
        className="w-full border px-4 py-2 rounded mb-3"
      />

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="w-full border px-4 py-2 rounded mb-3"
      />

      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="Image URL"
        className="w-full border px-4 py-2 rounded mb-3"
      />

      {/* Category Selection */}
      <div className="mb-4">
        <h3 className="font-medium mb-1 text-gray-700">Category</h3>
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
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
        <button onClick={handleUpdate} className="px-4 py-2 rounded bg-blue-600 text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
