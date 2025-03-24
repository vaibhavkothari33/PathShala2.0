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
import { Toaster } from 'react-hot-toast';
import AuthCallback from './components/AuthCallback';
import ErrorBoundary from './components/ErrorBoundary';
import AcademicBot from './pages/AcademicBot';
import { useState, useEffect } from 'react';

function App() {
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Check if all required environment variables are present
            const required = [
                'VITE_APPWRITE_ENDPOINT',
                'VITE_APPWRITE_PROJECT_ID',
                'VITE_APPWRITE_DATABASE_ID',
                'VITE_APPWRITE_REQUESTS_COLLECTION_ID',
                'VITE_APPWRITE_IMAGES_BUCKET_ID'
            ];

            const missing = required.filter(key => !import.meta.env[key]);

            if (missing.length > 0) {
                throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
            }
        } catch (err) {
            setError(err.message);
        }
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full px-6 py-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-xl font-bold text-red-600 mb-4">Configuration Error</h1>
                    <p className="text-gray-600">{error}</p>
                    <p className="mt-4 text-sm text-gray-500">
                        Please check your environment variables and try again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <AuthProvider>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 5000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            duration: 3000,
                            theme: {
                                primary: '#4CAF50',
                                secondary: '#131313',
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
                            <Route path="/student/academic-bot" element={<AcademicBot />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;