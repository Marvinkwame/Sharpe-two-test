
import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

interface SidebarItemProps {
  item: {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick,
}) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={clsx(
        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
        isActive
          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
        isCollapsed ? 'justify-center' : 'justify-start'
      )}
      title={isCollapsed ? item.name : ''}
    >
      <Icon
        className={clsx(
          'w-5 h-5 transition-colors',
          isActive
            ? 'text-indigo-700 dark:text-indigo-300'
            : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300',
          !isCollapsed && 'mr-3'
        )}
      />
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  );
};

export default SidebarItem;