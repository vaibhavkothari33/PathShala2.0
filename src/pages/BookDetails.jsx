import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import books from './booksdata';
import { FiArrowLeft, FiShoppingCart, FiUser, FiMail, FiPhone, FiMapPin, FiStar } from 'react-icons/fi';

const BookDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSellerInfo, setShowSellerInfo] = useState(false);

  useEffect(() => {
    const bookId = parseInt(slug.split('-').pop());
    const foundBook = books.find(book => book.id === bookId);

    if (foundBook) {
      setBook(foundBook);
      const related = books
        .filter(item => item.category === foundBook.category && item.id !== foundBook.id)
        .slice(0, 3);
      setRelatedBooks(related);
    }

    setIsLoading(false);
  }, [slug]);

  const generateSlug = (title, id) => {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/buy"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition group"
        >
          <FiArrowLeft className="mr-2 group-hover:translate-x-1 transition-transform" />
          <span className="font-medium">Back to Marketplace</span>
        </button>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-8">
              <img 
                src={book.coverImage || "/api/placeholder/300/450"} 
                alt={book.title}
                className="max-h-96 object-cover shadow-lg rounded-lg transform transition-all duration-300 hover:scale-105"
              />
            </div>

            <div className="md:w-2/3 p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  book.condition === 'Like New' ? 'bg-green-100 text-green-800' :
                  book.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                  book.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                  book.condition === 'Used' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {book.condition}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium">
                  {book.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-2 text-gray-800">{book.title}</h1>
              <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

              <div className="flex items-center mb-6">
                <div className="text-3xl font-bold text-blue-600 mr-4">₹{book.price.toFixed(2)}</div>
                <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  In Stock
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Description</h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Seller:</span> 
                    <span className="font-medium ml-2 text-gray-800">{book.seller}</span>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <span className="text-gray-500">ISBN:</span> 
                    <span className="font-medium ml-2 text-gray-800">{book.isbn || 'N/A'}</span>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Published:</span> 
                    <span className="font-medium ml-2 text-gray-800">{book.publishedDate || 'N/A'}</span>
                  </div>
                  <div className="border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Pages:</span> 
                    <span className="font-medium ml-2 text-gray-800">{book.pages || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setShowSellerInfo(!showSellerInfo)} 
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-medium"
                >
                  <FiShoppingCart className="mr-2" />
                  {showSellerInfo ? 'Hide Contact Info' : 'Contact Seller'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showSellerInfo && (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8 p-6">
            <div className="flex flex-col md:flex-row items-start">
              <div className="md:w-1/3 pr-8">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{book.seller || 'Seller'}</h2>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span className="font-medium mr-1">4.8</span>
                      <span className="text-gray-500 text-sm">(42 ratings)</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-700 mb-2"><span className="font-medium">Member since:</span> 2023</p>
                  <p className="text-gray-700 mb-2"><span className="font-medium">Books sold:</span> 24</p>
                  <p className="text-gray-700"><span className="font-medium">Response time:</span> ~2 hours</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-2 bg-green-100 rounded-full w-full">
                    <div className="h-2 bg-green-500 rounded-full w-4/5"></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-500">80% response rate</span>
                </div>
              </div>
              
              <div className="md:w-2/3 md:border-l md:border-gray-200 md:pl-8 mt-6 md:mt-0">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <FiPhone className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-gray-600">{book.phone || '(555) 123-4567'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <FiMail className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">{book.email || 'seller@example.com'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mr-4">
                      <FiMapPin className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">{book.address || '123 Book St, Reading, CA 90210'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Quick tip:</span> When contacting the seller, mention that you found this listing on BookSwap to establish trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {relatedBooks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Related Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBooks.map((relatedBook) => {
                const bookSlug = generateSlug(relatedBook.title, relatedBook.id);
                return (
                  <div key={relatedBook.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <Link to={`/book/${bookSlug}`} className="block">
                      <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={relatedBook.coverImage || "/api/placeholder/200/300"} 
                          alt={relatedBook.title}
                          className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 m-2 rounded-full text-sm font-medium">
                          ${relatedBook.price.toFixed(2)}
                        </div>
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/book/${bookSlug}`} className="block">
                        <h3 className="text-lg font-semibold mb-1 hover:text-blue-600 transition-colors">{relatedBook.title}</h3>
                      </Link>
                      <p className="text-gray-600 text-sm">by {relatedBook.author}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;