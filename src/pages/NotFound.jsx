import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6"
    >
      <div className="text-center">
        {/* Optional SVG Illustration */}
        <svg className="w-48 h-48 mx-auto mb-6 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18v-6a3 3 0 1 1 6 0v6" />
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15h8M10 8h4" />
        </svg>

        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Oops! Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          The page you're looking for doesn't exist, or has been moved. Try checking the URL or return to the dashboard.
        </p>

        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          aria-label="Go to Dashboard"
        >
          ⬅️ Go to Dashboard
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
