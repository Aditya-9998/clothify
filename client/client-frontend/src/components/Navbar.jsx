// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Moon, Sun, Heart } from "lucide-react"; // ❤️ Heart icon added
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./Navbar.css";

const Navbar = ({ toggleTheme, isDark }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout, isAdmin } = useAuth();
  const { cartItemCount, cartItems = [] } = useCart();

  const count =
    typeof cartItemCount === "number"
      ? cartItemCount
      : cartItems.reduce((sum, it) => sum + (it.quantity || 1), 0);

  const onCartClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
    } else {
      navigate("/cart");
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-[#131921] text-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="nav-logo shine-text text-2xl font-bold">
            Clothify✨
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
            <Link to="/shop" className="hover:text-yellow-300 transition">Shop</Link>
            {!isAdmin && (
              <Link to="/contact" className="hover:text-yellow-300 transition">Contact</Link>
            )}
            <Link to="/about" className="hover:text-yellow-300 transition">About</Link>

            {isAdmin && (
              <>
                <Link to="/admin/sales" className="hover:text-yellow-300 transition">Sales</Link>
                <Link to="/admin" className="hover:text-yellow-300 transition">Dashboard</Link>
              </>
            )}

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="hover:text-yellow-300 transition"
                >
                  Hey, {user.displayName || user.email}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-[#232f3e] text-white shadow-lg rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-yellow-400 hover:text-black"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate("/wishlist");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-pink-400 hover:text-black"
                    >
                      ❤️ Wishlist
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-red-400 hover:text-black"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="hover:text-yellow-300 transition">
                Login/Register
              </Link>
            )}

            {/* Cart */}
            <button onClick={onCartClick} className="relative flex items-center hover:text-yellow-300 transition">
              <ShoppingCart className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#131921] text-xs rounded-full px-1.5 py-0.5">
                  {count}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            {typeof toggleTheme === "function" && (
              <button onClick={toggleTheme} className="ml-2 hover:text-yellow-300 transition">
                {isDark ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6" />}
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen((s) => !s)}
              className="hover:text-yellow-300 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#232f3e] text-white shadow-md">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">Shop</Link>
            {!isAdmin && (
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">Contact</Link>
            )}
            <Link to="/about" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">About</Link>

            {isAdmin && (
              <>
                <Link to="/admin/sales" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">Sales</Link>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">Dashboard</Link>
              </>
            )}

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left hover:text-yellow-300"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/wishlist");
                    setIsOpen(false);
                  }}
                  className="block w-full text-left hover:text-pink-400"
                >
                  ❤️ Wishlist
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block hover:text-yellow-300">
                Login/Register
              </Link>
            )}

            {/* Cart in Mobile */}
            <button
              onClick={onCartClick}
              className="block flex items-center hover:text-yellow-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" /> Cart
              {count > 0 && (
                <span className="ml-2 bg-yellow-400 text-[#131921] text-xs rounded-full px-2 py-0.5">
                  {count}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            {typeof toggleTheme === "function" && (
              <button onClick={toggleTheme} className="flex items-center space-x-2 hover:text-yellow-300">
                {isDark ? <Sun className="h-6 w-6 text-yellow-400" /> : <Moon className="h-6 w-6" />}
                <span>Toggle Theme</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
