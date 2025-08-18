import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { db } from "../firebase";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import toast from "react-hot-toast"; // ✅ import toast

const CheckoutButton = () => {
  const { cartItems, clearCart, getTotalAmount } = useCart();
  const { currentUser } = useAuth();
  const amount = getTotalAmount();

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("❌ Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_jhApF37AU6eIGX",
      currency: "INR",
      amount: amount * 100,
      name: "Clothify",
      description: "Thanks for your order!",
      handler: async function (response) {
        toast.success("✅ Payment Successful");

        try {
          await addDoc(collection(db, "Orders"), {
            userEmail: currentUser?.email,
            paymentId: response.razorpay_payment_id,
            amount,
            items: cartItems,
            status: "Paid",
            timestamp: Timestamp.now(),
          });

          clearCart();
          toast.success("📦 Order saved to Firestore!");
        } catch (err) {
          toast.error("❌ Failed to save order");
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
