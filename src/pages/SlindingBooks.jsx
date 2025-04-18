import React, { useEffect, useState } from "react";
import { Client, Databases } from "appwrite";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SlidingBooks = () => {
  const [books, setBooks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Initialize Appwrite Client
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const client = new Client()
          .setEndpoint("https://cloud.appwrite.io/v1")
          .setProject("67d01f2c00009b5761f5");  // Your project ID

        const db = new Databases(client);
        const response = await db.listDocuments(
          "67d01f6a003bc6b65a7d",      // Your database ID
          "67d01fd0003c9a150f73"       // Your collection ID
        );

        setBooks(response.documents);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  // ✅ Auto-sliding effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % books.length);
    }, 3000);  // Slides every 3 seconds

    return () => clearInterval(interval);
  }, [books.length]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6">Recently Added Books</h2>

      <div className="relative w-full h-[420px] overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute w-full h-full flex justify-center items-center"
          >
            {books.length > 0 && (
              <div className="flex gap-10">
                {/* ✅ Display 3 cards at a time */}
                {books
                  .slice(currentIndex, currentIndex + 3)
                  .map((book) => (
                    <Link
                      to={`/book/${book.$id}`}
                      key={book.$id}
                      className="block bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 w-80 h-96"
                    >
                      {/* ✅ Display book image */}
                      {book.images && book.images.length > 0 ? (
                        <img
                          src="https://m.media-amazon.com/images/I/5102SmSAuqL._SY445_SX342_.jpg"
                          alt={book.title}
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-300 flex items-center justify-center">
                          No Image
                        </div>
                      )}

                      {/* ✅ Book Details */}
                      <div className="p-4">
                        <h3 className="text-lg font-bold truncate">{book.title}</h3>
                        <p className="text-gray-600 line-through">₹{parseInt(book.price * 1.2)}</p>
                        <p className="text-green-600 font-bold">₹{book.price}</p>
                        <p className="text-sm text-gray-500">Condition: {book.condition}</p>
                        <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mt-2">
                          Buy Now
                        </button>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ✅ "Explore All Books" button */}
      <div className="text-center mt-8">
        <Link
          to="/explore-books"
          className="bg-yellow-400  text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-500 transition"
        >
          Explore all used books
        </Link>
      </div>
    </div>
  );
};

export default SlidingBooks;
