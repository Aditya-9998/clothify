//Checkout.jsx



import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { loadRazorpayScript } from "../utils/loadRazorpayScript";

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, clearCart, totalAmount } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const discountedTotal = totalAmount - (totalAmount * discountPercent) / 100;

  // Apply Promo Code
  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "DISCOUNT10") {
      setDiscountPercent(10);
      setPromoApplied(true);
    } else if (code === "DISCOUNT20") {
      setDiscountPercent(20);
      setPromoApplied(true);
    } else {
      alert("❌ Invalid Promo Code");
    }
  };

  const handlePayment = async () => {
    if (!user) return alert("⚠️ Please login first.");
    if (!formData.name || !formData.address || !formData.phone)
      return alert("⚠️ Please fill all details.");
    if (cartItems.length === 0) return alert("⚠️ Cart is empty.");

    setLoading(true);

    try {
      // Load Razorpay SDK
      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      // Create Razorpay order on backend
      const response = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: discountedTotal }),
      });

      const order = await response.json();
      if (!order.id) {
        alert("Failed to create order on backend");
        setLoading(false);
        return;
      }

      // Razorpay Checkout Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Clothify Store",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (paymentResponse) {
          // Save order into Firestore
          await addDoc(collection(db, "orders"), {
            uid: user.uid,
            userEmail: user.email,
            items: cartItems,
            total: discountedTotal,
            customerInfo: formData,
            promoCode: promoApplied ? promoCode.toUpperCase() : null,
            discountPercent,
            createdAt: serverTimestamp(),
            status: "paid",
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id,
            signature: paymentResponse.razorpay_signature,
          });

          alert("✅ Payment Successful! Order Placed.");
          clearCart();
        },

        prefill: {
          name: formData.name,
          email: user.email,
          contact: formData.phone,
        },
        theme: { color: "#4F46E5" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      {/* User Form */}
      <input className="border w-full p-2 mb-2"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

      <input className="border w-full p-2 mb-2"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

      <input className="border w-full p-2 mb-2"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

      {/* Promo Code */}
      <div className="flex gap-2 mt-3">
        <input className="border p-2 flex-1"
          placeholder="Promo Code"
          value={promoCode}
          disabled={promoApplied}
          onChange={(e) => setPromoCode(e.target.value)} />

        <button
          onClick={applyPromo}
          disabled={promoApplied}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {promoApplied ? "Applied" : "Apply"}
        </button>
      </div>

      {/* Order Summary */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold">Order Summary</h3>
        {cartItems.map((item) => (
          <p key={item.id}>
            {item.name} x {item.quantity} = ₹{item.price * item.quantity}
          </p>
        ))}
        <h3 className="font-bold mt-2">
          Total: ₹{discountedTotal.toFixed(2)}
        </h3>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full mt-4 bg-blue-600 text-white p-3 rounded"
      >
        {loading ? "Processing..." : `Pay Now ₹${discountedTotal}`}
      </button>
    </div>
  );
};

export default Checkout;
