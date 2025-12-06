// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prodRef = doc(db, "Products", id);
        const snap = await getDoc(prodRef);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        } else {
          setProduct(null);
          toast.error("Product not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const q = query(collection(db, "Reviews"), where("productId", "==", id), orderBy("timestamp", "desc"));
        const snap = await getDocs(q);
        setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
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
      toast.success("Review submitted");
      // refresh
      const q = query(collection(db, "Reviews"), where("productId", "==", id), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast.error("Submit failed");
    }
  };

  if (!product) return <div className="p-8 text-center">Loading product...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.image || "/assets/T-shirt.webp"} alt={product.name} className="w-full md:w-72 h-72 object-cover rounded" />
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-700">₹{product.price}</p>
          <p className="mt-2">Categories: {product.categories?.join(", ")}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-semibold">Customer reviews</h2>
        {loadingReviews ? <p>Loading...</p> : reviews.length === 0 ? <p>No reviews yet</p> :
          reviews.map(r => (
            <div key={r.id} className="border-b py-2">
              <div className="font-medium">{r.userEmail}</div>
              <div className="text-yellow-500">{"⭐".repeat(r.rating)}</div>
              <div>{r.comment}</div>
            </div>
          ))
        }
      </section>

      {user && (
        <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3">
          <textarea required value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review" className="w-full border p-2 rounded" />
          <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border px-2 py-1 rounded">
            {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star</option>)}
          </select>
          <div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-1 rounded">Submit Review</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductDetails;
