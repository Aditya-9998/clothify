import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

// Local fallback images
import tshirtImg from "../assets/T-shirt.webp";
import jacketImg from "../assets/danim.webp";
import jeansImg from "../assets/jeans.webp";

const fallbackProducts = {
  "local-1": { id: "local-1", name: "T-Shirt", price: 499, image: tshirtImg },
  "local-2": { id: "local-2", name: "Jeans", price: 999, image: jeansImg },
  "local-3": { id: "local-3", name: "Jacket", price: 1499, image: jacketImg },
};

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // 🔄 Get product details (Firebase or fallback)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Try to get from Firebase first
        const productRef = doc(db, "Products", id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({ id, ...productSnap.data() });
        } else if (fallbackProducts[id]) {
          setProduct(fallbackProducts[id]); // Use fallback
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  // 🔄 Get reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const q = query(
          collection(db, "Reviews"),
          where("productId", "==", id),
          orderBy("timestamp", "desc")
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReviews(data);
      } catch (err) {
        toast.error("Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Login required");

    try {
      await addDoc(collection(db, "Reviews"), {
        productId: id,
        userEmail: user.email,
        comment,
        rating,
        timestamp: serverTimestamp(),
      });
      setComment("");
      setRating(5);
      toast.success("Review submitted!");

      // Refresh reviews
      const q = query(
        collection(db, "Reviews"),
        where("productId", "==", id),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

  if (!product) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-72 h-72 object-cover rounded shadow"
        />
        <div>
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-700 mb-4">₹{product.price}</p>
          <p className="text-sm text-gray-600">
            High-quality product. Durable and perfect for daily wear.
          </p>
        </div>
      </div>

      {/* ⭐ Reviews */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="border-b py-2">
              <div className="font-semibold">{r.userEmail}</div>
              <div className="text-yellow-500">{"⭐".repeat(r.rating)}</div>
              <div>{r.comment}</div>
            </div>
          ))
        )}
      </div>

      {/* 📝 Add Review */}
      {user && (
        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
          <h4 className="font-semibold">Add Your Review</h4>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment"
            className="w-full border rounded p-2"
            required
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} Star</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductDetails;
