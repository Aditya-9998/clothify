// ✅ src/pages/OrderHistory.jsx
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "Orders"),
          where("userEmail", "==", user.email)
        );
        const snapshot = await getDocs(q);
        const orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="mb-6 border rounded-lg p-4 shadow">
            <h3 className="font-semibold text-lg mb-2">Order ID: {order.id}</h3>
            <p className="text-gray-700">Status: {order.status}</p>
            <p className="text-gray-700">Total: ₹{order.total}</p>
            <p className="text-gray-700 mb-2">Email: {order.userEmail}</p>
            <ul className="space-y-2">
              {order.items?.map((item, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div className="flex gap-4 items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
