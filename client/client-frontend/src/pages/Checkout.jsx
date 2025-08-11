import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { db } from "../firebase";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountedTotal = totalAmount - (totalAmount * discountPercent) / 100;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyPromoCode = async () => {
    if (!promoCode) return toast.error("Enter a promo code.");

    try {
      const q = query(
        collection(db, "PromoCodes"),
        where("code", "==", promoCode.trim()),
        where("isActive", "==", true)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const promo = snapshot.docs[0].data();
        setDiscountPercent(promo.discount);
        setPromoApplied(true);
        toast.success(`✅ ${promo.discount}% discount applied!`);
      } else {
        setDiscountPercent(0);
        setPromoApplied(false);
        toast.error("Invalid or expired promo code.");
      }
    } catch (err) {
      console.error("Promo check failed:", err);
      toast.error("Failed to apply promo code.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to place an order.");
      return navigate("/login");
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) return toast.error("Razorpay SDK failed to load.");

    const options = {
      key: "rzp_test_jhApF37AU6eIGX", // ✅ Test Key
      amount: Math.round(discountedTotal * 100), // in paisa
      currency: "INR",
      name: "Clothify Store",
      description: "Order Payment",
      image: "/logo.png",
      handler: async function (response) {
        try {
          await addDoc(collection(db, "Orders"), {
            userEmail: user.email,
            items: cartItems,
            total: parseFloat(discountedTotal.toFixed(2)),
            customerInfo: formData,
            promoCode: promoApplied ? promoCode.trim() : null,
            discountPercent,
            createdAt: serverTimestamp(),
            status: "paid",
            paymentId: response.razorpay_payment_id,
          });

          toast.success("✅ Order placed and payment successful!");
          clearCart();
          navigate("/order-confirmation");
        } catch (err) {
          console.error("Order saving failed:", err);
          toast.error("Payment successful but order save failed.");
        }
      },
      prefill: {
        name: formData.name,
        email: user.email,
        contact: formData.phone,
      },
      theme: {
        color: "#6366F1",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700 dark:text-white">
          Checkout
        </h2>

        <form onSubmit={handlePayment} className="space-y-5">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold dark:text-gray-300">Shipping Address</label>
            <input
              type="text"
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold dark:text-gray-300">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-semibold dark:text-gray-300">Promo Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={applyPromoCode}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="text-right text-lg font-semibold dark:text-white">
            Total: ₹{totalAmount}
            {discountPercent > 0 && (
              <>
                <p className="text-sm text-green-600">Discount: -{discountPercent}%</p>
                <p className="text-xl text-indigo-700 font-bold">
                  Final: ₹{discountedTotal.toFixed(2)}
                </p>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Pay & Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
