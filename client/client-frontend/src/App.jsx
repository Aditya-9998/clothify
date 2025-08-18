// ✅ src/App.jsx
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast"; // ✅ import toast

// Pages
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Shop from "./pages/Shop";

// Admin Pages
import AdminContacts from "./pages/AdminContacts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSalesReport from "./pages/AdminSalesReport";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all duration-300">
      {/* ✅ Navbar fixed at the top */}
      <Navbar />

      {/* ✅ Main Content */}
      <main className="flex-grow pt-16">
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* 🔒 Protected User Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <ProtectedRoute adminOnly>
                <AdminSalesReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <ProtectedRoute adminOnly>
                <AdminContacts />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* ✅ Footer always at bottom */}
      <Footer />

      {/* ✅ Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#131921',
            color: '#fff',
            fontWeight: '500',
          },
        }}
      />
    </div>
  );
};

export default App;
