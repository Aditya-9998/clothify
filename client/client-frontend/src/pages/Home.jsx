//home.jsx


import { Link } from "react-router-dom";
import "./Home.css";

const tshirtImg = "/assets/T-shirt.webp";
const jacketImg = "/assets/danim.webp";
const jeansImg = "/assets/jeans.webp";

const categories = [
  { id: 1, name: "T-Shirts", img: tshirtImg },
  { id: 2, name: "Jackets", img: jacketImg },
  { id: 3, name: "Jeans", img: jeansImg },
];



const Home = () => {
  return (
    <div className="w-full relative overflow-hidden">
      {/* Floating Dots */}
      <div className="bubbles">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} style={{ "--i": i }}></span>
        ))}
      </div>

      {/* Luxury Fashion Section */}
      <section className="min-h-[500px] flex flex-col justify-center items-center text-center px-4 relative z-10 bg-gradient-to-r from-pink-100 via-blue-100 to-pink-100 animate-gradient">
        <h1 className="home-heading shine-text mb-4">
          Clothify Fashion Collection
        </h1>
        <p className="text-lg md:text-xl mb-2 text-gray-800">
          Welcome to Clothify! Apka Apna India ka luxury e-Shop. Explore the finest clothes online in one place.
        </p>
        <p className="text-lg md:text-xl mb-6 text-gray-800">
          Discover premium clothing that defines your style
        </p>
        <Link
          to="/shop"
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Shop Now ✨
        </Link>
      </section>

      {/* Shop by Category */}
      <section className="bg-white py-12 px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.name}`}
              className="flex flex-col items-center text-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-32 h-32 object-cover mb-3 rounded-full"
              />
              <h3 className="text-lg font-medium">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
