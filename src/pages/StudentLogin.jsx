import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, Mail, Lock, BookOpen, Users, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { account } from '../config/appwrite';

const StudentLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const session = await account.createEmailSession(formData.email, formData.password);
      const userData = await account.get();
      setUser(userData);
      toast.success('Login successful!');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 401) {
        toast.error('Invalid email or password');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await account.createOAuth2Session('google', 'http://localhost:5173/auth/callback');
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to login with Google');
      setLoading(false);
    }
  };

  const benefits = [
    { icon: BookOpen, text: "Access to premium study materials" },
    { icon: Users, text: "Learn from top educators" },
    { icon: CheckCircle, text: "Track your progress" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Left Panel - Benefits */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-6">Welcome to Pathshala</h1>
          <p className="text-xl text-blue-100 mb-12">
            Start your learning journey with India's best educators
          </p>

          <div className="space-y-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <benefit.icon className="h-6 w-6 text-blue-200" />
                </div>
                <span className="text-lg text-blue-100">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-blue-200">
          <p>© 2025 Pathshala. All rights reserved.</p>
          <p className="mt-1">Trusted by 10,000+ students</p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-indigo-100 p-3 rounded-full">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              Student Login
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Sign in to access your learning dashboard
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 transition-colors duration-200"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
            </form>

            <div className="mt-8 text-center">
              Don't have an account? &nbsp;
              <Link to="/register?role=student" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up as a student
              </Link>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin; 