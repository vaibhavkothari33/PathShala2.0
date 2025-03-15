// components/coaching/CoachingDashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar,
  BookOpen,
  Settings, 
  Edit, 
  MessageCircle,
  BarChart2,
  User,
  Plus,
  Bell,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import coachingService from '../services/coachingService';
import { toast } from 'react-hot-toast';
import { ID } from 'appwrite';

const CoachingDashboard = () => {
  const { user } = useAuth();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  // Fetch the coaching center data
  useEffect(() => {
    const fetchCoachingData = async () => {
      try {
        // More explicit check for user data
        if (!user || !user.$id) {
          console.log('No valid user data available');
          setLoading(false);
          return;
        }
        
        console.log('Fetching coaching data for user:', user.$id);
        
        const coachingData = await coachingService.getUserCoaching(user.$id);
        console.log('Coaching data response:', coachingData);
        
        if (!coachingData) {
          console.log('No coaching data found');
          toast.error('Please register your coaching center first');
          navigate('/coaching/register');
          return;
        }
        
        setCoaching(coachingData);
      } catch (error) {
        console.error('Error fetching coaching data:', error);
        
        // More detailed error handling
        if (error.code === 401) {
          toast.error('Authentication error. Please log in again.');
          // Maybe redirect to login page
        } else if (error.code === 404) {
          toast.error('No coaching center found. Please register one.');
          navigate('/coaching/register');
        } else {
          toast.error(`Failed to load your coaching center data: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoachingData();
  }, [user, navigate]);

  // Add this function to fetch requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        if (!coaching?.$id) return;
        
        const response = await coachingService.getCoachingRequests(coaching.$id);
        setRequests(response);
      } catch (error) {
        console.error('Error fetching requests:', error);
        toast.error('Failed to load requests');
      }
    };

    fetchRequests();
  }, [coaching]);

  // Add these functions to handle requests
  const handleRequest = async (requestId, status) => {
    try {
      await coachingService.updateRequestStatus(requestId, status);
      
      // Update local state
      setRequests(requests.map(req => 
        req.$id === requestId ? { ...req, status } : req
      ));

      toast.success(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error handling request:', error);
      toast.error('Failed to process request');
    }
  };

  const updateRequestStatus = async (requestId, status) => {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
        requestId, // This is the document ID
        { 
          status,
          updatedAt: new Date().toISOString()
        }
      );
      
      // Update local state
      setRequests(requests.map(req => 
        req.$id === requestId ? { ...req, status } : req
      ));

      toast.success(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  // Add this section after the Overview Cards
  const RequestsSection = () => (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Recent Requests</h2>
          <div className="flex items-center">
            {requests.length > 0 && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm mr-2">
                {requests.filter(req => req.status === 'pending').length} new
              </span>
            )}
            <button
              onClick={() => setShowRequests(!showRequests)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {showRequests && (
          <div className="p-6">
            {requests.length > 0 ? (
              <div className="divide-y">
                {requests.map((request) => (
                  <div key={request.$id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.studentName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.type === 'batch' ? 'Batch Join Request' : 'Demo Class Request'} - {request.batchName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(request.$createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {request.status === 'pending' ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRequest(request.$id, 'accepted')}
                            className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors duration-200"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleRequest(request.$id, 'rejected')}
                            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          request.status === 'accepted' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {request.status}
                        </span>
                      )}
                    </div>
                    {request.message && (
                      <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {request.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No requests yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!coaching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">No coaching center found</h2>
          <Link 
            to="/coaching/register" 
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Register Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{coaching.name}</h1>
            <div className="mt-4 md:mt-0">
              <Link 
                to={`/coaching/edit/${coaching.$id}`} 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 inline mr-2" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Students Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                <p className="text-2xl font-bold">{coaching.students || 0}</p>
              </div>
            </div>
                    </div>

          {/* Batches Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-green-600" />
                          </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Batches</h3>
                <p className="text-2xl font-bold">{coaching.batches?.length || 0}</p>
                      </div>
                    </div>
                  </div>

          {/* Faculty Card */}
          <div className="bg-white rounded-lg shadow p-6">
                              <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <User className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Faculty</h3>
                <p className="text-2xl font-bold">{coaching.faculty?.length || 0}</p>
              </div>
            </div>
                              </div>

          {/* Subjects Card */}
          <div className="bg-white rounded-lg shadow p-6">
                              <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-600" />
                              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
                <p className="text-2xl font-bold">{coaching.subjects?.length || 0}</p>
                              </div>
                            </div>
                          </div>
                            </div>

        {/* Add Requests Section here */}
        <RequestsSection />

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Batches Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Batches</h2>
                <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Batch
                            </button>
              </div>
              <div className="p-6">
                {coaching.batches && coaching.batches.length > 0 ? (
                  <div className="divide-y">
                    {coaching.batches.map((batch, index) => (
                      <div key={index} className="py-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{batch.name}</h3>
                          <div className="text-sm text-gray-500">
                            {batch.subjects?.join(', ')} • {batch.timing}
                          </div>
                        </div>
                        <div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            {batch.availableSeats} seats available
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No batches added yet
                  </div>
                )}
              </div>
            </div>

            {/* Faculty Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Faculty</h2>
                <button className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Faculty
                </button>
              </div>
              <div className="p-6">
                {coaching.faculty && coaching.faculty.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coaching.faculty.map((teacher, index) => (
                      <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center">
                          {teacher.image ? (
                            <img 
                              src={`https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${teacher.image}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`} 
                              alt={teacher.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <User className="h-6 w-6 text-gray-500" />
                          </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{teacher.name}</h3>
                            <div className="text-sm text-gray-500">
                              {teacher.subject} • {teacher.experience}
                          </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No faculty added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-8">
            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  {coaching.images?.coverImage ? (
                    <img 
                      src={`https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${coaching.images.coverImage}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`} 
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No cover image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start">
                  {coaching.images?.logo ? (
                    <img 
                      src={`https://cloud.appwrite.io/v1/storage/buckets/${import.meta.env.VITE_APPWRITE_BUCKET_ID}/files/${coaching.images.logo}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`} 
                      alt="Logo"
                      className="w-12 h-12 object-cover rounded-lg mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-gray-400 text-xs">Logo</span>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-semibold">{coaching.name}</h3>
                    <div className="text-sm text-gray-500">
                      {coaching.address || coaching.city}
                    </div>
                </div>
                </div>
                
                <div className="mt-4">
                  <Link 
                    to={`/coaching/${coaching.slug}`} 
                    target="_blank"
                    className="w-full block text-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    View Public Page
                  </Link>
                </div>
                </div>
              </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Quick Links</h2>
                </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li>
                    <Link 
                      to="/coaching/students" 
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <Users className="h-5 w-5 mr-3" />
                      Manage Students
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/coaching/schedule" 
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      Manage Schedule
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/coaching/messages" 
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <MessageCircle className="h-5 w-5 mr-3" />
                      Messages
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/coaching/analytics" 
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <BarChart2 className="h-5 w-5 mr-3" />
                      Analytics
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/coaching/settings" 
                      className="flex items-center text-gray-700 hover:text-indigo-600"
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingDashboard;