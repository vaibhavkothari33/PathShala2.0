import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, Star, Clock, Users, Phone, Mail, Globe,
  BookOpen, Award, CheckCircle, ChevronLeft, Calendar,
  MessageCircle, DollarSign, Info, Briefcase, GraduationCap
} from 'lucide-react';
import { databases } from '../../config/appwrite';
import { Query } from 'appwrite';
import { toast } from 'react-hot-toast';

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
        console.log('Fetching details for slug:', slug);
        
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID,
          [Query.equal('slug', [slug])]
        );

        if (!response.documents?.length) {
          toast.error('Coaching center not found');
          navigate('/student/dashboard');
          return;
        }

        const doc = response.documents[0];
        const coachingData = {
          id: doc.$id,
          name: doc.name,
          slug: doc.slug,
          description: doc.description,
          subjects: doc.subjects || [],
          rating: doc.rating || 4.5,
          reviews: doc.reviews || 0,
          students: doc.basicInfo?.totalStudents || 0,
          image: doc.images?.coverImage,
          logo: doc.images?.logo,
          classroomImages: doc.images?.classroomImages || [],
          location: doc.basicInfo?.address,
          address: doc.basicInfo?.address,
          city: doc.basicInfo?.city,
          availability: doc.basicInfo?.timings,
          contact: {
            phone: doc.basicInfo?.phone || '',
            email: doc.basicInfo?.email || '',
            website: doc.basicInfo?.website || ''
          },
          facilities: doc.facilities || [],
          batches: doc.batches || [],
          faculty: doc.faculty || [],
          establishedYear: doc.basicInfo?.establishedYear,
          price: doc.basicInfo?.fees || '₹2000'
        };

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
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-r from-indigo-600 to-blue-600">
        {coaching.image && (
          <img
            src={coaching.image}
            alt={coaching.name}
            className="w-full h-full object-cover opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-blue-600/90" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <Link 
            to="/student/dashboard" 
            className="flex items-center text-white/80 hover:text-white mb-6"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-6">
            {coaching.logo && (
              <img
                src={coaching.logo}
                alt={`${coaching.name} logo`}
                className="h-24 w-24 rounded-xl shadow-lg"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{coaching.name}</h1>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-1" />
                  <span>{coaching.city}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span>{coaching.rating}</span>
                  <span className="ml-1 text-white/70">({coaching.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-1" />
                  <span>{coaching.students}+ students</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b">
                <nav className="flex">
                  {['overview', 'batches', 'faculty', 'gallery'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } flex items-center px-6 py-4 border-b-2 font-medium text-sm capitalize transition-colors duration-200`}
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

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
                      <p className="text-gray-600 leading-relaxed">{coaching.description}</p>
                    </div>

                    {coaching.facilities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Facilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {coaching.facilities.map((facility, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center p-3 bg-indigo-50 rounded-lg"
                            >
                              <CheckCircle className="h-5 w-5 text-indigo-600 mr-3" />
                              <span className="text-gray-700">{facility}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {coaching.subjects.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Subjects Offered</h3>
                        <div className="flex flex-wrap gap-2">
                          {coaching.subjects.map((subject, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
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
                    {coaching.batches.map((batch, index) => (
                      <motion.div
                        key={batch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 hover:border-indigo-500 transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">{batch.name}</h3>
                              <div className="mt-4 space-y-3">
                                <div className="flex items-center text-gray-600">
                                  <Clock className="h-5 w-5 mr-3 text-indigo-500" />
                                  <span>{batch.timing}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <BookOpen className="h-5 w-5 mr-3 text-indigo-500" />
                                  <span>{batch.subjects.join(", ")}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Users className="h-5 w-5 mr-3 text-indigo-500" />
                                  <span>{batch.availableSeats} seats available</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600 mb-4">
                                ₹{batch.fees}
                                <span className="text-sm font-normal text-gray-500">/month</span>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedBatch(batch.id)}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
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
                    {coaching.faculty.map((teacher, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-500 transition-all duration-200"
                      >
                        <div className="flex items-start space-x-4">
                          {teacher.image && (
                            <img
                              src={teacher.image}
                              alt={teacher.name}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                            <div className="mt-2 space-y-2">
                              <div className="flex items-center text-gray-600">
                                <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
                                <span>{teacher.subject}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Award className="h-4 w-4 mr-2 text-indigo-500" />
                                <span>{teacher.qualification}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {coaching.classroomImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-video rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Classroom ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white"
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
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-indigo-500 mr-3" />
                  <a href={`tel:${coaching.contact.phone}`} className="text-indigo-600 hover:text-indigo-500">
                    {coaching.contact.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-indigo-500 mr-3" />
                  <a href={`mailto:${coaching.contact.email}`} className="text-indigo-600 hover:text-indigo-500">
                    {coaching.contact.email}
                  </a>
                </div>
                {coaching.contact.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-indigo-500 mr-3" />
                    <a
                      href={`https://${coaching.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
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
                  <span className="font-medium text-gray-900">{coaching.establishedYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-medium text-gray-900">{coaching.students}+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-medium text-gray-900">{coaching.rating}</span>
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