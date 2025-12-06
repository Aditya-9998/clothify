const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-800 text-white text-center py-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide mb-2">
          About Clothify
        </h1>
        <p className="text-lg md:text-xl font-light">
          Curating luxury fashion experiences since 2017
        </p>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:w-1/2 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Clothify began with a simple idea: to make luxury fashion
              accessible to everyone. We started in a small studio, driven by a
              passion for quality craftsmanship and timeless design. Our journey
              has been about connecting with artisans and designers who share
              our vision, building a community that values elegance and style.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Over the years, we've grown from a small online store to a leading 
              platform for luxury fashion, serving customers worldwide. Every 
              piece in our collection is handpicked to ensure it meets our high 
              standards of quality and style. We believe that true luxury is 
              not just about the price tag, but about the story behind each item.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop"
              alt="Clothify Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600 mb-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 15.656L5.344 12l1.412-1.414L11 14.83l6.244-6.244 1.414 1.414L11 17.656z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Quality First
              </h3>
              <p className="text-gray-600">
                We are committed to delivering the highest quality products,
                ensuring every item meets our strict standards.
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600 mb-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path
                  fillRule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clipRule="evenodd"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sustainability
              </h3>
              <p className="text-gray-600">
                Our practices are designed to be environmentally friendly, from
                sourcing materials to our packaging.
              </p>
            </div>

            <div className="flex flex-col items-center p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-600 mb-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 15a2 2 0 11-4 0v3h4v-3zM16 17a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 012-2h2a2 2 0 012 2v2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Customer First
              </h3>
              <p className="text-gray-600">
                We prioritize our customers, offering excellent service and a
                seamless shopping experience.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
