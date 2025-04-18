// Buy.jsx - Main marketplace page with improved filters
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import books from './booksdata';
import { FiSearch, FiFilter, FiChevronDown, FiShoppingCart, FiHeart } from 'react-icons/fi';

const Buy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    condition: 'All',
    priceRange: 'All',
    sort: 'newest'
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Get unique categories and conditions for filter options
  const categories = ['All', ...new Set(books.map(book => book.category))];
  const conditions = ['All', ...new Set(books.map(book => book.condition))];
  
  // Price range options
  const priceRanges = {
    'All': { min: 0, max: Infinity },
    'Under $10': { min: 0, max: 10 },
    '$10 - $20': { min: 10, max: 20 },
    '$20 - $30': { min: 20, max: 30 },
    'Over $30': { min: 30, max: Infinity }
  };

  // Sort options
  const sortOptions = {
    'newest': (a, b) => b.id - a.id,
    'price-low': (a, b) => a.price - b.price,
    'price-high': (a, b) => b.price - a.price,
    'title-az': (a, b) => a.title.localeCompare(b.title),
    'title-za': (a, b) => b.title.localeCompare(a.title)
  };

  // Count active filters for badge
  useEffect(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.condition !== 'All') count++;
    if (filters.priceRange !== 'All') count++;
    if (searchTerm) count++;
    setActiveFilters(count);
  }, [filters, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'All',
      condition: 'All',
      priceRange: 'All',
      sort: 'newest'
    });
    setSearchTerm('');
  };

  // Toggle filter sidebar on mobile
  const toggleFilters = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Generate slug for book titles
  const generateSlug = (title, id) => {
    return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${id}`;
  };

  // Filter and sort books
  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category === 'All' || book.category === filters.category;
      const matchesCondition = filters.condition === 'All' || book.condition === filters.condition;
      const { min, max } = priceRanges[filters.priceRange];
      const matchesPrice = book.price >= min && book.price <= max;
      
      return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
    })
    .sort(sortOptions[filters.sort]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">Book Marketplace</h1>
        <p className="text-gray-600 text-center mb-8">Find and purchase used books from our community</p>
        
        {/* Enhanced Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, author or keyword..."
              className="w-full p-4 pl-12 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="w-5 h-5 text-gray-500 absolute left-4 top-4" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={toggleFilters}
            className="w-full bg-white border border-gray-200 shadow-sm rounded-full p-4 flex justify-between items-center"
          >
            <span className="font-medium flex items-center">
              <FiFilter className="mr-2" />
              Filters
              {activeFilters > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </span>
            <FiChevronDown className={`transition-transform ${isFilterVisible ? 'transform rotate-180' : ''}`} />
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Filters Sidebar */}
          <div className={`${isFilterVisible ? 'block' : 'hidden'} lg:block lg:w-1/4 transition-all duration-300`}>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Reset All
                </button>
              </div>
              
              {/* Sort Selection (Mobile) */}
              <div className="mb-6 lg:hidden">
                <h3 className="font-medium mb-3 text-gray-700">Sort by</h3>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full border rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title-az">Title: A to Z</option>
                  <option value="title-za">Title: Z to A</option>
                </select>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Category</h3>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(category => (
                    <div 
                      key={category} 
                      onClick={() => handleFilterChange('category', category)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        filters.category === category 
                          ? 'bg-blue-50 border-blue-500 border text-blue-700 font-medium' 
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Condition Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Condition</h3>
                <div className="grid grid-cols-1 gap-2">
                  {conditions.map(condition => (
                    <div 
                      key={condition} 
                      onClick={() => handleFilterChange('condition', condition)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        filters.condition === condition 
                          ? 'bg-blue-50 border-blue-500 border text-blue-700 font-medium' 
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {condition}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700">Price Range</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.keys(priceRanges).map(range => (
                    <div 
                      key={range} 
                      onClick={() => handleFilterChange('priceRange', range)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        filters.priceRange === range 
                          ? 'bg-blue-50 border-blue-500 border text-blue-700 font-medium' 
                          : 'bg-gray-50 border border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {range}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active filters summary */}
              {activeFilters > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg mt-4">
                  <h4 className="font-medium text-blue-700 mb-2">Active Filters:</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.category !== 'All' && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {filters.category}
                        <button 
                          onClick={() => handleFilterChange('category', 'All')}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.condition !== 'All' && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {filters.condition}
                        <button 
                          onClick={() => handleFilterChange('condition', 'All')}
                          className="ml-1"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.priceRange !== 'All' && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                        {filters.priceRange}
                        <button 
                          onClick={() => handleFilterChange('priceRange', 'All')}
                          className="ml-1"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                        "{searchTerm}"
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="ml-1"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Books Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{filteredBooks.length}</span> results
                </p>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                <label className="text-gray-600">Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="title-az">Title: A to Z</option>
                  <option value="title-za">Title: Z to A</option>
                </select>
              </div>
            </div>
            
            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book) => {
                  const bookSlug = generateSlug(book.title, book.id);
                  return (
                    <div key={book.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <Link to={`/book/${bookSlug}`} className="block">
                        <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                          <img 
                            src={book.coverImage || "/api/placeholder/200/300"} 
                            alt={book.title}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-3 rounded-full text-sm font-medium">
                            ${book.price.toFixed(2)}
                          </div>
                        </div>
                      </Link>
                      <div className="p-5">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            book.condition === 'Like New' ? 'bg-green-100 text-green-800' :
                            book.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                            book.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                            book.condition === 'Used' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {book.condition}
                          </span>
                          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                            {book.category}
                          </span>
                        </div>
                        <Link to={`/book/${bookSlug}`} className="block">
                          <h2 className="text-xl font-semibold mb-1 line-clamp-1 hover:text-blue-600 transition-colors">{book.title}</h2>
                        </Link>
                        <p className="text-gray-600 mb-2 text-sm">by {book.author}</p>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{book.description}</p>
                        <div className="text-xs text-gray-500 mb-4">
                          <p>Seller: {book.seller}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
                            <FiShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                          </button>
                          <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                            <FiHeart className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No books found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={resetFilters}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buy;