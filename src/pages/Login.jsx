import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { ArrowRight, Mail, Lock, User, CheckCircle, School, BookOpen, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('role') || 'student';
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, user } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.labels?.includes('coaching')) {
        navigate('/coaching/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Form validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!isLogin && !formData.name) {
        setError('Please enter your name to create an account');
        setLoading(false);
        return;
      }

      if (isLogin) {
        // Login flow
        const user = await login(formData.email, formData.password);
        console.log('Login successful:', user);
        
        // Redirect based on user role
        if (user?.labels?.includes('coaching')) {
          navigate('/coaching/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      } else {
        // Registration flow
        const user = await register(formData.email, formData.password, formData.name);
        console.log('Registration successful:', user);
        
        // Redirect based on role
        if (userType === 'coaching') {
          navigate('/coaching/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Initiating Google login...");
      await loginWithGoogle();
      // Note: Redirect will happen automatically
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to initiate Google login');
      setLoading(false);
    }
  };

  const benefits = {
    student: [
      { icon: BookOpen, text: "Access to premium study materials" },
      { icon: Users, text: "Learn from top educators" },
      { icon: CheckCircle, text: "Track your progress" },
    ],
    coaching: [
      { icon: School, text: "Reach more students" },
      { icon: Users, text: "Manage your institute efficiently" },
      { icon: CheckCircle, text: "Detailed analytics and insights" },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex">
      {/* Left Panel - Benefits */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-12 flex-col justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-6"
          >
            Welcome to Pathshala
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-blue-100 mb-12"
          >
            {userType === 'student' 
              ? "Start your learning journey with India's best educators" 
              : "Expand your reach and transform your coaching institute"}
          </motion.p>

          <div className="space-y-8">
            {benefits[userType].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="bg-white/10 p-3 rounded-lg">
                  <benefit.icon className="h-6 w-6 text-blue-200" />
                </div>
                <span className="text-lg text-blue-100">{benefit.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Why choose Pathshala?</h3>
            <ul className="space-y-3">
              {userType === 'student' ? (
                <>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Learn from India's top 1% educators</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Personalized learning experience</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Interactive live classes</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Comprehensive institute management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Advanced analytics dashboard</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Automated administrative tasks</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="text-sm text-blue-200">
          <p>© 2025 Pathshala. All rights reserved.</p>
          <p className="mt-1">Trusted by 10,000+ students and 500+ coaching institutes</p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-indigo-100 p-3 rounded-full">
                <School className="h-8 w-8 text-indigo-600" />
              </div>
            </div>

            <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="text-center text-sm text-gray-600 mb-8">
              Join as a {userType}{' '}
              <button 
                onClick={() => navigate(`/login?role=${userType === 'student' ? 'coaching' : 'student'}`)}
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Switch to {userType === 'student' ? 'coaching' : 'student'}
              </button>
            </p>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6"
              >
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

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
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    {isLogin && (
                      <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </a>
                    )}
                  </div>
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
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
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  <div className="flex items-center">
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </motion.button>

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
              <button 
                onClick={toggleMode}
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;