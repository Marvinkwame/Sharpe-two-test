
import React from 'react';
import {  useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CogIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggle: () => void;
  onCollapse: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon },
  { name: 'Customers', href: '/dashboard/customers', icon: UsersIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggle,
  onCollapse,
}) => {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300 ${
          isCollapsed ? 'lg:w-24' : 'lg:w-64'
        }`}
      >
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EC</span>
              </div>
              {!isCollapsed && (
                <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                  ECommerce
                </span>
              )}
            </div>
            <button
              onClick={onCollapse}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
                isActive={location.pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* User Profile */}
          {!isCollapsed && (
            <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium">JD</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Admin
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EC</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                ECommerce
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-2">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                item={item}
                isActive={location.pathname === item.href}
                isCollapsed={false}
                onClick={onToggle}
              />
            ))}
          </nav>

          {/* User Profile */}
          <div className="px-4 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">JD</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;