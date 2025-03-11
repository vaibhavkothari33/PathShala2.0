import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 transform -skew-y-6 origin-top-left" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Welcome to Pathshala</span>
                <span className="block text-indigo-200">Your Learning Journey Starts Here</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Connect with the best local coaching centers in your area. Find the perfect match for your educational needs.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-md shadow"
                >
                  <Link
                    to="/register?role=student"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    I'm a Student
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3"
                >
                  <Link
                    to="/register?role=coaching"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    I'm a Coaching Center
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base text-indigo-600 font-semibold tracking-wide uppercase"
            >
              Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Everything you need to find the perfect coaching
            </motion.p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="absolute -top-4 left-4">
                    <div className="rounded-lg bg-indigo-600 p-3">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="flex items-center justify-center">
                  <benefit.icon className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-base text-gray-500">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { stat: '500+', label: 'Coaching Centers' },
              { stat: '10,000+', label: 'Students' },
              { stat: '50+', label: 'Cities' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="px-4 py-5 sm:p-6 text-center">
                  <dt className="text-3xl font-extrabold text-indigo-600">{item.stat}</dt>
                  <dd className="mt-1 text-gray-900 font-medium">{item.label}</dd>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold text-white sm:text-4xl"
          >
            <span className="block">Ready to start your learning journey?</span>
            <span className="block text-indigo-200 mt-2">Join thousands of successful students.</span>
          </motion.h2>
          <div className="mt-8 flex justify-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register?role=student"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200"
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 transition-all duration-200"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 