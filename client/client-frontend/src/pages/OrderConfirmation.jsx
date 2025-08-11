// src/pages/OrderConfirmation.jsx

import { Link } from "react-router-dom";

const OrderConfirmation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
          ✅ Order Placed Successfully!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Thank you for shopping with <span className="font-semibold">Clothify</span>. Your order has been received and is being processed.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
