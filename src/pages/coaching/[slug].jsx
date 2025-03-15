import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Clock, Users, Phone, Mail, Globe, Home,
  BookOpen, Award, CheckCircle, ChevronLeft, Calendar, Camera,
  Info, Briefcase, GraduationCap, X, ZoomIn, ArrowLeft, ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import coachingService from '../../services/coachingService';
import { useAuth } from '../../context/AuthContext';
import { databases } from '../../services/appwriteService';

const CoachingDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isBookingDemo, setIsBookingDemo] = useState(false);

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

  const handleBookDemo = async () => {
    try {
      if (!user) {
        toast.error('Please login to book a demo class');
        navigate('/login');
        return;
      }

      setIsBookingDemo(true);
      
      // Create a new request document
      const requestData = {
        coaching_id: coaching.$id,
        coaching_name: coaching.name,
        student_id: user.$id,
        studentName: user.name,
        type: 'demo',
        status: 'pending',
        message: `Demo class request for ${coaching.name}`,
        createdAt: new Date().toISOString(),
      };

      // Add the request to the database
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
        'unique()',
        requestData
      );

      toast.success('Demo class request sent successfully!');
      
    } catch (error) {
      console.error('Error booking demo:', error);
      toast.error('Failed to book demo class');
    } finally {
      setIsBookingDemo(false);
    }
  };

  const ImageModal = ({ images, currentImage, onClose, onNext, onPrevious }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={onPrevious}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ArrowRight className="h-6 w-6 text-white" />
          </button>

          {/* Main image */}
          <motion.img
            key={currentImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={currentImage}
            alt="Classroom view"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          {/* Image counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
            <p className="text-white text-sm">
              {images.indexOf(currentImage) + 1} / {images.length}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

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

  const QuickActions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-white"
    >
      <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button 
          onClick={handleBookDemo}
          disabled={isBookingDemo}
          className="w-full bg-white text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium flex items-center justify-center"
        >
          {isBookingDemo ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 border-t-2 border-indigo-600 rounded-full mr-2"
              />
              Booking...
            </>
          ) : (
            'Book Free Demo'
          )}
        </button>
        <button className="w-full bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-400 transition-colors duration-200 font-medium">
          Download Brochure
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Improved Styling */}
      <div className="relative h-[200px] sm:h-[300px]"> {/* Adjust height for mobile */}
        {coaching.image && (
          <img
            src={coaching.image}
            alt={coaching.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-6"> {/* Changed to justify-end */}
          <Link
            to="/student/dashboard"
            className="flex items-center text-white/90 hover:text-white mb-4 text-sm sm:text-base"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            {coaching.logo && (
              <img
                src={coaching.logo}
                alt={`${coaching.name} logo`}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg shadow-xl border-2 border-white/20 mb-4 sm:mb-0"
              />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              {/* Improved Tabs */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="overflow-x-auto scrollbar-hide">
                  <nav className="flex min-w-full">
                    {['Overview', 'Batches', 'Faculty', 'Gallery'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${
                          activeTab === tab
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60'
                            : 'border-transparent text-gray-500'
                        } flex-1 min-w-[120px] flex items-center justify-center px-3 py-4 border-b-2 text-sm font-medium transition-colors duration-200`}
                      >
                        {tab === 'Overview' && <Info className="h-4 w-4 mr-2" />}
                        {tab === 'Batches' && <Calendar className="h-4 w-4 mr-2" />}
                        {tab === 'Faculty' && <GraduationCap className="h-4 w-4 mr-2" />}
                        {tab === 'Gallery' && <Camera className="h-4 w-4 mr-2" />}
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === 'Overview' && (
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

                {activeTab === 'Batches' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {coaching.batches && coaching.batches.map((batch, index) => (
                      <div
                        key={batch.id || index}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
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

                {activeTab === 'Faculty' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {coaching.faculty && coaching.faculty.map((teacher, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center space-x-4">
                          {teacher.image && (
                            <img
                              src={teacher.image}
                              alt={teacher.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-indigo-100"
                            />
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

                {activeTab === 'Gallery' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {coaching.classroomImages && coaching.classroomImages.map((image, index) => (
                        <motion.div
                          key={index}
                          className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer"
                          onClick={() => setSelectedImage(image)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <img
                            src={image}
                            alt={`Classroom ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Sidebar Components */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <QuickActions />

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
                  <span className="text-gray-600">{coaching.address}</span>
                  {/* <span className="text-gray-600">{coaching.website}</span> */}
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-indigo-500 mr-3" />
                  <a href={`tel:${coaching.contact.phone}`} className="text-indigo-600 hover:text-indigo-500">
                    {coaching.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-indigo-500 mr-3" />  {coaching.email}
                  <a href={`mailto:${coaching.contact.email}`} className="text-indigo-600 hover:text-indigo-500">
                    {coaching.contact.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-indigo-500 mr-3" />
                  <a
                    href={`${coaching.contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {coaching.contact.website}
                  </a>
                </div>

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
                {/* <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-medium text-gray-900">{coaching.students > 0 ? `${coaching.students}+` : "N/A"}</span>
                </div> */}
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
    </div>
  );
};

export default CoachingDetails;
