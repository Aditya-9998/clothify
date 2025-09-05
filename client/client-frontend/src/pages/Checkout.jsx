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

  // Apply promo code
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

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!user) {
      alert("⚠️ Please log in to checkout.");
      return;
    }

    if (!formData.name || !formData.address || !formData.phone) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    if (cartItems.length === 0) {
      alert("⚠️ Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        alert("❌ Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 🔹 Step 1: Create order on backend
      const orderResponse = await fetch("http://localhost:5000/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: discountedTotal }), // send amount in rupees
      });

      const order = await orderResponse.json();

      if (!order.id) {
        alert("❌ Failed to create order on server.");
        setLoading(false);
        return;
      }

      // 🔹 Step 2: Open Razorpay checkout with order_id
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, // only Key_ID here
        amount: order.amount,
        currency: order.currency,
        name: "Clothify",
        description: "Order Payment",
        order_id: order.id, // required from backend
        handler: async (response) => {
          try {
            // Save order to Firestore
            await addDoc(collection(db, "orders"), {
              uid: user.uid,
              userEmail: user.email,
              items: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
              })),
              total: parseFloat(discountedTotal.toFixed(2)),
              customerInfo: formData,
              promoCode: promoApplied ? promoCode.trim().toUpperCase() : null,
              discountPercent,
              createdAt: serverTimestamp(),
              status: "paid",
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            clearCart();
            alert("✅ Payment Successful! Order placed.");
          } catch (err) {
            console.error("Error saving order:", err);
            alert("⚠️ Payment succeeded but order save failed!");
          }
        },
        prefill: {
          name: formData.name,
          email: user.email,
          contact: formData.phone,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("❌ Something went wrong during payment!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

      {/* Form */}
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border px-3 py-2 rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          className="w-full border px-3 py-2 rounded"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Phone"
          className="w-full border px-3 py-2 rounded"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </form>

      {/* Promo Code */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Promo Code"
          className="flex-1 border px-3 py-2 rounded"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={promoApplied}
        />
        <button
          type="button"
          className={`px-4 py-2 rounded ${promoApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
          onClick={applyPromo}
          disabled={promoApplied}
        >
          {promoApplied ? "Applied" : "Apply"}
        </button>
      </div>

      {/* Order Summary */}
      <div className="mt-6 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
        {cartItems.length > 0 ? (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
        <div className="mt-4 font-bold text-lg">
          Total: ₹{discountedTotal.toFixed(2)}
          {promoApplied && (
            <span className="ml-2 text-green-600">(Promo Applied)</span>
          )}
        </div>
      </div>

      {/* Pay Now Button */}
      <button
        type="button"
        className="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
        onClick={handlePayment}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Checkout;
