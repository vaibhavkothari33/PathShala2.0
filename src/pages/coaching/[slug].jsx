import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Star, Clock, Users, Phone, Mail, Globe, Home,
  BookOpen, Award, CheckCircle, ChevronLeft, Calendar, Camera,
  Info, Briefcase, GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import coachingService from '../../services/coachingService';
import { databases } from '../../config/appwrite';
import { ID } from 'appwrite';

// Add these new animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const CoachingDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [user, setUser] = useState(null);

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
    const fetchUser = async () => {
      try {
        const response = await databases.getDocument('users', 'current');
        setUser(response);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user information');
      }
    };

    fetchUser();
  }, []);

  const handleRequest = async (type, batchId, batchName) => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    try {
      await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
        ID.unique(),
        {
          coachingId: coaching.$id,
          studentId: user.$id,
          studentName: user.name,
          studentEmail: user.email,
          studentPhone: user.phone || '',
          type,
          batchId,
          batchName,
          status: 'pending',
          message: '', // Optional message from student
        }
      );

      toast.success(`${type === 'batch' ? 'Join' : 'Demo'} request sent successfully`);
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request');
    }
  };

  // Enhanced loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-gray-600 font-medium"
        >
          Loading coaching details...
        </motion.p>
      </div>
    );
  }

  if (!coaching) return null;

  return (
    <motion.div 
      {...pageTransition}
      className="min-h-screen bg-gray-50"
    >
      {/* Enhanced Hero Section */}
      <div className="relative h-[400px]">
        {coaching.image ? (
          <img
            src={coaching.image}
            alt={coaching.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-transparent backdrop-blur-[2px]" />
        
        {/* Enhanced Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 bg-black/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/student/dashboard"
              className="inline-flex items-center text-white/90 hover:text-white transition-colors duration-200 group"
            >
              <motion.div
                whileHover={{ x: -3 }}
                className="bg-white/10 rounded-full p-2 mr-2 group-hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.div>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Enhanced Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end space-x-8"
            >
              {coaching.logo && (
                <motion.img
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={coaching.logo}
                  alt={`${coaching.name} logo`}
                  className="h-24 w-24 rounded-xl shadow-2xl border-2 border-white/20 backdrop-blur-sm"
                />
              )}
              <div className="flex-1">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-bold text-white mb-4 tracking-tight"
                >
                  {coaching.name}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap items-center gap-6 text-white/90"
                >
                  <div className="flex items-center bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <MapPin className="h-5 w-5 mr-2 text-indigo-300" />
                    <span>{coaching.city}</span>
                  </div>
                  <div className="flex items-center bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Star className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="font-medium">{coaching.rating}</span>
                    <span className="ml-1 text-white/70">({coaching.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center bg-black/20 rounded-full px-4 py-2 backdrop-blur-sm">
                    <Users className="h-5 w-5 mr-2 text-indigo-300" />
                    <span>{coaching.students}+ students</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Enhanced Tabs */}
              <div className="border-b border-gray-100">
                <nav className="flex">
                  {['overview', 'batches', 'faculty', 'gallery'].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      whileHover={{ backgroundColor: activeTab === tab ? 'rgb(238, 242, 255)' : 'rgb(249, 250, 251)' }}
                      className={`
                        flex-1 flex items-center justify-center px-8 py-6
                        ${activeTab === tab
                          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60'
                          : 'border-transparent text-gray-500 hover:text-gray-800'}
                        border-b-2 font-medium text-sm uppercase tracking-wide transition-all duration-200
                      `}
                    >
                      {tab === 'overview' && <Info className="h-4 w-4 mr-2" />}
                      {tab === 'batches' && <Calendar className="h-4 w-4 mr-2" />}
                      {tab === 'faculty' && <GraduationCap className="h-4 w-4 mr-2" />}
                      {tab === 'gallery' && <Camera className="h-4 w-4 mr-2" />}
                      {tab}
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <motion.div
                        className="space-y-10"
                      >
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center">
                            <Info className="h-5 w-5 mr-2 text-indigo-500" />
                            About
                          </h3>
                          <p className="text-gray-700 leading-relaxed text-lg">{coaching.description}</p>
                        </div>

                        {coaching.facilities && coaching.facilities.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center">
                              <Home className="h-5 w-5 mr-2 text-indigo-500" />
                              Facilities
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {coaching.facilities.map((facility, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center p-4 bg-indigo-50/60 rounded-xl border border-indigo-100"
                                >
                                  <CheckCircle className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                                  <span className="text-gray-700 font-medium">{facility}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {coaching.subjects && coaching.subjects.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center">
                              <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                              Subjects Offered
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              {coaching.subjects.map((subject, index) => (
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                                >
                                  {subject}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {activeTab === 'batches' && (
                      <motion.div
                        className="space-y-6"
                      >
                        {coaching.batches && coaching.batches.map((batch, index) => (
                          <motion.div
                            key={batch.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-gray-200 hover:border-indigo-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                          >
                            <div className="p-6">
                              <div className="flex flex-col md:flex-row justify-between items-start">
                                <div className="mb-6 md:mb-0">
                                  <h3 className="text-2xl font-semibold text-gray-900">{batch.name}</h3>
                                  <div className="mt-5 space-y-4">
                                    <div className="flex items-center text-gray-700">
                                      <Clock className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                      <span>{batch.timing}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                      <BookOpen className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                      <span>{Array.isArray(batch.subjects) ? batch.subjects.join(", ") : batch.subjects}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                      <Users className="h-5 w-5 mr-3 text-indigo-500 flex-shrink-0" />
                                      <span className="flex items-center">
                                        <span className="font-medium text-indigo-600 mr-1">{batch.availableSeats}</span>
                                        seats available
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-center md:text-right w-full md:w-auto">
                                  <div className="text-3xl font-bold text-indigo-700 mb-4">
                                    ₹{batch.fees || batch.monthlyFee}
                                    <span className="text-sm font-normal text-gray-500">/month</span>
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedBatch(batch.id)}
                                    className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium shadow-sm"
                                  >
                                    Select Batch
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'faculty' && (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {coaching.faculty && coaching.faculty.map((teacher, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start space-x-5">
                              {teacher.image && (
                                <img
                                  src={teacher.image}
                                  alt={teacher.name}
                                  className="h-20 w-20 rounded-full object-cover border-2 border-indigo-100 shadow"
                                />
                              )}
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{teacher.name}</h3>
                                <div className="mt-3 space-y-2.5">
                                  <div className="flex items-center text-gray-700">
                                    <BookOpen className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                                    <span>{teacher.subject}</span>
                                  </div>
                                  <div className="flex items-center text-gray-700">
                                    <Award className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                                    <span>{teacher.qualification}</span>
                                  </div>
                                  <div className="flex items-center text-gray-700">
                                    <Briefcase className="h-4 w-4 mr-2 text-indigo-500 flex-shrink-0" />
                                    <span>{teacher.experience} experience</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === 'gallery' && (
                      <motion.div
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center">
                          <Camera className="h-5 w-5 mr-2 text-indigo-500" />
                          Our Facilities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {coaching.classroomImages && coaching.classroomImages.map((image, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative aspect-video rounded-xl overflow-hidden shadow-md group"
                            >
                              <img
                                src={image}
                                alt={`Classroom ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                                <div className="p-4 text-white">
                                  <span className="font-medium">Classroom {index + 1}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enhanced Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-grid-white/10"
                animate={{
                  backgroundPosition: ["0px 0px", "100px 100px"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-indigo-600 px-6 py-4 rounded-xl hover:bg-indigo-50 transition-colors duration-200 font-medium shadow-lg"
                  >
                    Book Free Demo
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-indigo-500 text-white px-6 py-4 rounded-xl hover:bg-indigo-400 transition-colors duration-200 font-medium shadow-lg"
                  >
                    Download Brochure
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-5">
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

            {/* Enhanced Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h3>
              <div className="space-y-5">
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
    </motion.div>
  );
};

export default CoachingDetails;
