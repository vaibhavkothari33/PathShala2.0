import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import StudentLogin from './pages/StudentLogin';
import CoachingLogin from './pages/CoachingLogin';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CoachingDashboard from './pages/CoachingDashboard';
import CoachingRegistration from './pages/coaching/CoachingRegistration';
import Navbar from './components/Navbar';
import CoachingDetails from './pages/coaching/[slug]';
import { Toaster } from 'react-hot-toast';
import AuthCallback from './components/AuthCallback';
import ErrorBoundary from './components/ErrorBoundary';
import AcademicBot from './pages/AcademicBot';
import { useState, useEffect } from 'react';
import { validateConfig } from './config/appwrite';
import NotFound from './pages/NotFound';
import Buysell from './pages/Buysell';
import BookForm from './pages/sellbooks/BookForm';
// import { Razorpay } from 'razorpay-checkout';
import RazorpayPayment from './pages/RazorpayPayment';
import Buy from './pages/buy';
import Sell from './pages/sell';
import BookDetail from './pages/BookDetails';
// import Routes from './Routes';

function App() {
    const [configError, setConfigError] = useState(null);

    useEffect(() => {
        try {
            validateConfig();
        } catch (err) {
            console.error('Configuration error:', err);
            setConfigError(err.message);
        }
    }, []);

    if (configError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Configuration Error
                    </h1>
                    <p className="text-gray-700 mb-4">{configError}</p>
                    <p className="text-sm text-gray-500">
                        Please check your environment variables and restart the application.
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
                            <Route path="/student/login" element={<StudentLogin />} />
                            <Route path="/coaching/login" element={<CoachingLogin />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            <Route path="/buysell" element={<Buysell />} />
                            <Route path="/bookform" element={<BookForm />} />
                            <Route path="/coaching/payment" element={<RazorpayPayment />} />
                            <Route path="/buy" element={<Buy />} />
                            <Route path="/sell" element={<Sell />} />
                            <Route path="/book/:slug" element={<BookDetail />} />

                            <Route
                                path="/student/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <StudentDashboard />
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
                            <Route
                                path="/coaching/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <CoachingDashboard />
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
