import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AcademicCapIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const features = [
  {
    name: 'Find Local Coaching Centers',
    description: 'Discover the best coaching centers near you using our GPS-based location services.',
    icon: MapPinIcon,
  },
  {
    name: 'Expert Tutors',
    description: 'Connect with qualified and experienced tutors in various subjects and courses.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Easy Booking',
    description: 'Book sessions and manage your learning schedule with just a few clicks.',
    icon: UserGroupIcon,
  },
  {
    name: 'Affordable Learning',
    description: 'Compare prices and choose coaching centers that fit your budget.',
    icon: BanknotesIcon,
  },
];

const benefits = [
  {
    icon: ChartBarIcon,
    title: 'Track Progress',
    description: 'Monitor your learning journey with detailed analytics and insights.'
  },
  {
    icon: ClockIcon,
    title: 'Flexible Schedule',
    description: 'Learn at your own pace with 24/7 access to study materials.'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Learning',
    description: 'Access your courses anytime, anywhere with our mobile app.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Quality Assurance',
    description: 'All tutors are verified and courses are quality checked.'
  }
];

const LandingPage = () => {
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="bg-white overflow-hidden"
    >
      {/* Hero Section with Enhanced Animation */}
      <div className="relative">
        <motion.div
          initial={{ skewY: 0 }}
          animate={{ skewY: -6 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500"
        >
          <motion.div
            animate={{ 
              background: [
                "linear-gradient(45deg, rgba(99,102,241,0.3) 0%, rgba(59,130,246,0.3) 100%)",
                "linear-gradient(45deg, rgba(139,92,246,0.3) 0%, rgba(59,130,246,0.3) 100%)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0"
          />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28">
            <motion.div 
              variants={containerVariants}
              className="text-center"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
              >
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
                >
                  Welcome to Pathshala
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block text-indigo-200 mt-2"
                >
                  Your Learning Journey Starts Here
                </motion.span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl leading-relaxed"
              >
                Connect with the best local coaching centers in your area. 
                Find the perfect match for your educational needs.
              </motion.p>
              
              {/* Enhanced CTA Buttons */}
              <motion.div 
                variants={containerVariants}
                className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12 space-x-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to="/register?role=student"
                    className="group relative inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-indigo-100 group-hover:translate-x-0 group-hover:translate-y-0 rounded-md"></span>
                    <span className="absolute inset-0 w-full h-full border-2 border-indigo-600 rounded-md"></span>
                    <span className="relative">I'm a Student</span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to="/register?role=coaching"
                    className="group relative inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-indigo-800 group-hover:translate-x-0 group-hover:translate-y-0 rounded-md"></span>
                    <span className="absolute inset-0 w-full h-full border-2 border-white rounded-md"></span>
                    <span className="relative">I'm a Coaching Center</span>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <motion.div 
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div 
            variants={fadeInUp}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-base text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-4 py-1 rounded-full inline-block"
            >
              Features
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl"
            >
              Everything you need to find
              <span className="block text-indigo-600">the perfect coaching</span>
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="mt-16"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  variants={scaleUp}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: index * 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-4 left-4"
                  >
                    <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 p-3">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </motion.div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Benefits Section */}
      <div className="py-16 bg-white">
        <motion.div 
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="text-center p-6 rounded-xl hover:bg-indigo-50 transition-colors duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center"
                >
                  <benefit.icon className="h-12 w-12 text-indigo-600" />
                </motion.div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-base text-gray-500 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Statistics Section */}
      <div className="bg-gradient-to-b from-indigo-50 to-white py-16">
        <motion.div 
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { stat: '500+', label: 'Coaching Centers', icon: AcademicCapIcon },
              { stat: '10,000+', label: 'Students', icon: UserGroupIcon },
              { stat: '50+', label: 'Cities', icon: MapPinIcon }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                variants={scaleUp}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                className="relative bg-white overflow-hidden shadow-lg rounded-xl"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute -right-4 -bottom-4"
                >
                  <item.icon className="h-24 w-24 text-indigo-600" />
                </motion.div>
                <div className="relative px-4 py-5 sm:p-6 text-center">
                  <motion.dt
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.3 }}
                    className="text-4xl font-extrabold text-indigo-600"
                  >
                    {item.stat}
                  </motion.dt>
                  <motion.dd
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.4 }}
                    className="mt-2 text-lg font-medium text-gray-900"
                  >
                    {item.label}
                  </motion.dd>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Enhanced Call to Action Section */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600"
        >
          <motion.div
            animate={{ 
              background: [
                "linear-gradient(45deg, rgba(99,102,241,0.2) 0%, rgba(59,130,246,0.2) 100%)",
                "linear-gradient(45deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.2) 100%)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0"
          />
        </motion.div>

        <div className="relative max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl"
          >
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="block"
            >
              Ready to start your learning journey?
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="block text-indigo-200 mt-2"
            >
              Join thousands of successful students.
            </motion.span>
          </motion.h2>

          <motion.div 
            variants={containerVariants}
            className="mt-8 flex justify-center space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to="/register?role=student"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-300"
              >
                Get Started
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 transition-all duration-300"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage; 