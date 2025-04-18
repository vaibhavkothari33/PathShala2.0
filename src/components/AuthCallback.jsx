import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { account } from '../config/appwrite';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the current session
                const session = await account.getSession('current');
                
                // Get user data
                const userData = await account.get();
                setUser(userData);

                // Check user role and redirect accordingly
                if (userData.labels?.includes('coaching')) {
                    navigate('/coaching/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                toast.error('Authentication failed. Please try again.');
                navigate('/');
            }
        };

        handleCallback();
    }, [navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback; 