import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Filter, Star, Clock, Users, BookOpen, ChevronDown, X, ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { databases } from '../config/appwrite'; // Import Appwrite databases
import { toast } from 'react-hot-toast';
import { FaCartArrowDown } from "react-icons/fa";
// import coachingService from '../services/coachingService';
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
  // const [coaching, setCoaching] = useState(null);
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
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID
      );

      const formattedCenters = response.documents.map((coaching) => {
        // Construct the base storage URL
        const storageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID}/files`;

        // Helper function to construct image URL
        const getImageUrl = (fileId) => {
          if (!fileId) return null;
          return `${storageUrl}/${fileId}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`;
        };

        return {
          id: coaching.$id,
          name: coaching.name || 'Unnamed Center',
          description: coaching.description || '',
          subjects: coaching.subjects && Array.isArray(coaching.subjects)
            ? coaching.subjects
            : coaching.batches_subjects && Array.isArray(coaching.batches_subjects)
              ? [...new Set(coaching.batches_subjects.flat())]
              : [],
          rating: coaching.rating || 4.5,
          reviews: coaching.reviews || 0,
          price: coaching.batches_monthlyFee && Array.isArray(coaching.batches_monthlyFee)
            ? `₹${coaching.batches_monthlyFee[0]}`
            : "₹2000",
          students: coaching.totalStudents || 0,

          // Update image handling
          image: getImageUrl(coaching.images_coverImage) ||
            getImageUrl(coaching.images_logo) ||
            "/default-coaching.jpg",

          // Update logo handling
          logo: getImageUrl(coaching.images_logo),

          location: coaching.address || "Address not available",
          city: coaching.city || "",
          availability: coaching.batches_timing?.length
            ? coaching.batches_timing[0]
            : "Mon-Sat, 9 AM - 7 PM",
          contact: {
            phone: coaching.phone || "",
            email: coaching.email || "",
            website: coaching.website || ""
          },
          facilities: coaching.facilities || [],
          batches: Array.isArray(coaching.batches_name)
            ? coaching.batches_name.map((name, i) => ({
              name,
              subjects: coaching.batches_subjects && Array.isArray(coaching.batches_subjects)
                ? coaching.batches_subjects[i] || []
                : [],
              timing: coaching.batches_timing?.[i] || '',
              capacity: coaching.batches_capacity?.[i] || '',
              availableSeats: coaching.batches_availableSeats?.[i] || '',
              monthlyFee: coaching.batches_monthlyFee?.[i] || '',
              duration: coaching.batches_duration?.[i] || '',
            }))
            : [],
          faculty: Array.isArray(coaching.faculty_name)
            ? coaching.faculty_name.map((name, i) => ({
              name,
              qualification: coaching.faculty_qualification?.[i] || '',
              experience: coaching.faculty_experience?.[i] || '',
              subject: coaching.faculty_subject?.[i] || '',
              bio: coaching.faculty_bio?.[i] || '',
              image: getImageUrl(coaching.faculty_image?.[i]),
            }))
            : [],
          establishedYear: coaching.establishedYear || '',
          classroomImages: Array.isArray(coaching.images_classroomImages)
            ? coaching.images_classroomImages.map(imgId => getImageUrl(imgId))
            : [],
          slug: coaching.slug || coaching.name?.toLowerCase().replace(/\s+/g, '-') || coaching.$id
        };
      });

      setCoachingCenters(formattedCenters);

      // Debug logging
      console.log('First coaching data:', {
        raw: response.documents[0],
        formatted: formattedCenters[0],
        imageUrl: formattedCenters[0]?.image,
        logoUrl: formattedCenters[0]?.logo
      });

    } catch (error) {
      console.error('Error fetching coaching centers:', error);
      toast.error('Failed to load coaching centers');
    } finally {
      setLoading(false);
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

  useEffect(() => {
    console.log('Storage URL:', import.meta.env.VITE_APPWRITE_STORAGE_URL);
    console.log('Sample coaching center:', coachingCenters[0]);
  }, [coachingCenters]);

  useEffect(() => {
    if (coachingCenters.length > 0) {
      console.log('First coaching center:', {
        name: coachingCenters[0].name,
        coverImage: coachingCenters[0].image,
        logo: coachingCenters[0].logo,
      });
    }
  }, [coachingCenters]);

  useEffect(() => {
    if (coachingCenters.length > 0) {
      console.log('Image URLs:', {
        coverImage: coachingCenters[0].image,
        classroomImages: coachingCenters[0].classroomImages,
        facultyImages: coachingCenters[0].faculty.map(f => f.image),
      });
    }
  }, [coachingCenters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
              >
                Find Coaching Centers
              </motion.h1>
              {userLocation && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-600"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Near you</span>
                </motion.div>
              )}
            </div>
  
            {/* Buttons Section */}
            <div className="flex  sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <Link to="/buy" className="w-full sm:w-auto">
              {/* Buy/Sell Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                
                <FaCartArrowDown className="h-5 w-5 mr-2" />
                  Buy/Sell
                
              </motion.button>
              </Link>
  
              {/* My Enrolled Courses Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                My Enrolled Courses
              </motion.button>
            </div>
          </div> 


      {/* Enhanced Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
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
            className="w-full sm:w-auto flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
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
              className="mt-4 p-4 sm:p-6 bg-white rounded-xl shadow-lg border border-gray-100"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className="flex items-center justify-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
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
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredCenters.map((coaching, index) => (
              <motion.div
                key={coaching.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-40 sm:h-48 rounded-t-xl overflow-hidden">
                  <img
                    src={coaching.image}
                    alt={coaching.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      if (!e.target.src.includes('default-coaching.jpg')) {
                        e.target.src = "/default-coaching.jpg";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {coaching.logo && (
                        <img
                          src={coaching.logo}
                          alt={`${coaching.name} logo`}
                          className="h-8 w-8 rounded-full border-2 border-white object-cover"
                        />
                      )}
                      <h3 className="text-lg font-semibold text-white truncate">{coaching.name}</h3>
                    </div>
                    <div className="px-3 py-1 bg-white rounded-full text-indigo-600 font-medium text-sm">
                      {coaching.price}/month
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="flex flex-col space-y-2 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-medium truncate">{coaching.name}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                        <span className="ml-1 font-medium">{coaching.rating}</span>
                      </div>
                      {coaching.reviews > 0 && (
                        <span className="text-sm text-gray-600">({coaching.reviews} reviews)</span>
                      )}
                      {coaching.students > 0 && (
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                          <span className="text-sm">{coaching.students} students</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {coaching.location && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                          <span className="text-sm truncate">{coaching.location}</span>
                        </div>
                      )}
                      {coaching.availability && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                          <span className="text-sm truncate">{coaching.availability}</span>
                        </div>
                      )}
                    </div>

                    {coaching.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {coaching.subjects.slice(0, 3).map((subject, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                        {coaching.subjects.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                            +{coaching.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/coaching/${coaching.slug}`}
                      className="block mt-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Link
        to="/student/academic-bot"
        className="fixed bottom-6 right-6 flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 group"
      >
        <Bot className="h-6 w-6" />
        <div className="hidden group-hover:block animate-fadeIn">
          <h3 className="font-medium">Academic Assistant</h3>
          <p className="text-sm text-indigo-100">Get help with your studies</p>
        </div>
      </Link>
    </div>
    </div>
    </div>
  );
};



export default StudentDashboard;
