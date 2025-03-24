import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../config/appwrite';
import { ID } from 'appwrite';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      console.error('Check user error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Creating your account...');

      // Create user account
      const response = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // Create email session
      await account.createEmailSession(email, password);
      
      // Get user data
      const userData = await account.get();
      
      // Update state
      setUser(userData);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Registration successful! Welcome aboard!');

      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show appropriate error message
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('email already exists')) {
        errorMessage = 'This email is already registered. Please try logging in.';
      } else if (error.message.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password must be at least 8 characters long.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Logging you in...');

      // Create email session
      await account.createEmailSession(email, password);
      
      // Get user data
      const userData = await account.get();
      
      // Update state
      setUser(userData);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Welcome back!');

      return userData;
    } catch (error) {
      console.error('Login error:', error);
      
      // Show appropriate error message
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.message.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('invalid credentials')) {
        errorMessage = 'Invalid email or password.';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const successUrl = `${window.location.origin}/auth/callback`;
      const failureUrl = `${window.location.origin}/login`;
      
      console.log('Initiating Google OAuth:', {
        successUrl,
        failureUrl
      });

      await account.createOAuth2Session(
        'google',
        successUrl,
        failureUrl
      );
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
      throw error;
    }
  };

  // Function to add role label to user
  const addUserRole = async (userId, role) => {
    try {
      await account.updatePrefs({
        role: role
      });
      
      // Update local user object
      setUser(prev => ({
        ...prev,
        prefs: {
          ...prev.prefs,
          role: role
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error setting user role:', error);
      return false;
    }
  };

  const value = {
    user,
    setUser,
    login,
    loginWithGoogle,
    register,
    logout,
    loading,
    addUserRole,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};