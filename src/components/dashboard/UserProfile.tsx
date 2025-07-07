
import React, { useState } from 'react';
import { ChevronDownIcon, UserIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
//import { useAuth } from '../../../contexts/AuthContext';

interface UserProfileProps {
  userName?: string;
  userRole?: string;
  userInitials?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userName = 'John Doe',
  // userRole = 'Administrator',
  userInitials = 'JD'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    setIsOpen(false);
    // Optional: Redirect to login page after logout
    // window.location.href = '/login';
  };

  // Use actual user data if available
  const displayName = user?.name || userName;
  const displayRole = user?.role === 'admin' ? 'Administrator' : 'User';
  const displayInitials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : userInitials;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="User profile dropdown"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 font-medium text-sm">{displayInitials}</span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {displayRole}
          </p>
        </div>
        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="py-1">
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => e.preventDefault()}
            >
              <UserIcon className="w-4 h-4 mr-3" />
              Profile
            </a>
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => e.preventDefault()}
            >
              <CogIcon className="w-4 h-4 mr-3" />
              Settings
            </a>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;