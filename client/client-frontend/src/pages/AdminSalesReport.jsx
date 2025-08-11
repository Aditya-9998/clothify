// src/pages/AdminSalesReport.jsx

import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { db } from "../firebase";

const AdminSalesReport = () => {
  const [monthlySales, setMonthlySales] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "Orders");
        const snapshot = await getDocs(ordersRef);
        const orders = snapshot.docs.map((doc) => doc.data());

        // Group orders by month
        const salesData = {};
        orders.forEach((order) => {
          const date = order.timestamp?.toDate?.(); // in case it's a Firestore Timestamp
          const month = date
            ? date.toLocaleString("default", { month: "short", year: "numeric" })
            : "Unknown";

          salesData[month] = (salesData[month] || 0) + order.totalAmount;
        });

        // Convert to array sorted by month
        const chartData = Object.entries(salesData).map(([month, total]) => ({
          month,
          total,
        }));

        setMonthlySales(chartData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Monthly Sales Report</h2>

      {monthlySales.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={monthlySales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No sales data available.</p>
      )}
    </div>
  );
};

export default AdminSalesReport;
