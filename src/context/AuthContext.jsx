import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../config/appwrite';
import { ID } from 'appwrite';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      // First check if we have a valid JWT in localStorage
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        setUser(null);
        setLoading(false);
        return null;
      }

      const currentUser = await account.get();
      console.log("Current user:", currentUser);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.log('Session check error:', error);
      localStorage.removeItem('jwt'); // Clear invalid JWT
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

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

  const login = async (email, password) => {
    try {
      const session = await account.createEmailSession(email, password);
      localStorage.setItem('jwt', session.providerAccessToken);
      
      const currentUser = await account.get();
      setUser(currentUser);
      toast.success('Login successful!');
      return currentUser;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 401) {
        toast.error('Invalid credentials. Please check your email and password.');
      } else {
        toast.error('Login failed. Please try again.');
      }
      
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      // First check if user exists
      try {
        // Try to create the account
        await account.create(ID.unique(), email, password, name);
        console.log("Account created successfully");
        
        // If creation successful, proceed with login
        const session = await account.createEmailSession(email, password);
        localStorage.setItem('jwt', session.providerAccessToken);
        
        const currentUser = await account.get();
        setUser(currentUser);
        toast.success('Registration successful!');
        return currentUser;
      } catch (error) {
        if (error.code === 409) { // User already exists
          // Try to login instead
          console.log("User exists, attempting login...");
          const session = await account.createEmailSession(email, password);
          localStorage.setItem('jwt', session.providerAccessToken);
          
          const currentUser = await account.get();
          setUser(currentUser);
          toast.success('Logged in with existing account');
          return currentUser;
        } else {
          throw error; // Re-throw other errors
        }
      }
    } catch (error) {
      console.error('Registration/Login error:', error);
      
      // Handle specific error cases
      if (error.code === 409) {
        toast.error('Account already exists. Please login instead.');
      } else if (error.code === 401) {
        toast.error('Invalid credentials. Please check your email and password.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      localStorage.removeItem('jwt');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('jwt');
      setUser(null);
      toast.error('Failed to logout properly');
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
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}