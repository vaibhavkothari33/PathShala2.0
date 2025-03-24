import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { account } from '../config/appwrite';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Try to get the current session
                const session = await account.getSession('current');
                console.log('Session:', session);

                if (!session) {
                    throw new Error('No session found');
                }

                // Get user data
                const userData = await account.get();
                console.log('User data:', userData);

                if (userData) {
                    setUser(userData);
                    toast.success('Successfully logged in!');
                    
                    // Get the intended destination from state or default to dashboard
                    const destination = location.state?.from || '/student/dashboard';
                    navigate(destination);
                } else {
                    throw new Error('Failed to get user data');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                
                // Show more specific error messages
                if (error.code === 401) {
                    toast.error('Session expired. Please login again.');
                } else {
                    toast.error('Authentication failed. Please try again.');
                }
                
                navigate('/login');
            }
        };

        handleCallback();
    }, [navigate, setUser, location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing login...</p>
            </div>
        </div>
    );
};

export default AuthCallback; 