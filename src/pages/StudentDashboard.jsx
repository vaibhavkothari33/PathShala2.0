import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  BookOpen,
  ChevronDown,
  X,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [coachingCenters, setCoachingCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    rating: '',
    distance: '',
    priceRange: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Sample data - Replace with API call
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setCoachingCenters([
        {
          id: 1,
          name: "Excellence Academy",
          slug: "excellence-academy",
          subjects: ["Mathematics", "Physics", "Chemistry"],
          rating: 4.8,
          distance: "1.2",
          price: "₹2000",
          students: 120,
          image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Bennett_University_.jpg",
          location: "Sector 18, Noida",
          availability: "Mon-Sat, 9 AM - 7 PM"
        },
        {
          id: 2,
          name: "Science Hub",
          slug: "science-hub",
          subjects: ["Physics", "Chemistry", "Biology"],
          rating: 4.6,
          distance: "2.5",
          price: "₹2500",
          students: 150,
          image: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Bennett_University_.jpg",
          location: "Sector 15, Noida",
          availability: "Mon-Sat, 8 AM - 8 PM"
        },
        // Add more coaching centers...
      ]);
      setLoading(false);
    }, 1000);

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const filterOptions = {
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
    ratings: ["4+ Stars", "3+ Stars", "2+ Stars"],
    distance: ["0-2 km", "2-5 km", "5-10 km", "10+ km"],
    priceRange: ["₹0-1000", "₹1000-2000", "₹2000-5000", "₹5000+"]
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      subject: '',
      rating: '',
      distance: '',
      priceRange: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
              >
                Find Coaching Centers
              </motion.h1>
              {userLocation && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-600"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Near you</span>
                </motion.div>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                My Enrolled Courses
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search coaching centers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm hover:border-indigo-300 transition-all duration-200"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Filter className="h-5 w-5 mr-2 text-indigo-600" />
            <span className="font-medium text-gray-700">Filters</span>
            <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''} text-gray-500`} />
          </motion.button>
        </div>

        {/* Enhanced Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    value={filters.subject}
                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">All Subjects</option>
                    {filterOptions.subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Rating</option>
                    {filterOptions.ratings.map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>

                {/* Distance Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <select
                    value={filters.distance}
                    onChange={(e) => handleFilterChange('distance', e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Distance</option>
                    {filterOptions.distance.map(distance => (
                      <option key={distance} value={distance}>{distance}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Any Price</option>
                    {filterOptions.priceRange.map(price => (
                      <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Coaching Centers Grid */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full"
            />
            <p className="mt-4 text-gray-600">Loading coaching centers...</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coachingCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{center.name}</h3>
                    <div className="px-3 py-1 bg-white rounded-full text-indigo-600 font-medium text-sm">
                      {center.price}/month
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 font-medium">{center.rating}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="ml-1 text-gray-600">{center.students} students</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="text-sm">{center.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="text-sm">{center.availability}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {center.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors duration-200"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <Link 
                    to={`/coaching/${center.slug}`}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;