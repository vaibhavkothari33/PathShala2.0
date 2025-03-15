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
// At the top of your CoachingDashboard.jsx file
import { databases, } from '../config/appwrite'; // Adjust the path as needed
// Near the top of your file, after imports
import { Query } from 'appwrite';
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const REQUESTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID;
const CoachingDashboard = () => {
  const { user } = useAuth();
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  // Updated data fetching with better error handling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.$id) {
          throw new Error('Please login to access dashboard');
        }

        console.log('Fetching coaching data for user:', user.$id);

        // Fetch coaching data
        const response = await databases.listDocuments(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_COACHING_COLLECTION_ID,
          [Query.equal('owner_id', user.$id)]
        );

        console.log('Raw coaching data:', response);

        if (!response.documents || response.documents.length === 0) {
          throw new Error('No coaching center found');
        }

        const coachingData = response.documents[0];

        // Format the coaching data with proper image URLs
        const formattedCoaching = {
          ...coachingData,
          name: coachingData.name || 'Unnamed Coaching',
          students: calculateTotalStudents(coachingData),
          batches: formatBatches(coachingData),
          faculty: formatFaculty(coachingData),
          totalRevenue: calculateTotalRevenue(coachingData),
          images: {
            logo: getImageUrl(coachingData.images_logo),
            coverImage: getImageUrl(coachingData.images_coverImage),
          }
        };

        // Debug log
        console.log('Formatted coaching data with images:', {
          logo: formattedCoaching.images.logo,
          cover: formattedCoaching.images.coverImage
        });

        setCoaching(formattedCoaching);

        // Fetch requests here, after coaching data is set
        if (formattedCoaching.$id) {
          try {
            const requestsResponse = await databases.listDocuments(
              import.meta.env.VITE_APPWRITE_DATABASE_ID,
              import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
              [Query.equal('coaching_id', formattedCoaching.$id)]
            );
            console.log('Requests fetched:', requestsResponse.documents);
            setRequests(requestsResponse.documents);
          } catch (requestError) {
            console.error('Error fetching requests:', requestError);
            toast.error('Failed to load requests');
          }
        }

      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.message);
        toast.error(error.message || 'Failed to load dashboard');
        
        // Redirect to registration if no coaching found
        if (error.message === 'No coaching center found') {
          navigate('/coaching/register');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Update the getImageUrl helper function
  const getImageUrl = (fileId) => {
    if (!fileId) return null;
    
    const storageUrl = import.meta.env.VITE_APPWRITE_STORAGE_URL || 'https://cloud.appwrite.io/v1';
    const bucketId = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

    // Add console.log to debug URL construction
    const imageUrl = `${storageUrl}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
    console.log('Constructed image URL:', imageUrl);
    
    return imageUrl;
  };

  // Updated helper functions with null checks
  const calculateTotalStudents = (data) => {
    if (!data.batches_capacity || !data.batches_availableSeats) return 0;
    try {
      return data.batches_capacity.reduce((total, capacity, index) => {
        const available = parseInt(data.batches_availableSeats[index] || 0);
        const total_capacity = parseInt(capacity || 0);
        return total + (total_capacity - available);
      }, 0);
    } catch (error) {
      console.error('Error calculating students:', error);
      return 0;
    }
  };

  const formatBatches = (data) => {
    if (!Array.isArray(data.batches_name)) return [];
    try {
      return data.batches_name.map((name, i) => ({
        name: name || `Batch ${i + 1}`,
        subjects: Array.isArray(data.batches_subjects?.[i]) 
          ? data.batches_subjects[i] 
          : [],
        timing: data.batches_timing?.[i] || 'Schedule not set',
        capacity: data.batches_capacity?.[i] || '0',
        availableSeats: data.batches_availableSeats?.[i] || '0',
        monthlyFee: data.batches_monthlyFee?.[i] || '0'
      }));
    } catch (error) {
      console.error('Error formatting batches:', error);
      return [];
    }
  };

  const formatFaculty = (data) => {
    if (!Array.isArray(data.faculty_name)) return [];
    try {
      return data.faculty_name.map((name, i) => ({
        name: name || `Faculty ${i + 1}`,
        qualification: data.faculty_qualification?.[i] || '',
        experience: data.faculty_experience?.[i] || '',
        subject: data.faculty_subject?.[i] || '',
        image: data.faculty_image?.[i] ? getImageUrl(data.faculty_image[i]) : null
      }));
    } catch (error) {
      console.error('Error formatting faculty:', error);
      return [];
    }
  };

  const calculateTotalRevenue = (data) => {
    if (!data.batches_monthlyFee || !data.batches_capacity || !data.batches_availableSeats) return 0;

    return data.batches_monthlyFee.reduce((total, fee, index) => {
      const enrolledStudents = parseInt(data.batches_capacity[index] || 0) - 
                              parseInt(data.batches_availableSeats[index] || 0);
      return total + (enrolledStudents * parseInt(fee || 0));
    }, 0);
  };

  // Update the request handling functions
  const handleRequest = async (requestId, status) => {
    try {
      // Update the request status in the database
      await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_REQUESTS_COLLECTION_ID,
        requestId,
        { 
          status,
          updatedAt: new Date().toISOString()
        }
      );
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.$id === requestId ? { ...req, status } : req
        )
      );

      toast.success(`Request ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error handling request:', error);
      toast.error('Failed to process request');
    }
  };

  // Update the RequestsSection component
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            to="/coaching/register" 
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Register Your Coaching
          </Link>
        </div>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            icon={<Users className="h-6 w-6 text-indigo-600" />}
            title="Students"
            value={coaching.students}
            bgColor="bg-indigo-100"
          />
          <StatsCard 
            icon={<Calendar className="h-6 w-6 text-green-600" />}
            title="Batches"
            value={coaching.batches?.length || 0}
            bgColor="bg-green-100"
          />
          <StatsCard 
            icon={<User className="h-6 w-6 text-yellow-600" />}
            title="Faculty"
            value={coaching.faculty?.length || 0}
            bgColor="bg-yellow-100"
          />
          <StatsCard 
            icon={<BookOpen className="h-6 w-6 text-purple-600" />}
            title="Monthly Revenue"
            value={`₹${coaching.totalRevenue?.toLocaleString()}`}
            bgColor="bg-purple-100"
          />
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
                      <FacultyCard key={index} teacher={teacher} />
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
            <PreviewSection coaching={coaching} />

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

