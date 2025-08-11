import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

const EditProduct = ({ product, onClose, onUpdate }) => {
  const [name, setName] = useState(product.name || "");
  const [price, setPrice] = useState(product.price || "");
  const [quantity, setQuantity] = useState(product.quantity || 0);
  const [image, setImage] = useState(product.image || "");

  const handleUpdate = async () => {
    const productRef = doc(db, "Products", product.id);

    await updateDoc(productRef, {
      name,
      price: Number(price),
      quantity: Number(quantity),
      image
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
