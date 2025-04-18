import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from '@headlessui/react';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout(navigate);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text hover:from-indigo-700 hover:to-blue-700 transition-all"
            >
              Pathshala
            </Link>
          </div>

          <div className="flex items-center">
            {user ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex items-center space-x-3 px-4 py-2 rounded-full hover:bg-gray-50 transition-colors duration-200">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-indigo-600 ring-offset-2"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-medium shadow-md">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium">{user.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform origin-top-right transition-all duration-200 p-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } px-4 py-3 text-sm text-gray-700 flex items-center rounded-lg hover:bg-gray-50 transition-colors duration-150`}
                      >
                        <User className="w-4 h-4 mr-3 text-indigo-600" />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${
                          active ? 'bg-gray-50' : ''
                        } px-4 py-3 text-sm text-gray-700 flex items-center rounded-lg hover:bg-gray-50 transition-colors duration-150`}
                      >
                        <Settings className="w-4 h-4 mr-3 text-indigo-600" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="h-px bg-gray-200 my-1"></div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className={`${
                          active ? 'bg-red-50' : ''
                        } w-full px-4 py-3 text-sm text-red-600 flex items-center rounded-lg hover:bg-red-50 transition-colors duration-150`}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {isLoading ? 'Logging out...' : 'Logout'}
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;