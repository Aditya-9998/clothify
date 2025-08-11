import { format } from "date-fns";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { db } from "../../firebase";

const SalesReport = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "Orders"));
      const data = snapshot.docs.map((doc) => doc.data());

      setOrders(data);

      const total = data.reduce((sum, order) => sum + order.totalAmount, 0);
      setTotalRevenue(total);

      const salesByDate = {};
      data.forEach((order) => {
        const date = format(new Date(order.timestamp?.seconds * 1000), "yyyy-MM-dd");
        salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
      });

      const chartData = Object.entries(salesByDate).map(([date, amount]) => ({
        date,
        revenue: amount,
      }));

      setWeeklyData(chartData);
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-white">Sales Report</h2>

      {/* ✅ Total Revenue */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          ₹{totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* 📈 Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Weekly Sales</h3>
        {weeklyData.length === 0 ? (
          <p>No sales data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="revenue" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
