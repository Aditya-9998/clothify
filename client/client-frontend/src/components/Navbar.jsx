// src/components/Navbar.jsx
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import ThemeToggle from "../contexts/ThemeToggle";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logout successful!");
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-800 dark:bg-gray-900 text-white dark:text-gray-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-white dark:text-yellow-200 hover:text-yellow-300"
        >
          Clothify
        </Link>

        <div className="flex items-center gap-5 text-sm sm:text-base">
          <Link to="/" className="hover:text-yellow-300 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-yellow-300 transition">
            Shop
          </Link>
          <Link to="/about" className="hover:text-yellow-300 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-yellow-300 transition">
            Contact
          </Link>
          <Link to="/profile" className="hover:text-yellow-300 transition">
            Profile
          </Link>

          {/* ✅ Admin-only link */}
          {isAdmin && (
            <Link to="/admin/sales" className="hover:text-yellow-400">
              📊 Sales Report
            </Link>
          )}

          <Link to="/cart" className="relative hover:text-yellow-300 transition">
            🛒 Cart
            {cartItemCount > 0 && (
              <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link to="/admin" className="hover:text-yellow-300 transition">
              🔧 Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-300 transition">
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLogout}
                className="hover:text-red-300 transition"
              >
                Logout
              </button>
              <span className="text-gray-300 text-xs sm:text-sm hidden sm:inline-block">
                ☠️ {user.email}
              </span>
            </>
          )}

          {/* 🌙 Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
