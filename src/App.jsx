import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CoachingDashboard from './pages/CoachingDashboard';
import CoachingRegistration from './pages/coaching/CoachingRegistration';
import Navbar from './components/Navbar';
import CoachingDetails from './pages/coaching/[slug]';
import NotFound from './pages/NotFound';
import { useEffect } from 'react';
import coachingService from './services/coachingService';
import { Toaster } from 'react-hot-toast';
import AuthCallback from './pages/AuthCallback';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  useEffect(() => {
    // Initialize default coaching centers when app starts
    coachingService.initializeDefaultCoachingCenters();
  }, []);

  const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
    
    if (!user) return <Navigate to="/login" />;
    
    return children;
  };
  
  // Create a component to check if the user has a coaching center
  const CoachingRedirect = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [hasCoaching, setHasCoaching] = useState(false);
    
    useEffect(() => {
      const checkUserCoaching = async () => {
        try {
          // Check if this user has already registered a coaching center
          const coachingData = await coachingService.getUserCoaching(user.id);
          setHasCoaching(coachingData !== null);
        } catch (error) {
          console.error("Error checking user coaching:", error);
        } finally {
          setLoading(false);
        }
      };
      
      checkUserCoaching();
    }, [user]);
    
    if (loading) return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
    
    // If user has coaching, redirect to dashboard, otherwise to registration
    return hasCoaching ? 
      <Navigate to="/coaching/dashboard" /> : 
      <Navigate to="/coaching/registration" />;
  };

  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            success: {
              style: {
                background: 'green',
                color: 'white',
              },
            },
            error: {
              style: {
                background: 'red',
                color: 'white',
              },
            },
          }}
        />
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route 
                path="/student/dashboard" 
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/coaching/dashboard" 
                element={
                  <ProtectedRoute>
                    <CoachingDashboard />
                  </ProtectedRoute>
                }   
              />
              <Route 
                path="/coaching/registration" 
                element={
                  <ProtectedRoute>
                    <CoachingRegistration />
                  </ProtectedRoute>
                } 
              />
              <Route path="/coaching/:slug" element={<CoachingDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;