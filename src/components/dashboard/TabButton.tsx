// src/components/dashboard/TabContent/TabButton.tsx
import React from 'react';
import { clsx } from 'clsx';

interface TabButtonProps {
  tab: {
    id: string;
    label: string;
    content: React.ReactNode;
  };
  isActive: boolean;
  onClick: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
        isActive
          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
      )}
    >
      {tab.label}
    </button>
  );
};

export default TabButton;