import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { db } from "../firebase";
import { loadRazorpayScript } from "../utils/razorpay";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user: currentUser } = useAuth();  // ✅ fixed

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("❌ Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_jhApF37AU6eIGX",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Clothify Store",
      description: "Purchase from Clothify",
      image: "/logo.png",
      handler: async function (response) {
        try {
          const orderRef = collection(db, "Orders");
          await addDoc(orderRef, {
            userEmail: currentUser?.email || "Guest",
            items: cartItems,
            total: totalAmount,
            paymentId: response.razorpay_payment_id,
            status: "Paid",
            createdAt: serverTimestamp(),
          });
          console.log("📦 Order saved to Firestore");
          alert("✅ Payment Successful & Order Placed!");
          clearCart();
        } catch (error) {
          console.error("❌ Firestore Error:", error);
          alert("Order placed but failed to save in database.");
        }
      },
      prefill: {
        name: currentUser?.displayName || "Aditya Kumar",
        email: currentUser?.email || "onlygamingid.9798@gmail.com",
        contact: "7520506901",
      },
      theme: {
        color: "#4F46E5",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">🛒 Your cart is empty.</p>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              <div>
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right text-lg font-semibold">
            Total: ₹{totalAmount}
          </div>

          <div className="flex justify-between items-center mt-4 gap-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Cart
            </button>

            <button
              onClick={handlePayment}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pay Now ₹{totalAmount}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
