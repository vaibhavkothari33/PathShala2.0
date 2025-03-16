import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
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

  const [openFaq, setOpenFaq] = useState(null);

  // Toggle function for FAQ items
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // FAQ data
  const faqs = [
    {
      question: "How does Pathshala help students find coaching centers?",
      answer: "Pathshala connects students with coaching centers based on their location, subject preferences, and learning goals. Our platform uses an advanced matching algorithm to recommend the most suitable coaching centers for each student's needs."
    },
    {
      question: "How do I register my coaching center on Pathshala?",
      answer: "Simply click on the 'I'm a Coaching Center' button on our homepage. You'll be guided through a step-by-step registration process where you can add details about your coaching center, subjects offered, faculty, and student achievements."
    },
    {
      question: "Is Pathshala free for students to use?",
      answer: "Yes, Pathshala is completely free for students. You can browse coaching centers, read reviews, compare options, and even schedule demo classes at no cost. We're committed to making education accessible to everyone."
    },
    {
      question: "How are coaching centers verified on Pathshala?",
      answer: "We have a thorough verification process for all coaching centers that register on our platform. This includes checking business licenses, teacher qualifications, and physical location verification. We also collect and verify student reviews to ensure quality."
    },
    {
      question: "Can I get discounts on coaching fees through Pathshala?",
      answer: "Yes! Many coaching centers offer special discounts and scholarships for students who join through our platform. Look for the 'Special Offer' tag on coaching profiles to find these opportunities."
    }
  ];
  const testimonials = [
    {
      name: "Rahul Singh",
      role: "JEE Advanced Student",
      content: "Pathshala helped me find the perfect coaching center for my JEE preparation. The personalized recommendations saved me weeks of research. I'm now studying at one of the top institutes in my city!",
      image: null
    },
    {
      name: "Priya Sharma",
      role: "NEET Aspirant",
      content: "I was struggling to find good NEET coaching in my neighborhood. Pathshala not only showed me all the options but also helped me compare them based on student reviews and success rates.",
      image: null
    },
    {
      name: "Vikram Malhotra",
      role: "Director, Excel Academy",
      content: "Since joining Pathshala as a coaching partner, our student enrollment has increased by 40%. The platform makes it easy to showcase our achievements and connect with serious students.",
      image: null
    },
    {
      name: "Ananya Desai",
      role: "Class 10 Student",
      content: "The demo classes feature on Pathshala is amazing! I could try different coaching styles before committing to one. Found an awesome math tutor who explains concepts in a way I actually understand.",
      image: null
    },
    {
      name: "Mohammed Farhan",
      role: "Parent",
      content: "As a parent, I was concerned about finding quality coaching for my daughter. Pathshala's verification system gave me confidence in my choice. The detailed profiles helped us make an informed decision.",
      image: null
    },
    {
      name: "Lakshmi Iyer",
      role: "Owner, Bright Minds Institute",
      content: "Pathshala has revolutionized how we attract students. Their marketing tools and analytics help us understand what students are looking for and improve our offerings accordingly.",
      image: null
    }
  ];

  // Function to handle testimonial carousel (optional)
  // const [activePage, setActivePage] = useState(0);
  // const itemsPerPage = 3;
  // const pageCount = Math.ceil(testimonials.length / itemsPerPage);

  // const displayedTestimonials = testimonials.slice(
  //   activePage * itemsPerPage,
  //   (activePage + 1) * itemsPerPage
  // );

  // const nextPage = () => {
  //   setActivePage((prev) => (prev + 1) % pageCount);
  // };

  // const prevPage = () => {
  //   setActivePage((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
  // };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="bg-white overflow-hidden"
    >
      {/* Hero Section with Advanced Animation */}
      <div className="relative">
        <motion.div
          initial={{ skewY: 0 }}
          animate={{ skewY: -6 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500"
        >
          <motion.div
            animate={{
              background: [
                "linear-gradient(45deg, rgba(99,102,241,0.4) 0%, rgba(59,130,246,0.4) 100%)",
                "linear-gradient(45deg, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.4) 100%)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0"
          />
          {/* Animated particles background for added depth */}
          <motion.div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full opacity-20"
                style={{
                  width: Math.random() * 20 + 10,
                  height: Math.random() * 20 + 10,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 md:py-32">
            <motion.div
              variants={containerVariants}
              className="text-center"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl"
              >
                <motion.span
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="block bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200"
                >
                  Welcome to Pathshala
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  className="block text-indigo-200 mt-3"
                >
                  Your Learning Journey Starts Here
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mt-8 max-w-md mx-auto text-base text-indigo-100 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl leading-relaxed font-medium"
              >
                Connect with the best local coaching centers in your area.
                Find the perfect match for your educational needs.
              </motion.p>

              {/* Enhanced CTA Buttons with Interactive Effects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-12 max-w-lg mx-auto sm:flex sm:justify-center md:mt-14 space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/register?role=student"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-indigo-100 group-hover:translate-x-0 group-hover:translate-y-0 rounded-md"></span>
                    <span className="absolute inset-0 w-full h-full border-2 border-indigo-600 rounded-md"></span>
                    <span className="relative flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      I'm a Student
                    </span>
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 15px 30px -5px rgba(79, 70, 229, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link
                    to="/register?role=coaching"
                    className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 md:py-4 md:text-lg md:px-10 transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-1 translate-y-1 bg-indigo-800 group-hover:translate-x-0 group-hover:translate-y-0 rounded-md"></span>
                    <span className="absolute inset-0 w-full h-full border-2 border-white rounded-md"></span>
                    <span className="relative flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      I'm a Coaching Center
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Optional: Add a scrolling indicator for better UX */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="mt-16 hidden md:block"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex justify-center"
                >
                  <svg className="w-6 h-6 text-white opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section with Staggered Animation */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-base text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-4 py-1.5 rounded-full inline-block shadow-sm"
            >
              Features
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl"
            >
              Everything you need to find
              <span className="block text-indigo-600 mt-1">the perfect coaching</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-16"
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  }}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      type: "spring",
                      stiffness: 200
                    }}
                    viewport={{ once: true }}
                    className="absolute -top-5 left-6"
                  >
                    <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 p-3 shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                  </motion.div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">{feature.name}</h3>
                  <div className="mt-1 w-10 h-0.5 bg-indigo-500 rounded"></div>
                  <p className="mt-3 text-base text-gray-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Benefits Section with Interactive Elements */}
      <div className="py-20 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-base text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-4 py-1.5 rounded-full inline-block shadow-sm">
              Why Choose Us
            </span>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Benefits of using <span className="text-indigo-600">Pathshala</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 12px 24px -6px rgba(79, 70, 229, 0.25)"
                }}
                className="text-center p-8 rounded-xl hover:bg-indigo-50 transition-all duration-300 border border-gray-100 bg-white shadow-sm"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center mx-auto"
                >
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                </motion.div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">{benefit.title}</h3>
                <div className="w-10 h-0.5 bg-indigo-500 mx-auto my-3 rounded"></div>
                <p className="mt-3 text-base text-gray-500 leading-relaxed">{benefit.description}</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mt-5"
                >
                  <Link to={benefit.link || "#"} className="inline-flex items-center text-indigo-600 font-medium">
                    Learn more
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
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

      {/* New Section: Testimonials with Animation */}
      <div className="py-20 bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-base text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-4 py-1.5 rounded-full inline-block shadow-sm">
              Testimonials
            </span>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What our users are saying
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -8 }}
                className="bg-white p-6 rounded-xl shadow-md relative"
              >
                <div className="absolute -top-4 -left-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <svg className="h-8 w-8 text-indigo-500" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </motion.div>
                </div>
                <p className="text-gray-600 italic mt-4">{testimonial.content}</p>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-200 flex items-center justify-center">
                      <span className="text-indigo-700 font-medium">{testimonial.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Section: FAQ Accordion */}
      <div className="py-20 bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-base text-indigo-600 font-semibold tracking-wide uppercase bg-indigo-50 px-4 py-1.5 rounded-full inline-block shadow-sm">
              FAQ
            </span>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Find answers to common questions about Pathshala and how it works.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-lg"
              >
                <AnimatePresence>
                  <motion.div
                    className="border-b border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden"
                    initial={false}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                    >
                      <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                      <motion.span
                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.span>
                    </button>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: openFaq === index ? "auto" : 0 }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* New Section: Call to Action */}
      <div className="py-16 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 300 + 50,
                  height: Math.random() * 300 + 50,
                  borderRadius: '50%',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>

          <div className="relative">
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
              >
                Ready to start your learning journey?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="max-w-xl mt-4 mx-auto text-xl text-indigo-100"
              >
                Join thousands of students who are already benefiting from our platform.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-10"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10 shadow-lg"
                  >
                    Get Started Now
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
};
export default LandingPage; 