// Helper Components
const StatsCard = ({ icon, title, value, bgColor }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`${bgColor} p-3 rounded-full`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const FacultyCard = ({ teacher }) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-center">
      {teacher.image ? (
        <img 
          src={teacher.image} 
          alt={teacher.name}
          className="w-10 h-10 rounded-full object-cover mr-3"
          onError={(e) => {
            console.error('Faculty image load error:', e);
            e.target.src = '/default-faculty.jpg';
          }}
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
);

const PreviewSection = ({ coaching }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b">
      <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
    </div>
    <div className="p-6">
      <div className="mb-4">
        {coaching.images?.coverImage ? (
          <img 
            src={coaching.images.coverImage} 
            alt="Cover"
            className="w-full h-32 object-cover rounded-lg"
            onError={(e) => {
              console.error('Cover image load error:', e);
              e.target.src = '/default-cover.jpg';
            }}
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
            src={coaching.images.logo} 
            alt="Logo"
            className="w-12 h-12 object-cover rounded-lg mr-3"
            onError={(e) => {
              console.error('Logo load error:', e);
              e.target.src = '/default-logo.jpg';
            }}
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
);

const QuickLinks = () => (
  <div className="bg-white rounded-lg shadow">
    {/* Quick links content */}
  </div>
);

export default CoachingDashboard;