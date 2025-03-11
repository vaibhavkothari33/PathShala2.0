import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  Globe,
  BookOpen,
  Award,
  CheckCircle,
  ChevronLeft,
  MessageCircle
} from 'lucide-react';
import coachingService from '../../services/coachingService';

const CoachingDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    const fetchCoaching = async () => {
      try {
        const data = await coachingService.getCoachingBySlug(slug);
        setCoaching(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching coaching:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaching();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !coaching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Coaching not found' ? 'Coaching not found' : 'Something went wrong'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error === 'Coaching not found' 
              ? "The coaching center you're looking for doesn't exist." 
              : "We're having trouble loading this page."}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            to="/dashboard" 
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{coaching.basicInfo.name}</h1>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 text-gray-700">{coaching.rating}</span>
                <span className="ml-1 text-gray-500">({coaching.reviews} reviews)</span>
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="border-b">
                <nav className="flex -mb-px">
                  {['overview', 'batches', 'faculty', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`${
                        activeTab === tab
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About</h3>
                      <p className="text-gray-600">{coaching.basicInfo.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Facilities</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {coaching.facilities.map((facility, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span>{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'batches' && (
                  <div className="space-y-4">
                    {coaching.batches.map((batch) => (
                      <div 
                        key={batch.id}
                        className="border rounded-lg p-4 hover:border-indigo-500 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{batch.name}</h3>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {batch.timing}
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-2" />
                                {batch.subjects.join(", ")}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                {batch.available} seats available
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-indigo-600">
                              {batch.price}
                            </div>
                            <button 
                              onClick={() => setSelectedBatch(batch.id)}
                              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                            >
                              Select Batch
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'faculty' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {coaching.faculty.map((teacher, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg">{teacher.name}</h3>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            {teacher.subject}
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2" />
                            {teacher.qualification}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {teacher.experience} experience
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Add reviews component here */}
                    <p className="text-gray-600">Reviews coming soon...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{coaching.basicInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`tel:${coaching.basicInfo.phone}`} className="text-indigo-600 hover:text-indigo-500">
                    {coaching.basicInfo.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`mailto:${coaching.basicInfo.email}`} className="text-indigo-600 hover:text-indigo-500">
                    {coaching.basicInfo.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-2" />
                  <a href={`https://${coaching.basicInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-500">
                    {coaching.basicInfo.website}
                  </a>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
                    Book Free Demo
                  </button>
                  <button className="w-full bg-white text-indigo-600 px-4 py-2 rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
                    Download Brochure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingDetails; 