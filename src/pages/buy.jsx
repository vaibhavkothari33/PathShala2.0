import React, { useState } from 'react';
import books from './booksdata';

const Buy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    condition: 'All',
    priceRange: 'All',
    sort: 'newest'
  });
  const [isFilterVisible, setIsFilterVisible] = useState(true);

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
        <h1 className="text-3xl font-bold mb-2 text-center">Book Marketplace</h1>
        <p className="text-gray-600 text-center mb-8">Find and purchase used books from our community</p>
        
        {/* Search Bar */}
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, author or keyword..."
              className="w-full p-3 pl-10 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={toggleFilters}
            className="w-full bg-white border border-gray-300 shadow-sm rounded-md p-3 flex justify-between items-center"
          >
            <span className="font-medium">Filters</span>
            <svg 
              className={`w-5 h-5 transition-transform ${isFilterVisible ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`${isFilterVisible ? 'block' : 'hidden'} lg:block lg:w-1/4`}>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button 
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Reset All
                </button>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        checked={filters.category === category}
                        onChange={() => handleFilterChange('category', category)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor={`category-${category}`} className="text-gray-700">{category}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Condition Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Condition</h3>
                <div className="space-y-2">
                  {conditions.map(condition => (
                    <div key={condition} className="flex items-center">
                      <input
                        type="radio"
                        id={`condition-${condition}`}
                        name="condition"
                        checked={filters.condition === condition}
                        onChange={() => handleFilterChange('condition', condition)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor={`condition-${condition}`} className="text-gray-700">{condition}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-700">Price Range</h3>
                <div className="space-y-2">
                  {Object.keys(priceRanges).map(range => (
                    <div key={range} className="flex items-center">
                      <input
                        type="radio"
                        id={`price-${range}`}
                        name="priceRange"
                        checked={filters.priceRange === range}
                        onChange={() => handleFilterChange('priceRange', range)}
                        className="mr-2 accent-blue-600"
                      />
                      <label htmlFor={`price-${range}`} className="text-gray-700">{range}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Books Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-gray-600">
                  Showing <span className="font-medium">{filteredBooks.length}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-600">Sort by:</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="border rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {filteredBooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                      <img 
                        src={book.coverImage || "/api/placeholder/200/300"} 
                        alt={book.title}
                        className="h-full object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
                        ${book.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-1 mb-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          book.condition === 'Like New' ? 'bg-green-100 text-green-800' :
                          book.condition === 'Excellent' ? 'bg-blue-100 text-blue-800' :
                          book.condition === 'Good' ? 'bg-yellow-100 text-yellow-800' :
                          book.condition === 'Used' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {book.condition}
                        </span>
                        <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">
                          {book.category}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold mb-1 line-clamp-1">{book.title}</h2>
                      <p className="text-gray-600 mb-2 text-sm">by {book.author}</p>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{book.description}</p>
                      <div className="text-xs text-gray-500 mb-4">
                        <p>Seller: {book.seller}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          Buy Now
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No books found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Reset Filters
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