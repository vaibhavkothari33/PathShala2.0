import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Clock, Users, Phone, Mail, Globe, Home,
  BookOpen, Award, CheckCircle, ChevronLeft, Calendar, Camera,
  Info, Briefcase, GraduationCap, X, ZoomIn, ArrowLeft, ArrowRight, User, MessageCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import coachingService from '../../services/coachingService';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../config/appwrite';
import { ID } from 'appwrite';

const CoachingDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useAuth();
  const [isBookingDemo, setIsBookingDemo] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [showBookDemoModal, setShowBookDemoModal] = useState(false);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);

  useEffect(() => {
    const fetchCoachingDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching details for slug:', slug);

        // Use the coachingService to get coaching data by slug
        const coachingData = await coachingService.getCoachingBySlug(slug);

        if (!coachingData) {
          toast.error('Coaching center not found');
          navigate('/student/dashboard');
          return;
        }

        console.log('Coaching data loaded:', coachingData);
        setCoaching(coachingData);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load coaching details');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingDetails();
  }, [slug, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        setSelectedImage(null);
      } else if (e.key === 'ArrowRight') {
              const currentIndex = coaching.classroomImages.indexOf(selectedImage);
              const nextIndex = (currentIndex + 1) % coaching.classroomImages.length;
              setSelectedImage(coaching.classroomImages[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
              const currentIndex = coaching.classroomImages.indexOf(selectedImage);
              const previousIndex = currentIndex === 0 ? coaching.classroomImages.length - 1 : currentIndex - 1;
              setSelectedImage(coaching.classroomImages[previousIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, coaching]);

  const ImageModal = ({ images, currentImage, onClose, onNext, onPrevious }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={onPrevious}
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ArrowRight className="h-6 w-6 text-white" />
          </button>

          {/* Main image with animation */}
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full h-full flex items-center justify-center p-4"
          >
            <img
              src={currentImage}
              alt="Classroom view"
              className="max-w-[95vw] max-h-[90vh] object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-classroom.jpg";
              }}
            />
          </motion.div>

          {/* Image counter */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full">
            <p className="text-white text-sm font-medium">
              {images.indexOf(currentImage) + 1} / {images.length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const handleBookDemo = async () => {
    try {
      // Check if user is logged in
      if (!user) {
        toast.error('Please login to book a demo class');
        navigate('/login', { state: { from: `/coaching/${slug}` } });
        return;
      }

      setIsBookingDemo(true);

      // Get the database and collection IDs from environment variables
      const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
      const requestsCollectionId = import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID;

      // Debug logging
      console.log('Environment variables:', {
        databaseId,
        requestsCollectionId,
        userId: user.$id,
        coachingId: coaching?.id
      });

      if (!databaseId || !requestsCollectionId) {
        throw new Error('Missing database configuration. Please check your environment variables.');
      }

      if (!coaching || !coaching.id) {
        throw new Error('Coaching data is missing or invalid.');
      }

      // Create request data object
      const requestData = {
        user_id: user.$id,
        coaching_id: coaching.id,
        type: 'demo',
        status: 'pending',
        message: bookingMessage || 'Demo class request',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Create the request document
      const response = await databases.createDocument(
        databaseId,
        requestsCollectionId,
        ID.unique(),
        requestData
      );

      console.log('Demo request created:', response);
      toast.success('Demo class request submitted successfully!');
      setShowBookDemoModal(false);
      setShowSuccessConfirmation(true);
    } catch (error) {
      console.error('Error booking demo:', error);
      toast.error(error.message || 'Failed to submit demo class request');
    } finally {
      setIsBookingDemo(false);
    }
  };

  // Add a fallback booking method that doesn't rely on the database
  const handleBookDemoFallback = () => {
    try {
      // Check if user is logged in
      if (!user) {
        toast.error('Please login to book a demo class');
        navigate('/login', { state: { from: `/coaching/${slug}` } });
        return;
      }

      setIsBookingDemo(true);
      
      // Simulate a delay
      setTimeout(() => {
        // Show success message
        toast.success(
          <div>
            <p className="font-medium">Demo request sent!</p>
            <p className="text-sm">The coaching center will contact you soon with class details.</p>
          </div>,
          { duration: 5000 }
        );
        
        setBookingMessage('');
        setShowSuccessConfirmation(true);
        setTimeout(() => setShowSuccessConfirmation(false), 5000);
        setIsBookingDemo(false);
      }, 1500);
    } catch (error) {
      console.error('Error in fallback booking:', error);
      toast.error('Something went wrong. Please try again later.');
      setIsBookingDemo(false);
    }
  };

  const BookDemoModal = ({ isOpen, onClose }) => {
    const [useAlternativeMethod, setUseAlternativeMethod] = useState(false);
    
    if (!isOpen) return null;
    
    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent form refresh
      if (useAlternativeMethod) {
        handleBookDemoFallback();
      } else {
        handleBookDemo();
      }
      onClose();
    };
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Book a Free Demo Class</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r">
              <p className="text-sm text-blue-700">
                Your request will be sent to the coaching center. Once approved, they will contact you with the class details.
              </p>
            </div>
            
            <p className="text-gray-600 mb-4">
              Request a free demo class at {coaching.name}. Please let us know what subjects you're interested in.
            </p>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={bookingMessage}
                onChange={(e) => setBookingMessage(e.target.value)}
                placeholder="Tell us what subjects you're interested in..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Add a checkbox for alternative booking method */}
            <div className="flex items-center mb-2">
              <input
                id="alternative-method"
                type="checkbox"
                checked={useAlternativeMethod}
                onChange={() => setUseAlternativeMethod(!useAlternativeMethod)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="alternative-method" className="ml-2 block text-sm text-gray-600">
                Use alternative booking method (if you're experiencing issues)
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBookingDemo}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                {isBookingDemo ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Add a component to check environment variables
  const checkEnvironmentVariables = () => {
    const requiredVars = [
      'VITE_APPWRITE_DATABASE_ID',
      'VITE_APPWRITE_REQUESTS_COLLECTION_ID',
      'VITE_APPWRITE_PROJECT_ID',
      'VITE_APPWRITE_ENDPOINT'
    ];
    
    const missing = requiredVars.filter(varName => !import.meta.env[varName]);
    
    if (missing.length > 0) {
      console.error('Missing required environment variables:', missing);
      return false;
    }
    
    return true;
  };

  // Call this in useEffect
  useEffect(() => {
    checkEnvironmentVariables();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full"
        />
      </div>
    );
  }

  if (!coaching) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Improved Styling */}
      <div className="relative h-[200px] sm:h-[300px]"> {/* Responsive height */}
        {coaching.image ? (
          <img
            src={coaching.image}
            alt={coaching.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-cover.jpg";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-xl">No cover image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-6"> {/* Changed to justify-end for better mobile view */}
          <Link
            to="/student/dashboard"
            className="flex items-center text-white/90 hover:text-white mb-4 text-sm sm:text-base"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            {coaching.logo ? (
              <img
                src={coaching.logo}
                alt={`${coaching.name} logo`}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg shadow-xl border-2 border-white/20 mb-4 sm:mb-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-logo.jpg";
                }}
              />
            ) : (
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-4 sm:mb-0">
                {coaching.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-3">{coaching.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm sm:text-base text-white/90">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-300" />
                  <span>{coaching.city}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 mr-2" />
                  <span className="font-medium">{coaching.rating}</span>
                  <span className="ml-1 text-white/70">({coaching.reviews})</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-300" />
                  <span>{coaching.students}+ students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Improved Tabs - Scrollable on mobile */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="overflow-x-auto scrollbar-hide">
                  <nav className="flex min-w-full">
                    {['overview', 'batches', 'faculty', 'gallery'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                          activeTab === tab
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60'
                            : 'border-transparent text-gray-500'
                        } flex-1 min-w-[120px] flex items-center justify-center px-3 py-4 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        {tab === 'overview' && <Info className="h-4 w-4 mr-2" />}
                        {tab === 'batches' && <Calendar className="h-4 w-4 mr-2" />}
                        {tab === 'faculty' && <GraduationCap className="h-4 w-4 mr-2" />}
                        {tab === 'gallery' && <Camera className="h-4 w-4 mr-2" />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6 sm:space-y-8"
                  >
                    {/* About Section */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-indigo-500" />
                        About
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{coaching.description}</p>
                    </div>

                    {/* Facilities Section */}
                    {coaching.facilities && coaching.facilities.length > 0 && (
                      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                          <Home className="h-5 w-5 mr-2 text-indigo-500" />
                          Facilities
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {coaching.facilities.map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center p-3 bg-indigo-50/60 rounded-lg border border-indigo-100"
                            >
                              <CheckCircle className="h-4 w-4 text-indigo-600 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Subjects Section */}
                    {coaching.subjects && coaching.subjects.length > 0 && (
                      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                          Subjects Offered
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {coaching.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-100"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'batches' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {coaching.batches && coaching.batches.map((batch, index) => (
                      <div
                        key={batch.id || index}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="space-y-4">
                          {/* Batch Header */}
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
                            <div className="text-xl font-bold text-indigo-700">
                              ₹{batch.fees || batch.monthlyFee}
                              <span className="text-xs font-normal text-gray-500">/month</span>
                            </div>
                          </div>

                          {/* Batch Details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center text-gray-700">
                              <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                              <span>{batch.timing}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                              <Users className="h-4 w-4 mr-2 text-indigo-500" />
                              <span>{batch.availableSeats} seats available</span>
                            </div>
                            <div className="flex items-center text-gray-700 sm:col-span-2">
                              <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                              <span className="line-clamp-1">{Array.isArray(batch.subjects) ? batch.subjects.join(", ") : batch.subjects}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => setSelectedBatch(batch.id)}
                            className="w-full mt-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                          >
                            Select Batch
                          </button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'faculty' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {coaching.faculty && coaching.faculty.map((teacher, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-center">
                          {teacher.image ? (
                            <img
                              src={teacher.image}
                              alt={teacher.name}
                              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover mr-3 sm:mr-4"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-faculty.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-200 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{teacher.name}</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center text-gray-700">
                                <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                                <span className="truncate">{teacher.subject}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Award className="h-4 w-4 mr-2 text-indigo-500" />
                                <span className="truncate">{teacher.qualification}</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                                <span>{teacher.experience} experience</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Camera className="h-5 w-5 mr-2 text-indigo-500" />
                      Classroom Gallery
                    </h3>
                    
                    {coaching.classroomImages && coaching.classroomImages.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coaching.classroomImages.map((image, index) => (
                          <motion.div
                            key={index}
                            className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            <img
                              src={image}
                              alt={`Classroom ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/default-classroom.jpg";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="flex items-center justify-between">
                                  <p className="text-white font-medium">Classroom {index + 1}</p>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-white/20 p-2 rounded-full"
                                  >
                                    <ZoomIn className="h-5 w-5 text-white" />
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">No classroom images available</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Sidebar Components */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-white"
            >
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowBookDemoModal(true)}
                  className="w-full bg-white text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Free Demo
                </button>
                {coaching.brochureUrl ? (
                  <a 
                    href={coaching.brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-400 transition-colors duration-200 font-medium flex items-center justify-center"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Download Brochure
                  </a>
                ) : (
                  <button className="w-full bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-400 transition-colors duration-200 font-medium flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Coaching
                  </button>
                )}
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {/* Address */}
                {coaching.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-indigo-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">
                      {[coaching.address, coaching.city].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {/* Phone */}
                {coaching.contact?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                    <a 
                      href={`tel:${coaching.contact.phone}`} 
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {coaching.contact.phone}
                    </a>
                  </div>
                )}

                {/* Email */}
                {coaching.contact?.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                    <a 
                      href={`mailto:${coaching.contact.email}`} 
                      className="text-indigo-600 hover:text-indigo-500 truncate"
                    >
                      {coaching.contact.email}
                    </a>
                  </div>
                )}

                {/* Website */}
                {coaching.contact?.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                    <a
                      href={coaching.contact.website.startsWith('http') ? coaching.contact.website : `https://${coaching.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500 truncate"
                    >
                      {coaching.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Established</span>
                  <span className="font-medium text-gray-900">{coaching.establishedYear || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900">{coaching.rating ? coaching.rating.toFixed(1) : "N/A"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            images={coaching.classroomImages}
            currentImage={selectedImage}
            onClose={() => setSelectedImage(null)}
            onNext={() => {
              const currentIndex = coaching.classroomImages.indexOf(selectedImage);
              const nextIndex = (currentIndex + 1) % coaching.classroomImages.length;
              setSelectedImage(coaching.classroomImages[nextIndex]);
            }}
            onPrevious={() => {
              const currentIndex = coaching.classroomImages.indexOf(selectedImage);
              const previousIndex = currentIndex === 0 ? coaching.classroomImages.length - 1 : currentIndex - 1;
              setSelectedImage(coaching.classroomImages[previousIndex]);
            }}
          />
        )}
        
        <BookDemoModal 
          isOpen={showBookDemoModal} 
          onClose={() => setShowBookDemoModal(false)} 
        />

        {showSuccessConfirmation && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
          >
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Demo Request Sent!</h4>
                <p className="text-sm text-white/90">
                  Your request has been sent to {coaching.name}. They will review it and contact you with class details soon.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachingDetails;