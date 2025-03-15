import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, Star, Clock, Users, BookOpen, ChevronDown, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { databases } from '../config/appwrite'; // Import Appwrite databases
import { toast } from 'react-hot-toast';

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

  // Fetch coaching centers from Appwrite
  useEffect(() => {
    fetchCoachingCenters();

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

  const fetchCoachingCenters = async () => {
    setLoading(true); // Set loading state before fetching
  
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID
      );
  
      console.log('Fetched coaching centers:', response.documents);
  
      const formattedCenters = response.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name || 'Unnamed Center',
        description: doc.description || '',
        subjects: doc.subjects && Array.isArray(doc.subjects)
          ? doc.subjects
          : doc.batches_subjects && Array.isArray(doc.batches_subjects)
            ? [...new Set(doc.batches_subjects.flat())]
            : [],
        rating: doc.rating || 4.5,
        reviews: doc.reviews || 0,
        price: doc.batches_monthlyFee && Array.isArray(doc.batches_monthlyFee)
          ? `₹${doc.batches_monthlyFee[0]}`
          : "₹2000",
        students: doc.totalStudents || 0,
        image: doc.images_coverImage
          ? `${import.meta.env.VITE_APPWRITE_STORAGE_URL}/${doc.images_coverImage}`
          : "https://upload.wikimedia.org/wikipedia/commons/b/b0/Bennett_University_.jpg",
        location: doc.address || "Address not available",
        city: doc.city || "",
        availability: doc.batches_timing?.length
          ? doc.batches_timing[0]
          : "Mon-Sat, 9 AM - 7 PM",
        contact: {
          phone: doc.phone || "",
          email: doc.email || "",
          website: doc.website || ""
        },
        facilities: doc.facilities || [],
        batches: Array.isArray(doc.batches_name)
          ? doc.batches_name.map((name, i) => ({
              name,
              subjects: doc.batches_subjects && Array.isArray(doc.batches_subjects)
                ? doc.batches_subjects[i] || []
                : [],
              timing: doc.batches_timing?.[i] || '',
              capacity: doc.batches_capacity?.[i] || '',
              availableSeats: doc.batches_availableSeats?.[i] || '',
              monthlyFee: doc.batches_monthlyFee?.[i] || '',
              duration: doc.batches_duration?.[i] || '',
            }))
          : [],
        faculty: Array.isArray(doc.faculty_name)
          ? doc.faculty_name.map((name, i) => ({
              name,
              qualification: doc.faculty_qualification?.[i] || '',
              experience: doc.faculty_experience?.[i] || '',
              subject: doc.faculty_subject?.[i] || '',
              bio: doc.faculty_bio?.[i] || '',
              image: Array.isArray(doc.faculty_image)
                ? `${import.meta.env.VITE_APPWRITE_STORAGE_URL}/${doc.faculty_image[i]}`
                : null,
            }))
          : [],
        establishedYear: doc.establishedYear || '',
        classroomImages: Array.isArray(doc.images_classroomImages)
          ? doc.images_classroomImages.map(imgId =>
              `${import.meta.env.VITE_APPWRITE_STORAGE_URL}/${imgId}`
            )
          : [],
        slug: doc.slug || doc.name?.toLowerCase().replace(/\s+/g, '-') || doc.$id
      }));
  
      console.log('Formatted centers:', formattedCenters);
      setCoachingCenters(formattedCenters);
    } catch (error) {
      console.error('Error fetching coaching centers:', error);
      toast.error('Failed to load coaching centers');
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };
  
  // Filter and search functionality
  const getFilteredCenters = () => {
    return coachingCenters.filter(center => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchName = center.name.toLowerCase().includes(searchLower);
        const matchCity = center.city.toLowerCase().includes(searchLower);
        const matchSubjects = center.subjects.some(subject =>
          subject.toLowerCase().includes(searchLower)
        );
        if (!matchName && !matchCity && !matchSubjects) return false;
      }

      // Subject filter
      if (filters.subject && !center.subjects.includes(filters.subject)) {
        return false;
      }

      // Rating filter
      if (filters.rating) {
        const minRating = parseInt(filters.rating.split('+')[0]);
        if (center.rating < minRating) return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const price = parseInt(center.price.replace(/[^0-9]/g, ''));
        const [min, max] = filters.priceRange.split('-').map(p =>
          parseInt(p.replace(/[^0-9]/g, ''))
        );
        if (price < min || (max && price > max)) return false;
      }

      return true;
    });
  };

  const filteredCenters = getFilteredCenters();

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

        {/* Updated Coaching Centers Grid */}
        {loading ? (
          <div className="mt-12 flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full"
            />
            <p className="mt-4 text-gray-600">Loading coaching centers...</p>
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="mt-12 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No coaching centers found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCenters.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 rounded-t-xl overflow-hidden">
                  <img
                   src={center.image}
                    alt={center.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://upload.wikimedia.org/wikipedia/commons/b/b0/Bennett_University_.jpg";
                    }}
                  />
                  <div className="absolute inset-0 duration-300" />
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
                      <span className="ml-1 text-2xl font-medium">{center.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1 font-medium">{center.rating}</span>
                      {center.reviews > 0 && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-gray-600">{center.reviews} reviews</span>
                        </>
                      )}
                    </div>
                    {center.students > 0 && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-1" />
                        <span>{center.students} students</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {center.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="text-sm">{center.location}</span>
                      </div>
                    )}
                    {center.availability && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="text-sm">{center.availability}</span>
                      </div>
                    )}
                  </div>

                  {center.subjects.length > 0 && (
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
                  )}

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
