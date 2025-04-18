import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  // Random floating elements for background animation
  const generateRandomElements = (count) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: Math.random() * 30 + 15, // Increased size
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15
    }));
  };

  const floatingElements = generateRandomElements(20); // Increased count

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
      {/* Enhanced abstract geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M0,0 L100,0 L100,100 L0,100 Z"
            fill="url(#heroGradient)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="heroGradient" gradientTransform="rotate(60)">
              <motion.stop
                offset="0%"
                stopColor="#4f46e5"
                animate={{ stopColor: ["#4f46e5", "#8b5cf6", "#6366f1", "#4f46e5"] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.stop
                offset="100%"
                stopColor="#8b5cf6"
                animate={{ stopColor: ["#8b5cf6", "#6366f1", "#4f46e5", "#8b5cf6"] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Enhanced animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full bg-white"
            style={{
              width: element.size,
              height: element.size,
              left: `${element.x}%`,
              top: `${element.y}%`,
              filter: "blur(1px)"
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Enhanced animated geometric shapes */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute w-96 h-96 bg-indigo-500 rounded-full opacity-20 blur-3xl"
          style={{ top: "5%", left: "0%" }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-[40rem] h-[40rem] bg-purple-500 rounded-full opacity-20 blur-3xl"
          style={{ bottom: "0%", right: "5%" }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute w-[35rem] h-[35rem] bg-blue-400 rounded-full opacity-20 blur-3xl"
          style={{ top: "20%", right: "15%" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col min-h-screen justify-center py-20 md:py-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left Content - Text */}
            <motion.div 
              variants={itemVariants}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block px-6 py-2 rounded-full bg-indigo-100 bg-opacity-20 backdrop-blur-sm mb-8 border border-indigo-200 border-opacity-20"
              >
                <span className="text-indigo-100 text-sm font-semibold tracking-wider">
                  India's Premier Education Platform
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-5xl tracking-tight font-black text-white sm:text-6xl md:text-7xl leading-tight"
              >
                <motion.span
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white"
                >
                  Welcome to Pathshala
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="block text-indigo-200 mt-4 text-4xl md:text-5xl"
                >
                  Your Learning Journey Starts Here
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-10 text-lg text-indigo-100 sm:text-xl md:mt-10 md:text-2xl md:max-w-2xl leading-relaxed font-medium"
              >
                Connect with the best local coaching centers in your area.
                Find the perfect match for your educational needs and accelerate your learning journey today.
              </motion.p>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="mt-14 sm:flex sm:justify-start space-y-5 sm:space-y-0 sm:space-x-8"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -5px rgba(79, 70, 229, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/student/login"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-bold rounded-2xl text-indigo-600 bg-white hover:bg-gray-50 md:text-xl md:px-12 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-indigo-100 group-hover:translate-x-0 group-hover:translate-y-0 rounded-2xl"></span>
                    <span className="absolute inset-0 w-full h-full border-2 border-indigo-600 rounded-2xl"></span>
                    <span className="relative flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      I'm a Student
                    </span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px -5px rgba(79, 70, 229, 0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/coaching/login"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 md:text-xl md:px-12 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-indigo-800 group-hover:translate-x-0 group-hover:translate-y-0 rounded-2xl"></span>
                    <span className="absolute inset-0 w-full h-full border-2 border-white rounded-2xl"></span>
                    <span className="relative flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      I'm a Coaching Center
                    </span>
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* Enhanced trust indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="mt-16 hidden md:block"
              >
                <p className="text-indigo-200 text-lg font-medium mb-4">Trusted by educators across India</p>
                <div className="flex items-center justify-start space-x-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-4 py-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">1000+</p>
                      <p className="text-indigo-200 text-sm">Active Centers</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-4 py-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">50,000+</p>
                      <p className="text-indigo-200 text-sm">Students</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl px-4 py-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-bold">5000+</p>
                      <p className="text-indigo-200 text-sm">Courses</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Enhanced Illustration */}
            <motion.div
              variants={itemVariants}
              className="relative hidden lg:block"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="relative mx-auto w-full max-w-2xl"
              >
                {/* Main illustration */}
                <div className="relative">
                  {/* Enhanced card backdrop with glow effect */}
                  <motion.div
                    className="absolute -inset-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-30 blur-2xl"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  {/* Enhanced card with student illustration */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white border-opacity-20 p-8"
                  >
                    {/* Mockup image */}
                    <img 
                      src="./group.png" 
                      alt="Student learning" 
                      className="w-full h-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500" 
                    />
                  </motion.div>
                </div>

              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <span className="text-white text-lg font-medium mb-3">Scroll to explore</span>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;