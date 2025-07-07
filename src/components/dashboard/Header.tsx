// src/components/dashboard/Header/Header.tsx
import React from 'react';
import { Bars3Icon, BellIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
//mport { useTheme } from '../../../contexts/ThemeContext';
import SearchBar from './SearchBar';
import UserProfile from './UserProfile';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarCollapsed }) => {
  const {  setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Page Title */}
          <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} transition-all duration-300`}>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back, John! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle with Tooltip */}
          <div className="relative group">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs bg-gray-800 dark:bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            </span>
          </div>

          {/* Notifications */}
          <button 
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;