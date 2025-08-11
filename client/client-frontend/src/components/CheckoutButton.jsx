import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { db } from "../firebase";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const CheckoutButton = () => {
  const { cartItems, clearCart, getTotalAmount } = useCart();
  const { currentUser } = useAuth();
  const amount = getTotalAmount();

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_jhApF37AU6eIGX", // Your Key ID here
      currency: "INR",
      amount: amount * 100,
      name: "Clothify",
      description: "Thanks for your order!",
      handler: async function (response) {
        alert("✅ Payment Successful");

        try {
          await addDoc(collection(db, "Orders"), {
            userEmail: currentUser?.email,
            paymentId: response.razorpay_payment_id,
            amount,
            items: cartItems,
            status: "Paid",
            timestamp: Timestamp.now(),
          });

          clearCart(); // Empty cart after order
          alert("📦 Order Saved to Firestore");
        } catch (err) {
          alert("❌ Failed to save order");
          console.error(err);
        }
      },
      prefill: {
        name: currentUser?.displayName || "Guest",
        email: currentUser?.email,
        contact: "9999999999",
      },
      theme: { color: "#1f2937" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Pay ₹{amount}
    </button>
  );
};

export default CheckoutButton;
