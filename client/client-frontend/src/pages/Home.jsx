import bgImage from "../assets/ecommerce-india.jpg";

const Home = () => {
  return (
    <div
      className="h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-60 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-2xl text-center max-w-md sm:max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 text-red-900">
          Welcome to Clothify
        </h1>
        <p className="text-base sm:text-xl text-red-800 font-medium">
          Apka Apna India ka e-Shop. Choose if you want one-stop shop for the
          best clothes online.
        </p>
      </div>
    </div>
  );
};

export default Home;
