import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { loadRazorpayScript } from "../utils/loadRazorpayScript";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: totalAmount * 100,
      currency: "INR",
      name: "Clothify",
      description: "Order Payment",
      handler: async function (response) {
        await addDoc(collection(db, "orders"), {
          userEmail: user?.email,
          items: cartItems,
          total: totalAmount,
          paymentId: response.razorpay_payment_id,
          status: "Paid",
          createdAt: serverTimestamp(),
        });

        clearCart();
        alert("Payment Successful!");
      },
      theme: { color: "#2874F0" }, // Flipkart blue
    };

    const paymentObj = new window.Razorpay(options);
    paymentObj.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6">

        {/* LEFT: Cart items */}
        <div className="flex-1 bg-white p-6 shadow rounded-lg">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600 py-10 text-lg">
              🛒 Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      ₹{item.price} × {item.quantity}
                    </p>
                    <p className="text-indigo-600 font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          )}

          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="mt-4 px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* RIGHT: Price Summary Box */}
        {cartItems.length > 0 && (
          <div className="w-full md:w-80 bg-white p-6 shadow rounded-lg h-fit sticky top-4">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">
              Price Summary
            </h3>

            <div className="flex justify-between mb-2 text-gray-700">
              <span>Total Items</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="flex justify-between mb-4 text-gray-700">
              <span>Total Price</span>
              <span>₹{totalAmount}</span>
            </div>

            <hr className="my-3" />

            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Final Amount</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-green-600 text-white text-lg rounded-md hover:bg-green-700"
            >
              Pay Now ₹{totalAmount}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
