// src/pages/Orders.jsx
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-700">You have no past orders.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {orders.map((order, index) => (
            <div key={index} className="bg-white shadow rounded p-4">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">Order #{index + 1}</h3>
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Phone:</strong> {order.phone}</p>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <h4 className="font-semibold mt-4">Items:</h4>
              <ul className="list-disc ml-6">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} (x{item.quantity}) - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
