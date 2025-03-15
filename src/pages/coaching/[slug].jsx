import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Star, Clock, Users, Phone, Mail, Globe, Home,
  BookOpen, Award, CheckCircle, ChevronLeft, Calendar, Camera,
  Info, Briefcase, GraduationCap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import coachingService from '../../services/coachingService';

const CoachingDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState(null);

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
      <div className="relative h-[300px]"> {/* Reduced height */}
        {coaching.image && (
          <img
            src={coaching.image}
            alt={coaching.name}
            className="w-full h-full object-cover max-h-[300px]" // Ensures image doesn’t get too big
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Link
            to="/student/dashboard"
            className="flex items-center text-white/90 hover:text-white mb-6 transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-8">
            {coaching.logo && (
              <img
                src={coaching.logo}
                alt={`${coaching.name} logo`}
                className="h-20 w-20 rounded-lg shadow-xl border-2 border-white/20" // Reduced logo size
              />
            )}
            <div>
              <h1 className="text-5xl font-bold text-white mb-3">{coaching.name}</h1>
              <div className="flex items-center space-x-6 text-white/90">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-indigo-300" />
                  <span>{coaching.city}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="font-medium">{coaching.rating}</span>
                  <span className="ml-1 text-white/70">({coaching.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-indigo-300" />
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
              <div className="border-b border-gray-100">
                <nav className="flex">
                  {['overview', 'batches', 'faculty', 'gallery'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${activeTab === tab
                          ? 'border-indigo-600 text-indigo-600 bg-indigo-50/60'
                          : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                        } flex items-center px-8 py-5 border-b-2 font-medium text-sm uppercase tracking-wide transition-colors duration-200`}
                    >
                      {tab === 'overview' && <Info className="h-4 w-4 mr-2" />}
                      {tab === 'batches' && <Calendar className="h-4 w-4 mr-2" />}
                      {tab === 'faculty' && <GraduationCap className="h-4 w-4 mr-2" />}
                      {tab === 'gallery' && <Camera className="h-4 w-4 mr-2" />}
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Enhanced Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Sidebar Components */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-xl p-8 text-white"
            >
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-white text-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-50 transition-colors duration-200 font-medium">
                  Book Free Demo
                </button>
                <button className="w-full bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-400 transition-colors duration-200 font-medium">
                  Download Brochure
                </button>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
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
