// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-0">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        
        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-bold mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/shop" className="hover:text-yellow-400">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
            {/** Optional Profile Link for logged in users */}
            <li><Link to="/profile" className="hover:text-yellow-400">Profile</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h2 className="text-xl font-bold mb-3">Customer Service</h2>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-yellow-400">Size Guide</Link></li>
            <li><Link to="#" className="hover:text-yellow-400">Returns</Link></li>
            <li><Link to="#" className="hover:text-yellow-400">Shipping</Link></li>
            <li><Link to="#" className="hover:text-yellow-400">FAQ</Link></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h2 className="text-xl font-bold mb-3">About Clothify</h2>
          <p className="text-gray-400 leading-relaxed">
            Your one-stop shop for stylish clothing. Discover the latest fashion trends 
            with comfort and quality. We bring you closer to your perfect style.
          </p>
        </div>

        {/* Social */}
        <div>
          <h2 className="text-xl font-bold mb-3">Follow Us</h2>
          <div className="flex justify-center md:justify-start gap-6 text-2xl">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-blue-500 transition-colors"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-sky-400 transition-colors"
            >
              <FaXTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} Clothify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
