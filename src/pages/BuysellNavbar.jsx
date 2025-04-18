import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import for navigation
import bgimg from "../assets/bgimg.png";  // Import the background image

const BuysellNavbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();  // Hook for navigation

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <div className="min-h-screen">
      {/* Search Bar */}
      <div className="bg-white py-6 z-10 relative shadow-md">
        <div className="container mx-auto flex justify-center">
          <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-lg p-2 shadow-md w-2/4">
            <input
              type="text"
              placeholder="Search products, categories, or brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 w-full rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 ml-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Static Background Image Section */}
      <div 
        className="relative w-full h-[450px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgimg})`,
          backgroundAttachment: "fixed",    // Keeps the image static
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Cards Container */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-10">
          
          {/* Card 1 */}
          <div className="bg-white rounded-sm shadow-lg p-10 max-w-xs w-80 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-4">Buy Books</h2>
            <p className="text-gray-600">Explore a wide range of second-hand books at great prices.</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate('/buy-books')}  // Navigate to the BuyBooks page
            >
              Browse Books
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-sm shadow-lg p-10 max-w-xs w-80 hover:shadow-xl transition">
            <h2 className="text-xl font-bold mb-4">Sell Books</h2>
            <p className="text-gray-600">Sell your old books online and make some cash easily!</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => navigate('/bookform')}  // Navigate to BookForm
            >
              Sell Now
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BuysellNavbar;
