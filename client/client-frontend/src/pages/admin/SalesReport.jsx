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
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, "Orders"));
      const data = snapshot.docs.map((doc) => doc.data());

      setOrders(data);

      // ⭐ SAFE TOTAL REVENUE
      const total = data.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );
      setTotalRevenue(total);

      // ⭐ SAFELY HANDLE MISSING TIMESTAMP
      const salesByMonth = {};

      data.forEach((order) => {
        const ts = order.timestamp;

        if (!ts || !ts.seconds) return; // skip invalid orders

        const dateObj = new Date(ts.seconds * 1000);

        // SAFE monthly label
        const monthName = format(dateObj, "MMM");

        salesByMonth[monthName] =
          (salesByMonth[monthName] || 0) + (order.totalAmount || 0);
      });

      const chartData = Object.entries(salesByMonth).map(
        ([month, revenue]) => ({
          month,
          revenue,
        })
      );

      setMonthlyData(chartData);
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
      <h2 className="text-3xl font-bold mb-4 text-indigo-700 dark:text-white">
        Monthly Sales Report
      </h2>

      {/* ⭐ Total Revenue Card */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-2">Total Revenue</h3>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          ₹{totalRevenue.toFixed(2)}
        </p>
      </div>

      {/* ⭐ Monthly Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Monthly Sales</h3>

        {monthlyData.length === 0 ? (
          <p>No sales data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
