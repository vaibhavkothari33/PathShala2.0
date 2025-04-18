import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Bell, Lock, Moon, Sun, 
  Globe, Shield, Mail, 
  CreditCard, HelpCircle, 
  LogOut, Check, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    emailUpdates: true,
    language: 'en',
    twoFactorAuth: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Settings updated successfully!');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    }
  };

  const settingGroups = [
    {
      title: 'Appearance',
      icon: settings.theme === 'light' ? Sun : Moon,
      settings: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose between light and dark mode',
          type: 'toggle',
          value: settings.theme,
          options: [
            { label: 'Light', value: 'light', icon: Sun },
            { label: 'Dark', value: 'dark', icon: Moon }
          ]
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          description: 'Receive push notifications for updates',
          type: 'toggle',
          value: settings.notifications
        },
        {
          id: 'emailUpdates',
          label: 'Email Updates',
          description: 'Receive email notifications for important updates',
          type: 'toggle',
          value: settings.emailUpdates
        }
      ]
    },
    {
      title: 'Security',
      icon: Shield,
      settings: [
        {
          id: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          type: 'toggle',
          value: settings.twoFactorAuth
        }
      ]
    },
    {
      title: 'Language & Region',
      icon: Globe,
      settings: [
        {
          id: 'language',
          label: 'Language',
          description: 'Choose your preferred language',
          type: 'select',
          value: settings.language,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Spanish', value: 'es' }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="space-y-8">
              {settingGroups.map((group, groupIndex) => (
                <motion.div
                  key={groupIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="border-b border-gray-200 pb-8 last:border-0"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <group.icon className="h-5 w-5 text-gray-500" />
                    <h2 className="text-lg font-semibold text-gray-900">{group.title}</h2>
                  </div>

                  <div className="space-y-6">
                    {group.settings.map((setting, settingIndex) => (
                      <div key={settingIndex} className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{setting.label}</h3>
                          <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                        </div>

                        {setting.type === 'toggle' && (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={setting.value}
                              onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        )}

                        {setting.type === 'select' && (
                          <select
                            value={setting.value}
                            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {setting.options.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 