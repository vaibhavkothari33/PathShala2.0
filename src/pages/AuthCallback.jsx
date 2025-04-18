import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { account } from '../config/appwrite';
import { toast } from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsProcessing(true);
        console.log("Processing OAuth callback...");

        // Get the current session
        const session = await account.getSession('current');
        console.log("OAuth session:", session);

        if (session) {
          // Store JWT
          localStorage.setItem('jwt', session.providerAccessToken);

          // Get user details
          const currentUser = await account.get();
          console.log("User details:", currentUser);
          
          setUser(currentUser);
          toast.success('Successfully logged in!');
          
          // Redirect based on user role
          if (currentUser?.labels?.includes('coaching')) {
            navigate('/coaching/dashboard');
          } else {
            navigate('/student/dashboard');
          }
        } else {
          console.log("No session found");
          toast.error('Authentication failed');
          navigate('/student/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        localStorage.removeItem('jwt');
        toast.error('Authentication failed');
        navigate('/student/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
        {isProcessing && (
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we verify your account...
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;