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

function App() {
  useEffect(() => {
    // Initialize default coaching centers when app starts
    coachingService.initializeDefaultCoachingCenters();
  }, []);

  return (
    <AuthProvider>
      <Toaster position="top-right" />
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
  );
}

export default App;